import { sql } from "drizzle-orm";
import { pgTable, text, serial, timestamp, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Re-export auth models
export * from "./models/auth";

// Email subscribers - for early access signups
export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  source: text("source").default("landing").notNull(), // where they signed up
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).omit({
  id: true,
  createdAt: true,
});

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;

// Purchases table - tracks what users have bought
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  planType: text("plan_type").notNull(), // 'single', 'pack', 'unlimited'
  deploysIncluded: integer("deploys_included").notNull(), // 1, 10, or -1 for unlimited
  deploysUsed: integer("deploys_used").default(0).notNull(),
  amountPaid: integer("amount_paid").notNull(), // in cents
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // expiration date for monthly subscriptions
  isActive: boolean("is_active").default(true).notNull(),
});

// GitHub connections - stores OAuth tokens per user
export const githubConnections = pgTable("github_connections", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  githubUserId: varchar("github_user_id").notNull(),
  githubUsername: varchar("github_username").notNull(),
  githubAvatarUrl: text("github_avatar_url"),
  accessToken: text("access_token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGithubConnectionSchema = createInsertSchema(githubConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type GithubConnection = typeof githubConnections.$inferSelect;
export type InsertGithubConnection = z.infer<typeof insertGithubConnectionSchema>;

// Deploys table - tracks individual deployments
export const deploys = pgTable("deploys", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  purchaseId: integer("purchase_id"),
  projectName: text("project_name").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'processing', 'success', 'failed'
  githubRepoUrl: text("github_repo_url"), // URL to the created GitHub repo
  githubRepoOwner: text("github_repo_owner"),
  githubRepoName: text("github_repo_name"),
  filesCount: integer("files_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const purchasesRelations = relations(purchases, ({ many }) => ({
  deploys: many(deploys),
}));

export const deploysRelations = relations(deploys, ({ one }) => ({
  purchase: one(purchases, {
    fields: [deploys.purchaseId],
    references: [purchases.id],
  }),
}));

// Insert schemas
export const insertPurchaseSchema = createInsertSchema(purchases).omit({ 
  id: true, 
  createdAt: true,
  deploysUsed: true,
  isActive: true,
});

export const insertDeploySchema = createInsertSchema(deploys).omit({ 
  id: true, 
  createdAt: true,
  completedAt: true,
  status: true,
});

// Types
export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Deploy = typeof deploys.$inferSelect;
export type InsertDeploy = z.infer<typeof insertDeploySchema>;

// Subscription Plans - SaaS Model
export const SUBSCRIPTION_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    headline: { en: 'For Hobbyists', de: 'Für Hobbyisten' },
    price: 0, // Free
    priceDisplay: { en: '0€', de: '0€' },
    interval: 'month',
    maxProjects: 1,
    features: {
      en: [
        '1 Active Project',
        'Community Support',
        'zip-ship.io subdomains',
        'Standard Edge Network'
      ],
      de: [
        '1 aktives Projekt',
        'Community Support',
        'zip-ship.io Subdomains',
        'Standard Edge Network'
      ]
    },
    cta: { en: 'Start for Free', de: 'Kostenlos starten' },
    isPopular: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    headline: { en: 'For Creators & Indie Hackers', de: 'Für Creators & Indie Hacker' },
    price: 1900, // cents (19€)
    priceDisplay: { en: '19€', de: '19€' },
    interval: 'month',
    maxProjects: 5,
    features: {
      en: [
        'Unlimited Deployments',
        '5 Active Projects',
        'Custom Domains (SSL included)',
        'Priority Build Queue',
        'No Cold Starts',
        'Email Support'
      ],
      de: [
        'Unbegrenzte Deployments',
        '5 aktive Projekte',
        'Custom Domains (SSL inklusive)',
        'Priority Build Queue',
        'Keine Cold Starts',
        'Email Support'
      ]
    },
    cta: { en: 'Start 7-Day Trial', de: '7 Tage kostenlos testen' },
    isPopular: true,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || null,
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    headline: { en: 'For Teams & Scale', de: 'Für Teams & Skalierung' },
    price: 4900, // cents (49€)
    priceDisplay: { en: '49€', de: '49€' },
    interval: 'month',
    maxProjects: -1, // Unlimited
    features: {
      en: [
        'Unlimited Projects',
        'Team Collaboration (Invite Users)',
        'Analytics Dashboard',
        '<50ms Global Latency Guarantee',
        '24/7 Priority Support',
        'SLA 99.99%'
      ],
      de: [
        'Unbegrenzte Projekte',
        'Team-Zusammenarbeit (Nutzer einladen)',
        'Analytics Dashboard',
        '<50ms Globale Latenz-Garantie',
        '24/7 Priority Support',
        'SLA 99.99%'
      ]
    },
    cta: { en: 'Contact Sales', de: 'Vertrieb kontaktieren' },
    isPopular: false,
    stripePriceId: process.env.STRIPE_AGENCY_PRICE_ID || null,
  },
} as const;

export type SubscriptionPlanType = keyof typeof SUBSCRIPTION_PLANS;

// Legacy - keep for backwards compatibility with old purchases
export const PRICING_PLANS = {
  single: { id: 'single', name: '1 Deploy', deploys: 1, price: 299, priceDisplay: '2,99€' },
  pack: { id: 'pack', name: '10 Deploys', deploys: 10, price: 999, priceDisplay: '9,99€' },
  unlimited: { id: 'unlimited', name: 'Unlimited', deploys: -1, price: 2999, priceDisplay: '29,99€' },
} as const;

export type PlanType = keyof typeof PRICING_PLANS;

// Chat conversations for AI integration
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
