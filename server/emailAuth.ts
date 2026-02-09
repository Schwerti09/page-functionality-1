import bcrypt from "bcrypt";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { db } from "./db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";
import { storage } from "./storage";

const SALT_ROUNDS = 10;

// Admin emails - these users can grant test credits
const ADMIN_EMAILS = ["schwertfechterrolle@web.de", "rps-vertrieb@t-online.de"];

// Free credits for new users (1 free deploy to try the service)
const FREE_WELCOME_CREDITS = 1;

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      maxAge: sessionTtl,
    },
  });
}

export async function setupEmailAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email und Passwort sind erforderlich" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Passwort muss mindestens 6 Zeichen haben" });
      }

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser.length > 0) {
        return res.status(409).json({ message: "Ein Benutzer mit dieser Email existiert bereits" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const isAdmin = ADMIN_EMAILS.includes(email);
      const [newUser] = await db.insert(users).values({
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        isAdmin,
      }).returning();

      // NOTE: Free credits are now granted after card verification (Setup Intent)
      // This prevents abuse by creating multiple accounts with fake emails
      console.log(`New user registered: ${email} - card verification required for free credit`);

      // Log user in
      (req.session as any).userId = newUser.id;
      (req.session as any).user = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isAdmin: newUser.isAdmin,
      };

      res.json({ 
        success: true, 
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isAdmin: newUser.isAdmin,
          cardVerified: false,
        },
        requiresCardVerification: true,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registrierung fehlgeschlagen" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email und Passwort sind erforderlich" });
      }

      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user) {
        return res.status(401).json({ message: "Email oder Passwort falsch" });
      }

      if (!user.passwordHash) {
        return res.status(401).json({ message: "Bitte setze ein Passwort oder registriere dich neu" });
      }

      // Check password
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Email oder Passwort falsch" });
      }

      // Update isAdmin if this is an admin email
      if (ADMIN_EMAILS.includes(email) && !user.isAdmin) {
        await db.update(users).set({ isAdmin: true }).where(eq(users.id, user.id));
        user.isAdmin = true;
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      };

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login fehlgeschlagen" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout fehlgeschlagen" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  // Legacy redirect for old login flow
  app.get("/api/login", (req, res) => {
    res.redirect("/?showLogin=true");
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    const user = (req.session as any).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(user);
  });
}

// Middleware to check if user is authenticated
export const isAuthenticated: RequestHandler = (req, res, next) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Add user info to request for compatibility
  (req as any).user = {
    claims: {
      sub: userId,
    },
    ...(req.session as any).user,
  };
  
  next();
};

// Middleware to check if user is admin
export const isAdmin: RequestHandler = (req, res, next) => {
  const user = (req.session as any)?.user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Nur für Administratoren" });
  }
  next();
};
