import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupEmailAuth, isAuthenticated, isAdmin } from "./emailAuth";
import { PRICING_PLANS, SUBSCRIPTION_PLANS, type PlanType, type SubscriptionPlanType } from "@shared/schema";
import Stripe from "stripe";
import { z } from "zod";
import multer from "multer";
import AdmZip from "adm-zip";
import { createRepoFromFiles, getGitHubAuthUrl, exchangeCodeForToken, getGitHubUserFromToken, GITHUB_CLIENT_ID, checkRepoExists } from "./github";
import path from "path";
import fs from "fs";
import { analyzeAndFixProject, generateMinimalFavicon } from "./ai-fixer";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-01-28.clover" })
  : null;

const deploySchema = z.object({
  projectName: z.string().min(1, "Project name is required").max(100, "Project name too long"),
});

const checkoutSchema = z.object({
  planId: z.enum(['starter', 'pro', 'agency']),
});

const emailSubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
});

function getBaseUrl(req: any): string {
  const host = req.get('host');
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  return `${protocol}://${host}`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupEmailAuth(app);

  // SEO files - serve from client/public
  const publicPath = path.resolve(process.cwd(), 'client/public');
  
  app.get('/sitemap.xml', (_req, res) => {
    res.sendFile(path.join(publicPath, 'sitemap.xml'));
  });
  
  app.get('/robots.txt', (_req, res) => {
    res.sendFile(path.join(publicPath, 'robots.txt'));
  });
  
  app.get('/googleb629ac432cdf0f21.html', (_req, res) => {
    res.sendFile(path.join(publicPath, 'googleb629ac432cdf0f21.html'));
  });

  // Swagger API Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none } .swagger-ui { background: #0A0E27; } .swagger-ui .info .title { color: #00F0FF; }',
    customSiteTitle: 'ZIP-SHIP API Documentation'
  }));

  // Public endpoint - no auth required for email subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      const parseResult = emailSubscribeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid email", 
          errors: parseResult.error.errors 
        });
      }

      const { email, source } = parseResult.data;
      const subscriber = await storage.subscribeEmail(email, source || 'landing');
      
      if (subscriber) {
        res.status(201).json({ message: "Successfully subscribed!", email: subscriber.email });
      } else {
        // Email might already exist - still return success for UX
        res.status(200).json({ message: "You're already on the list!", email });
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Get subscription plans - public endpoint
  app.get("/api/plans", (req, res) => {
    res.json(SUBSCRIPTION_PLANS);
  });

  app.get("/api/user/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/deploys", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deploys = await storage.getUserDeploys(userId);
      res.json(deploys);
    } catch (error) {
      console.error("Error fetching deploys:", error);
      res.status(500).json({ message: "Failed to fetch deploys" });
    }
  });

  // Configure multer for ZIP file uploads (in memory)
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
        cb(null, true);
      } else {
        cb(new Error('Only ZIP files are allowed'));
      }
    }
  });

  // Legacy deploy endpoint (without file)
  app.post("/api/deploys", isAuthenticated, async (req: any, res) => {
    try {
      const parseResult = deploySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: parseResult.error.errors 
        });
      }

      const userId = req.user.claims.sub;
      const { projectName } = parseResult.data;

      const stats = await storage.getUserStats(userId);
      if (stats.remainingDeploys === 0) {
        return res.status(402).json({ message: "No deploys remaining. Please purchase more." });
      }

      const deploy = await storage.createDeploy(userId, projectName);
      res.status(201).json(deploy);
    } catch (error) {
      console.error("Error creating deploy:", error);
      res.status(500).json({ message: "Failed to create deploy" });
    }
  });

  // New ZIP upload endpoint - creates GitHub repo
  app.post("/api/deploy-zip", isAuthenticated, upload.single('file'), async (req: any, res) => {
    let deploy: any = null;
    
    try {
      const userId = req.user.claims.sub;
      const projectName = req.body.projectName || 'zipship-project';
      const aiFixEnabled = req.body.aiFixEnabled === 'true' || req.body.aiFixEnabled === true;
      
      // Check credits
      const stats = await storage.getUserStats(userId);
      if (stats.remainingDeploys === 0 && !stats.hasUnlimited) {
        return res.status(402).json({ message: "No deploys remaining. Please purchase more." });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No ZIP file uploaded" });
      }
      
      // Create deploy record first
      deploy = await storage.createDeploy(userId, projectName);
      
      // Extract ZIP contents
      const zip = new AdmZip(req.file.buffer);
      const zipEntries = zip.getEntries();
      
      // SECURITY: Path traversal warnings
      const pathTraversalWarnings: string[] = [];
      
      // Filter valid entries (no directories, hidden files, etc.)
      const validEntries = zipEntries.filter((entry: AdmZip.IZipEntry) => {
        if (entry.isDirectory) return false;
        if (entry.entryName.startsWith('.') || entry.entryName.includes('/.')) return false;
        if (entry.entryName.includes('__MACOSX')) return false;
        if (entry.entryName.includes('node_modules/')) return false;
        
        // SECURITY: Block path traversal attacks
        if (entry.entryName.includes('..')) {
          pathTraversalWarnings.push(`Blocked path traversal: ${entry.entryName}`);
          return false;
        }
        
        // SECURITY: Block absolute paths
        if (entry.entryName.startsWith('/')) {
          pathTraversalWarnings.push(`Blocked absolute path: ${entry.entryName}`);
          return false;
        }
        
        return true;
      });
      
      if (pathTraversalWarnings.length > 0) {
        console.warn("Security warnings:", pathTraversalWarnings);
      }
      
      // Detect common wrapper folder ONCE before processing files
      let wrapperPrefix = '';
      if (validEntries.length > 0) {
        const firstPath = validEntries[0].entryName;
        const firstParts = firstPath.split('/');
        if (firstParts.length > 1) {
          const potentialWrapper = firstParts[0] + '/';
          // Check if ALL valid entries start with this wrapper
          const allHaveWrapper = validEntries.every((e: AdmZip.IZipEntry) => 
            e.entryName.startsWith(potentialWrapper)
          );
          if (allHaveWrapper) {
            wrapperPrefix = potentialWrapper;
            console.log(`Detected wrapper folder: ${wrapperPrefix}`);
          }
        }
      }
      
      // Collect file contents with proper binary/text handling
      const textExtensions = /\.(txt|js|ts|jsx|tsx|json|html|css|scss|sass|less|py|java|c|cpp|h|hpp|cs|go|rs|rb|php|md|yml|yaml|xml|svg|sh|bash|zsh|vue|svelte|astro|sql|graphql|toml|ini|cfg|conf|gitignore|env\.example)$/i;
      const files: { path: string; content: string; isBinary?: boolean }[] = [];
      
      for (const entry of validEntries) {
        const rawContent = zip.readFile(entry);
        if (rawContent) {
          // Remove wrapper prefix if detected
          let filePath = entry.entryName;
          if (wrapperPrefix && filePath.startsWith(wrapperPrefix)) {
            filePath = filePath.substring(wrapperPrefix.length);
          }
          if (filePath) {
            // Detect if file is text or binary
            const isText = textExtensions.test(filePath);
            files.push({
              path: filePath,
              content: isText ? rawContent.toString('utf-8') : rawContent.toString('base64'),
              isBinary: !isText,
            });
          }
        }
      }
      
      if (files.length === 0) {
        await storage.failDeploy(deploy.id);
        return res.status(400).json({ message: "ZIP file is empty or contains no valid files" });
      }
      
      // VALIDATION: Analyze package manifests for problematic dependencies
      const manifestWarnings: string[] = [];
      
      const packageJson = files.find(f => f.path === 'package.json');
      if (packageJson) {
        try {
          const pkg = JSON.parse(packageJson.content);
          const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
          for (const [name, version] of Object.entries(allDeps)) {
            const versionStr = String(version);
            if (versionStr.startsWith('file:') || versionStr.startsWith('link:')) {
              manifestWarnings.push(`Lokale Abhängigkeit gefunden: ${name} (${versionStr}) - wird auf GitHub nicht funktionieren`);
            }
          }
        } catch (e) {
          manifestWarnings.push('package.json konnte nicht geparst werden');
        }
      }
      
      const requirementsTxt = files.find(f => f.path === 'requirements.txt');
      if (requirementsTxt) {
        const lines = requirementsTxt.content.split('\n');
        for (const line of lines) {
          if (line.includes('-e file:') || line.includes('file://') || line.match(/^\.\//)) {
            manifestWarnings.push(`Lokale Python-Abhängigkeit: ${line.trim()}`);
          }
        }
      }
      
      // SANITY CHECK: Ensure there are actual source files
      const sourceExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs', '.rb', '.php', '.c', '.cpp', '.cs', '.html', '.css', '.vue', '.svelte'];
      const hasSourceFiles = files.some(f => sourceExtensions.some(ext => f.path.endsWith(ext)));
      
      if (!hasSourceFiles) {
        manifestWarnings.push('Keine erkennbaren Quelldateien gefunden (.js, .ts, .py, etc.)');
      }
      
      // Log warnings but don't block (user might know what they're doing)
      if (manifestWarnings.length > 0) {
        console.log("Manifest/Sanity warnings for project:", projectName, manifestWarnings);
      }
      
      // AI-powered project fixing if enabled
      let aiChanges: string[] = [];
      let finalFiles = files;
      
      if (aiFixEnabled) {
        console.log(`AI Fix enabled for project: ${projectName}`);
        const fixResult = await analyzeAndFixProject(files);
        
        if (fixResult.errors.length > 0) {
          console.log("AI Fix errors:", fixResult.errors);
        }
        
        if (fixResult.fixed && fixResult.files.length > 0) {
          finalFiles = fixResult.files;
          aiChanges = fixResult.changes;
          console.log(`AI Fix applied ${aiChanges.length} changes`);
        }
      }
      
      // Check if user is on Free Tier (Starter plan) - inject badge for viral loop
      const user = await storage.getUser(userId);
      const isFreeTier = !user?.subscriptionPlan || user.subscriptionPlan === 'starter';
      
      // Create GitHub repo (using user's connected GitHub account)
      // Inject "Powered by Zip-Ship" badge for Free Tier users only
      const githubResult = await createRepoFromFiles(userId, projectName, finalFiles, false, isFreeTier);
      
      // Update deploy with GitHub info
      const updatedDeploy = await storage.updateDeployWithGitHub(deploy.id, {
        repoUrl: githubResult.repoUrl,
        owner: githubResult.owner,
        repo: githubResult.repo,
        filesCount: files.length,
      });
      
      const message = githubResult.isUpdate 
        ? "Repository erfolgreich aktualisiert!" 
        : "Repository erfolgreich erstellt!";
      
      res.status(201).json({
        ...updatedDeploy,
        message,
        githubUrl: githubResult.repoUrl,
        isUpdate: githubResult.isUpdate,
        aiFixApplied: aiChanges.length > 0,
        aiChanges,
        warnings: [...pathTraversalWarnings, ...manifestWarnings],
      });
      
    } catch (error: any) {
      console.error("Error in ZIP deploy:", error);
      
      // Mark deploy as failed if we created one
      if (deploy) {
        await storage.failDeploy(deploy.id);
      }
      
      // Check for specific GitHub errors
      if (error.message?.includes('GitHub not connected')) {
        return res.status(503).json({ message: "GitHub is not connected. Please connect your GitHub account." });
      }
      
      res.status(500).json({ message: error.message || "Failed to deploy. Please try again." });
    }
  });

  // Check GitHub connection status
  // GitHub OAuth: Start authorization flow
  app.get("/api/github/auth", isAuthenticated, async (req: any, res) => {
    try {
      if (!GITHUB_CLIENT_ID) {
        return res.status(503).json({ message: "GitHub OAuth not configured" });
      }
      const userId = req.user.claims.sub;
      const baseUrl = getBaseUrl(req);
      // Use userId as state to verify callback
      const authUrl = getGitHubAuthUrl(userId, baseUrl);
      res.json({ url: authUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GitHub OAuth: Callback after user authorizes
  app.get("/api/github/callback", async (req: any, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code || !state) {
        return res.redirect('/dashboard?github_error=missing_params');
      }
      
      const userId = state as string;
      console.log("GitHub callback for user:", userId);
      
      // Exchange code for access token
      const accessToken = await exchangeCodeForToken(code as string);
      console.log("Got access token for user:", userId);
      
      // Get GitHub user info
      const githubUser = await getGitHubUserFromToken(accessToken);
      console.log("GitHub user:", githubUser.login);
      
      // Save connection to database (state = userId)
      await storage.saveGithubConnection({
        userId,
        githubUserId: String(githubUser.id),
        githubUsername: githubUser.login,
        githubAvatarUrl: githubUser.avatar_url || null,
        accessToken,
      });
      console.log("Saved GitHub connection for user:", userId);
      
      // Restore user session after GitHub redirect
      // This is critical - we regenerate the session to ensure it persists
      const user = await storage.getUserById(userId);
      if (user) {
        // First, regenerate the session to get a fresh session ID
        await new Promise<void>((resolve, reject) => {
          req.session.regenerate((err: any) => {
            if (err) {
              console.error("Session regenerate error:", err);
              // Don't reject - try to continue with existing session
              resolve();
            } else {
              console.log("Session regenerated for user:", user.email);
              resolve();
            }
          });
        });
        
        // Set session data
        (req.session as any).userId = user.id;
        (req.session as any).user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        };
        console.log("Session data set for user:", user.email);
        
        // Save the session before redirect
        await new Promise<void>((resolve, reject) => {
          req.session.save((err: any) => {
            if (err) {
              console.error("Session save error:", err);
              reject(err);
            } else {
              console.log("Session saved successfully for user:", user.email);
              resolve();
            }
          });
        });
      } else {
        console.error("User not found for ID:", userId);
      }
      
      res.redirect('/dashboard?github_connected=true');
    } catch (error: any) {
      console.error("GitHub OAuth callback error:", error);
      res.redirect('/dashboard?github_error=' + encodeURIComponent(error.message));
    }
  });

  // GitHub: Get connection status for current user
  app.get("/api/github/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connection = await storage.getGithubConnection(userId);
      
      if (connection) {
        res.json({ 
          connected: true, 
          username: connection.githubUsername,
          avatarUrl: connection.githubAvatarUrl,
        });
      } else {
        res.json({ 
          connected: false,
          oauthConfigured: !!GITHUB_CLIENT_ID,
        });
      }
    } catch (error: any) {
      res.json({ 
        connected: false,
        error: error.message,
      });
    }
  });

  // GitHub: Disconnect account
  app.post("/api/github/disconnect", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteGithubConnection(userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/checkout", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment system not configured" });
      }

      const parseResult = checkoutSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid plan", 
          errors: parseResult.error.errors 
        });
      }

      const userId = req.user.claims.sub;
      const { planId } = parseResult.data;
      const plan = SUBSCRIPTION_PLANS[planId as SubscriptionPlanType];
      const baseUrl = getBaseUrl(req);

      // Starter plan is free - just update user subscription
      if (planId === 'starter') {
        await storage.updateUserSubscription(userId, {
          subscriptionPlan: 'starter',
          subscriptionStatus: 'active',
          stripeSubscriptionId: null,
          subscriptionStartedAt: new Date(),
          subscriptionEndsAt: null,
        });
        return res.json({ url: `${baseUrl}/dashboard?plan=starter&success=true` });
      }

      // Get or create Stripe customer
      const user = await storage.getUser(userId);
      let customerId = user?.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user?.email || undefined,
          metadata: { userId },
        });
        customerId = customer.id;
        await storage.updateStripeCustomerId(userId, customerId);
      }

      // Create subscription checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `ZipShip ${plan.name}`,
                description: plan.headline.en,
              },
              unit_amount: plan.price,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        subscription_data: {
          trial_period_days: planId === 'pro' ? 7 : undefined, // 7-day trial for Pro
          metadata: {
            userId,
            planId,
          },
        },
        success_url: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard?canceled=true`,
        metadata: {
          userId,
          planId,
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.post("/api/webhook/stripe", async (req: any, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured" });
    }

    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction && !endpointSecret) {
      console.error("Stripe webhook secret not configured in production");
      return res.status(500).json({ message: "Webhook configuration error" });
    }

    let event;

    try {
      if (endpointSecret) {
        const rawBody = req.rawBody;
        if (!rawBody) {
          console.error("Raw body not available for webhook verification");
          return res.status(400).json({ message: "Raw body required for verification" });
        }
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
      } else if (!isProduction) {
        console.warn("WARNING: Accepting unverified webhook in development mode");
        event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } else {
        return res.status(400).json({ message: "Webhook signature required" });
      }
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, planId } = session.metadata || {};

      if (userId && planId && SUBSCRIPTION_PLANS[planId as SubscriptionPlanType]) {
        const subscriptionId = session.subscription as string;
        
        await storage.updateUserSubscription(userId, {
          subscriptionPlan: planId,
          subscriptionStatus: 'active',
          stripeSubscriptionId: subscriptionId,
          subscriptionStartedAt: new Date(),
          subscriptionEndsAt: null,
        });
      }
    }

    // Handle subscription updates
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      
      if (userId) {
        const status = subscription.status === 'active' || subscription.status === 'trialing' 
          ? 'active' 
          : subscription.status;
        
        await storage.updateUserSubscription(userId, {
          subscriptionStatus: status,
          subscriptionEndsAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
        });
      }
    }

    // Handle subscription cancellation
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      
      if (userId) {
        await storage.updateUserSubscription(userId, {
          subscriptionPlan: 'starter',
          subscriptionStatus: 'canceled',
          stripeSubscriptionId: null,
          subscriptionEndsAt: new Date(),
        });
      }
    }

    res.json({ received: true });
  });

  // Get Stripe publishable key for frontend
  app.get("/api/stripe-config", (req, res) => {
    res.json({ 
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null 
    });
  });

  // Create Stripe Setup Intent for card verification (no charge)
  app.post("/api/setup-intent", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if already verified
      if (user.cardVerified) {
        return res.json({ alreadyVerified: true });
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
        await storage.updateUserStripeCustomer(userId, customerId);
      }

      // Create Setup Intent
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        metadata: { userId: user.id },
      });

      res.json({ 
        clientSecret: setupIntent.client_secret,
        customerId,
      });
    } catch (error: any) {
      console.error("Error creating setup intent:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Confirm card verification after successful Setup Intent
  app.post("/api/verify-card", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }

      const userId = req.user.claims.sub;
      const { setupIntentId } = req.body;

      // Verify the Setup Intent was successful
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
      
      if (setupIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Card verification not completed" });
      }

      // Verify this belongs to the correct user
      if (setupIntent.metadata?.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Mark user as verified and grant free credit
      await storage.verifyUserCard(userId);
      
      // Grant the free welcome credit now
      await storage.createPurchase({
        userId,
        planType: 'welcome',
        deploysIncluded: 1,
        amountPaid: 0,
        stripePaymentId: `welcome_verified_${Date.now()}`,
      });

      res.json({ success: true, message: "Card verified! 1 free deploy granted." });
    } catch (error: any) {
      console.error("Error verifying card:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Check card verification status
  app.get("/api/card-status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        cardVerified: user.cardVerified || false,
        hasStripeCustomer: !!user.stripeCustomerId,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Test credits endpoint - grants free deploys for testing (ADMIN ONLY)
  app.post("/api/test/grant-credits", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount = 5 } = req.body;
      
      // Create a test purchase with free credits
      await storage.createPurchase({
        userId,
        planType: 'test',
        deploysIncluded: Math.min(amount, 10), // Max 10 test credits
        amountPaid: 0, // Free!
        stripePaymentId: `test_${Date.now()}`,
        expiresAt: null,
      });
      
      const stats = await storage.getUserStats(userId);
      res.json({ 
        message: `Granted ${Math.min(amount, 10)} test credits!`, 
        remainingDeploys: stats.remainingDeploys 
      });
    } catch (error) {
      console.error("Error granting test credits:", error);
      res.status(500).json({ message: "Failed to grant test credits" });
    }
  });

  return httpServer;
}
