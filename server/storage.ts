// Blueprint: javascript_auth_all_persistance - Storage interface for authentication and data persistence
import { users, tabataSets, type User, type InsertUser, type TabataSet, type InsertTabataSet } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Tabata sets management
  getUserTabataSets(userId: number): Promise<TabataSet[]>;
  createTabataSet(insertSet: InsertTabataSet): Promise<TabataSet>;
  updateTabataSet(id: number, userId: number, updates: Partial<Pick<TabataSet, 'name' | 'description' | 'sequences'>>): Promise<TabataSet | undefined>;
  deleteTabataSet(id: number, userId: number): Promise<boolean>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserTabataSets(userId: number): Promise<TabataSet[]> {
    return await db
      .select()
      .from(tabataSets)
      .where(eq(tabataSets.userId, userId));
  }

  async createTabataSet(insertSet: InsertTabataSet): Promise<TabataSet> {
    const [tabataSet] = await db
      .insert(tabataSets)
      .values({
        ...insertSet,
        updatedAt: new Date(),
      })
      .returning();
    return tabataSet;
  }

  async updateTabataSet(id: number, userId: number, updates: Partial<Pick<TabataSet, 'name' | 'description' | 'sequences'>>): Promise<TabataSet | undefined> {
    const [tabataSet] = await db
      .update(tabataSets)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(tabataSets.id, id), eq(tabataSets.userId, userId)))
      .returning();
    return tabataSet || undefined;
  }

  async deleteTabataSet(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(tabataSets)
      .where(and(eq(tabataSets.id, id), eq(tabataSets.userId, userId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();