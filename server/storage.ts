import { 
  purchases, 
  deploys,
  emailSubscribers,
  githubConnections,
  type Purchase, 
  type InsertPurchase, 
  type Deploy, 
  type InsertDeploy,
  type EmailSubscriber,
  type InsertEmailSubscriber,
  type GithubConnection,
  type InsertGithubConnection
} from "@shared/schema";
import { users, type User } from "@shared/models/auth";
import { db } from "./db";
import { eq, desc, and, gt, or, sql } from "drizzle-orm";

export interface IStorage {
  // Email Subscribers
  subscribeEmail(email: string, source?: string): Promise<EmailSubscriber | null>;
  
  // Purchases
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: string): Promise<Purchase[]>;
  getActivePurchases(userId: string): Promise<Purchase[]>;
  
  // Deploys
  createDeploy(userId: string, projectName: string): Promise<Deploy>;
  updateDeployWithGitHub(deployId: number, githubData: { repoUrl: string; owner: string; repo: string; filesCount: number }): Promise<Deploy>;
  failDeploy(deployId: number, error?: string): Promise<Deploy>;
  getUserDeploys(userId: string): Promise<Deploy[]>;
  
  // Stats
  getUserStats(userId: string): Promise<{
    totalDeploys: number;
    remainingDeploys: number;
    hasUnlimited: boolean;
    purchases: Purchase[];
  }>;
  
  // GitHub Connections
  getGithubConnection(userId: string): Promise<GithubConnection | null>;
  saveGithubConnection(connection: InsertGithubConnection): Promise<GithubConnection>;
  deleteGithubConnection(userId: string): Promise<void>;
  
  // Users
  getUserById(userId: string): Promise<User | null>;
  getUser(userId: string): Promise<User | null>;
  updateUserStripeCustomer(userId: string, stripeCustomerId: string): Promise<void>;
  verifyUserCard(userId: string): Promise<void>;
  
  // Subscriptions
  updateUserSubscription(userId: string, data: {
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    stripeSubscriptionId?: string | null;
    subscriptionStartedAt?: Date | null;
    subscriptionEndsAt?: Date | null;
  }): Promise<void>;
  updateStripeCustomerId(userId: string, customerId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async subscribeEmail(email: string, source: string = 'landing'): Promise<EmailSubscriber | null> {
    try {
      const [subscriber] = await db.insert(emailSubscribers)
        .values({ email, source })
        .onConflictDoNothing()
        .returning();
      return subscriber || null;
    } catch (error) {
      console.error("Error subscribing email:", error);
      return null;
    }
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db.insert(purchases).values(insertPurchase).returning();
    return purchase;
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    return await db.select()
      .from(purchases)
      .where(eq(purchases.userId, userId))
      .orderBy(desc(purchases.createdAt));
  }

  async getActivePurchases(userId: string): Promise<Purchase[]> {
    return await db.select()
      .from(purchases)
      .where(
        and(
          eq(purchases.userId, userId),
          eq(purchases.isActive, true),
          or(
            // Unlimited plan or has remaining deploys
            eq(purchases.deploysIncluded, -1),
            sql`${purchases.deploysUsed} < ${purchases.deploysIncluded}`
          )
        )
      )
      .orderBy(purchases.createdAt);
  }

  async createDeploy(userId: string, projectName: string): Promise<Deploy> {
    // Find an active purchase to use
    const activePurchases = await this.getActivePurchases(userId);
    
    if (activePurchases.length === 0) {
      throw new Error("No active purchases with remaining deploys");
    }

    // Use the oldest purchase first (FIFO)
    const purchaseToUse = activePurchases[0];

    // Create the deploy
    const [deploy] = await db.insert(deploys).values({
      userId,
      projectName,
      purchaseId: purchaseToUse.id,
      status: "pending",
    }).returning();

    // Increment deploys used (only if not unlimited)
    if (purchaseToUse.deploysIncluded !== -1) {
      await db.update(purchases)
        .set({ deploysUsed: purchaseToUse.deploysUsed + 1 })
        .where(eq(purchases.id, purchaseToUse.id));
    }

    return deploy;
  }

  async updateDeployWithGitHub(
    deployId: number, 
    githubData: { repoUrl: string; owner: string; repo: string; filesCount: number }
  ): Promise<Deploy> {
    const [deploy] = await db.update(deploys)
      .set({ 
        status: "success",
        githubRepoUrl: githubData.repoUrl,
        githubRepoOwner: githubData.owner,
        githubRepoName: githubData.repo,
        filesCount: githubData.filesCount,
        completedAt: new Date(),
      })
      .where(eq(deploys.id, deployId))
      .returning();
    return deploy;
  }

  async failDeploy(deployId: number, error?: string): Promise<Deploy> {
    const [deploy] = await db.update(deploys)
      .set({ 
        status: "failed",
        completedAt: new Date(),
      })
      .where(eq(deploys.id, deployId))
      .returning();
    return deploy;
  }

  async getUserDeploys(userId: string): Promise<Deploy[]> {
    return await db.select()
      .from(deploys)
      .where(eq(deploys.userId, userId))
      .orderBy(desc(deploys.createdAt));
  }

  async getUserStats(userId: string): Promise<{
    totalDeploys: number;
    remainingDeploys: number;
    hasUnlimited: boolean;
    purchases: Purchase[];
  }> {
    const userPurchases = await this.getUserPurchases(userId);
    const userDeploys = await this.getUserDeploys(userId);

    const hasUnlimited = userPurchases.some(p => p.isActive && p.deploysIncluded === -1);

    let remainingDeploys = 0;
    if (hasUnlimited) {
      remainingDeploys = -1; // -1 indicates unlimited
    } else {
      for (const purchase of userPurchases) {
        if (purchase.isActive && purchase.deploysIncluded > 0) {
          remainingDeploys += (purchase.deploysIncluded - purchase.deploysUsed);
        }
      }
    }

    return {
      totalDeploys: userDeploys.length,
      remainingDeploys,
      hasUnlimited,
      purchases: userPurchases,
    };
  }

  async getGithubConnection(userId: string): Promise<GithubConnection | null> {
    const [connection] = await db.select()
      .from(githubConnections)
      .where(eq(githubConnections.userId, userId));
    return connection || null;
  }

  async saveGithubConnection(connection: InsertGithubConnection): Promise<GithubConnection> {
    // Upsert - update if exists, insert if not
    const existing = await this.getGithubConnection(connection.userId);
    
    if (existing) {
      const [updated] = await db.update(githubConnections)
        .set({
          githubUserId: connection.githubUserId,
          githubUsername: connection.githubUsername,
          githubAvatarUrl: connection.githubAvatarUrl,
          accessToken: connection.accessToken,
          updatedAt: new Date(),
        })
        .where(eq(githubConnections.userId, connection.userId))
        .returning();
      return updated;
    }
    
    const [inserted] = await db.insert(githubConnections)
      .values(connection)
      .returning();
    return inserted;
  }

  async deleteGithubConnection(userId: string): Promise<void> {
    await db.delete(githubConnections)
      .where(eq(githubConnections.userId, userId));
  }

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId));
    return user || null;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.getUserById(userId);
  }

  async updateUserStripeCustomer(userId: string, stripeCustomerId: string): Promise<void> {
    await db.update(users)
      .set({ stripeCustomerId })
      .where(eq(users.id, userId));
  }

  async verifyUserCard(userId: string): Promise<void> {
    await db.update(users)
      .set({ cardVerified: true })
      .where(eq(users.id, userId));
  }

  async updateUserSubscription(userId: string, data: {
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    stripeSubscriptionId?: string | null;
    subscriptionStartedAt?: Date | null;
    subscriptionEndsAt?: Date | null;
  }): Promise<void> {
    await db.update(users)
      .set({
        subscriptionPlan: data.subscriptionPlan,
        subscriptionStatus: data.subscriptionStatus,
        stripeSubscriptionId: data.stripeSubscriptionId,
        subscriptionStartedAt: data.subscriptionStartedAt,
        subscriptionEndsAt: data.subscriptionEndsAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateStripeCustomerId(userId: string, customerId: string): Promise<void> {
    await db.update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
