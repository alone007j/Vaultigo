import { 
  users, files, externalAccounts, folders, sharedItems, 
  User, InsertUser, File, InsertFile, ExternalAccount, InsertExternalAccount,
  Folder, InsertFolder, SharedItem, InsertSharedItem
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from './db';
import { eq, and, desc, sql } from 'drizzle-orm';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  
  // File management
  getFiles(userId: number): Promise<File[]>;
  getFilesByType(userId: number, type: string): Promise<File[]>;
  getRecentFiles(userId: number, limit: number): Promise<File[]>;
  getFile(id: number): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, file: Partial<File>): Promise<File>;
  deleteFile(id: number): Promise<boolean>;
  
  // Folder management
  getFolders(userId: number): Promise<Folder[]>;
  getFolder(id: number): Promise<Folder | undefined>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  updateFolder(id: number, folder: Partial<Folder>): Promise<Folder>;
  deleteFolder(id: number): Promise<boolean>;
  
  // Sharing management
  getSharedItems(userId: number): Promise<SharedItem[]>;
  getSharedWithMe(userId: number): Promise<SharedItem[]>;
  createSharedItem(item: InsertSharedItem): Promise<SharedItem>;
  deleteSharedItem(id: number): Promise<boolean>;
  
  // External account management
  getExternalAccounts(userId: number): Promise<ExternalAccount[]>;
  getExternalAccount(id: number): Promise<ExternalAccount | undefined>;
  createExternalAccount(account: InsertExternalAccount): Promise<ExternalAccount>;
  deleteExternalAccount(id: number): Promise<boolean>;
  
  // Stripe management
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, info: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User>;

  // Session store
  sessionStore: any; // Using any for session store compatibility
}

