import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table with email/password auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"), // For email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false), // Admin flag for test credits
  cardVerified: boolean("card_verified").default(false), // Card verification for free credits
  stripeCustomerId: varchar("stripe_customer_id"), // Stripe customer ID
  // Subscription fields
  subscriptionPlan: varchar("subscription_plan").default("starter"), // starter, pro, agency
  subscriptionStatus: varchar("subscription_status").default("active"), // active, canceled, past_due, trialing
  stripeSubscriptionId: varchar("stripe_subscription_id"), // Stripe subscription ID
  subscriptionStartedAt: timestamp("subscription_started_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"), // For canceled subscriptions
  currentProjectCount: varchar("current_project_count").default("0"), // Track active projects
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