// PostgreSQL session store
const PostgresStore = connectPgSimple(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any for session store compatibility

  constructor() {
    // Initialize session store with PostgreSQL
    this.sessionStore = new PostgresStore({
      pool,
      tableName: 'sessions',
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // If email provided, convert to lowercase for consistency
    const userDataWithLowercaseEmail = userData.email 
      ? { ...userData, email: userData.email.toLowerCase() }
      : userData;

    const [user] = await db.insert(users).values(userDataWithLowercaseEmail).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  // File methods
  async getFiles(userId: number): Promise<File[]> {
    return await db.select().from(files).where(eq(files.userId, userId));
  }

  async getFilesByType(userId: number, type: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.type, type)));
  }

  async getRecentFiles(userId: number, limit: number): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.userId, userId))
      .orderBy(desc(files.createdAt))
      .limit(limit);
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async createFile(fileData: InsertFile): Promise<File> {
    const [file] = await db.insert(files).values(fileData).returning();
    
    // Update user's storage usage
    const fileSizeInGB = file.size / (1024 * 1024 * 1024);
    await this.updateUserStorageUsed(file.userId, fileSizeInGB);
    
    return file;
  }

  async updateFile(id: number, fileData: Partial<File>): Promise<File> {
    const [updatedFile] = await db
      .update(files)
      .set({ ...fileData, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();
    
    if (!updatedFile) {
      throw new Error(`File with ID ${id} not found`);
    }
    
    return updatedFile;
  }

  async deleteFile(id: number): Promise<boolean> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    
    if (!file) {
      return false;
    }
    
    // Calculate storage to free up
    const fileSizeInGB = file.size / (1024 * 1024 * 1024);
    
    // Delete the file
    await db.delete(files).where(eq(files.id, id));
    
    // Update user's storage usage
    await this.updateUserStorageUsed(file.userId, -fileSizeInGB);
    
    return true;
  }

  // Helper to update user's storage usage
  private async updateUserStorageUsed(userId: number, deltaGB: number): Promise<void> {
    // Use SQL to make sure we don't go below zero
    await db
      .update(users)
      .set({ 
        storageUsed: sql`GREATEST(0, ${users.storageUsed} + ${deltaGB})`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Folder methods
  async getFolders(userId: number): Promise<Folder[]> {
    return await db.select().from(folders).where(eq(folders.userId, userId));
  }

  async getFolder(id: number): Promise<Folder | undefined> {
    const [folder] = await db.select().from(folders).where(eq(folders.id, id));
    return folder;
  }

  async createFolder(folderData: InsertFolder): Promise<Folder> {
    const [folder] = await db.insert(folders).values(folderData).returning();
    return folder;
  }

  async updateFolder(id: number, folderData: Partial<Folder>): Promise<Folder> {
    const [updatedFolder] = await db
      .update(folders)
      .set({ ...folderData, updatedAt: new Date() })
      .where(eq(folders.id, id))
      .returning();
    
    if (!updatedFolder) {
      throw new Error(`Folder with ID ${id} not found`);
    }
    
    return updatedFolder;
  }

  async deleteFolder(id: number): Promise<boolean> {
    // First get any files in this folder to update storage usage
    const folderFiles = await db.select().from(files).where(eq(files.folderId, id));
    
    // Delete the folder
    await db.delete(folders).where(eq(folders.id, id));
    
    // Update user's storage usage if files were automatically deleted by the cascade
    if (folderFiles.length > 0) {
      const userId = folderFiles[0].userId;
      const totalSizeGB = folderFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024 * 1024);
      await this.updateUserStorageUsed(userId, -totalSizeGB);
    }
    
    return true;
  }

  // Shared items methods
  async getSharedItems(userId: number): Promise<SharedItem[]> {
    return await db.select().from(sharedItems).where(eq(sharedItems.userId, userId));
  }

  async getSharedWithMe(userId: number): Promise<SharedItem[]> {
    return await db.select().from(sharedItems).where(eq(sharedItems.sharedWithUserId, userId));
  }

  async createSharedItem(sharedItemData: InsertSharedItem): Promise<SharedItem> {
    const [sharedItem] = await db.insert(sharedItems).values(sharedItemData).returning();
    return sharedItem;
  }

  async deleteSharedItem(id: number): Promise<boolean> {
    await db.delete(sharedItems).where(eq(sharedItems.id, id));
    return true;
  }

  // External account methods
  async getExternalAccounts(userId: number): Promise<ExternalAccount[]> {
    return await db.select().from(externalAccounts).where(eq(externalAccounts.userId, userId));
  }

  async getExternalAccount(id: number): Promise<ExternalAccount | undefined> {
    const [account] = await db.select().from(externalAccounts).where(eq(externalAccounts.id, id));
    return account;
  }

  async createExternalAccount(accountData: InsertExternalAccount): Promise<ExternalAccount> {
    const [account] = await db.insert(externalAccounts).values(accountData).returning();
    return account;
  }

  async deleteExternalAccount(id: number): Promise<boolean> {
    await db.delete(externalAccounts).where(eq(externalAccounts.id, id));
    return true;
  }

  // Stripe-related methods
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  async updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set(stripeInfo)
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }
}

// For backward compatibility and demo purposes, let's keep MemStorage available
export class MemStorage implements IStorage {
  // Storage maps
  private users: Map<number, User>;
  private files: Map<number, File>;
  private externalAccounts: Map<number, ExternalAccount>;
  
  // Auto-incrementing IDs
  private userId: number;
  private fileId: number;
  private externalAccountId: number;
  
  sessionStore: any; // Using any for session store compatibility

  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.externalAccounts = new Map();
    
    this.userId = 1;
    this.fileId = 1;
    this.externalAccountId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with a demo user
    this.createUser({
      username: "demo",
      email: "demo@vaultigo.com",
      password: "$2b$10$dGOmFik1rQasjmHFMpvnb.GR6eLEVVXQxA2CEqAuVYOhMUYv5/Sle" // "password"
    } as InsertUser);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    
    const user: User = {
      ...userData,
      id,
      plan: "free",
      storage: 10,
      storageUsed: 0,
      isAdmin: false,
      aiProvider: "xai",
      authProvider: "email",
      createdAt: now,
      updatedAt: now,
    } as User;
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { 
      ...user, 
      ...userData,
      updatedAt: new Date() 
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // File methods
  async getFiles(userId: number): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.userId === userId
    );
  }

  async getFilesByType(userId: number, type: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.userId === userId && file.type === type
    );
  }

  async getRecentFiles(userId: number, limit: number): Promise<File[]> {
    return Array.from(this.files.values())
      .filter((file) => file.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async createFile(fileData: InsertFile): Promise<File> {
    const id = this.fileId++;
    const now = new Date();
    
    const file: File = { 
      ...fileData,
      id,
      isStarred: false,
      isShared: false,
      createdAt: now,
      updatedAt: now,
    } as File;
    
    this.files.set(id, file);
    
    // Update user's storage usage
    const user = await this.getUser(file.userId);
    if (user) {
      const fileSizeInGB = file.size / (1024 * 1024 * 1024);
      await this.updateUser(user.id, { 
        storageUsed: user.storageUsed + fileSizeInGB
      });
    }
    
    return file;
  }

  async updateFile(id: number, fileData: Partial<File>): Promise<File> {
    const file = await this.getFile(id);
    if (!file) {
      throw new Error(`File with ID ${id} not found`);
    }
    
    const updatedFile = { 
      ...file, 
      ...fileData,
      updatedAt: new Date()
    };
    
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async deleteFile(id: number): Promise<boolean> {
    const file = await this.getFile(id);
    if (!file) {
      return false;
    }
    
    // Update user's storage usage
    const user = await this.getUser(file.userId);
    if (user) {
      const fileSizeInGB = file.size / (1024 * 1024 * 1024);
      await this.updateUser(user.id, { 
        storageUsed: Math.max(0, user.storageUsed - fileSizeInGB)
      });
    }
    
    return this.files.delete(id);
  }

  // External account methods
  async getExternalAccounts(userId: number): Promise<ExternalAccount[]> {
    return Array.from(this.externalAccounts.values()).filter(
      (account) => account.userId === userId
    );
  }

  async getExternalAccount(id: number): Promise<ExternalAccount | undefined> {
    return this.externalAccounts.get(id);
  }

  async createExternalAccount(accountData: InsertExternalAccount): Promise<ExternalAccount> {
    const id = this.externalAccountId++;
    const now = new Date();
    
    const account: ExternalAccount = { 
      ...accountData, 
      id,
      createdAt: now,
      updatedAt: now
    } as ExternalAccount;
    
    this.externalAccounts.set(id, account);
    return account;
  }

  async deleteExternalAccount(id: number): Promise<boolean> {
    return this.externalAccounts.delete(id);
  }

  // Required by interface but not needed in memory implementation
  async getFolders(): Promise<any[]> { return []; }
  async getFolder(): Promise<any> { return null; }
  async createFolder(): Promise<any> { return {}; }
  async updateFolder(): Promise<any> { return {}; }
  async deleteFolder(): Promise<boolean> { return true; }
  async getSharedItems(): Promise<any[]> { return []; }
  async getSharedWithMe(): Promise<any[]> { return []; }
  async createSharedItem(): Promise<any> { return {}; }
  async deleteSharedItem(): Promise<boolean> { return true; }
  async getUserByGoogleId(): Promise<User | undefined> { return undefined; }
  async updateStripeCustomerId(): Promise<User> { return {} as User; }
  async updateUserStripeInfo(): Promise<User> { return {} as User; }
}

// Use the database storage
export const storage = new DatabaseStorage();
