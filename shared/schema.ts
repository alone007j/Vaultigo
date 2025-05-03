import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, varchar, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// AI Provider Enum
export const aiProviderEnum = pgEnum("ai_provider", ["openai", "gemini", "xai"]);

// Auth Provider Enum
export const authProviderEnum = pgEnum("auth_provider", ["email", "google"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  authProvider: authProviderEnum("auth_provider").default("email").notNull(),
  googleId: text("google_id").unique(),
  avatarUrl: text("avatar_url"),
  plan: text("plan").default("free").notNull(),
  storage: integer("storage").default(10).notNull(), // Storage in GB
  storageUsed: integer("storage_used").default(0).notNull(), // Used storage in GB
  isAdmin: boolean("is_admin").default(false).notNull(),
  aiProvider: aiProviderEnum("ai_provider").default("xai").notNull(), // AI model preference
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: uniqueIndex("email_idx").on(table.email),
  };
});

// Folders table
export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  parentId: integer("parent_id"),
  isStarred: boolean("is_starred").default(false).notNull(),
  isShared: boolean("is_shared").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(), // Size in bytes
  path: text("path").notNull(),
  folderId: integer("folder_id").references(() => folders.id, { onDelete: "set null" }),
  isStarred: boolean("is_starred").default(false).notNull(),
  isShared: boolean("is_shared").default(false).notNull(),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Shared items table
export const sharedItems = pgTable("shared_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fileId: integer("file_id").references(() => files.id, { onDelete: "cascade" }),
  folderId: integer("folder_id").references(() => folders.id, { onDelete: "cascade" }),
  sharedWith: text("shared_with"),
  sharedWithUserId: integer("shared_with_user_id").references(() => users.id, { onDelete: "cascade" }),
  accessLevel: text("access_level").default("view").notNull(), // view, edit, etc.
  shareLink: text("share_link"),
  expiresAt: timestamp("expires_at"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const externalAccounts = pgTable("external_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // "dropbox" or "terabox"
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  name: text("name").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Session storage for managing user sessions
export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { withTimezone: true }).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  files: many(files),
  folders: many(folders),
  externalAccounts: many(externalAccounts),
  sharedWithMe: many(sharedItems, { relationName: "sharedWithUser" }),
  mySharedItems: many(sharedItems, { relationName: "owner" }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, {
    fields: [folders.userId],
    references: [users.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
  files: many(files),
}));

export const sharedItemsRelations = relations(sharedItems, ({ one }) => ({
  owner: one(users, {
    fields: [sharedItems.userId],
    references: [users.id],
    relationName: "owner",
  }),
  sharedWithUser: one(users, {
    fields: [sharedItems.sharedWithUserId],
    references: [users.id],
    relationName: "sharedWithUser",
  }),
  file: one(files, {
    fields: [sharedItems.fileId],
    references: [files.id],
  }),
  folder: one(folders, {
    fields: [sharedItems.folderId],
    references: [folders.id],
  }),
}));

export const externalAccountsRelations = relations(externalAccounts, ({ one }) => ({
  user: one(users, {
    fields: [externalAccounts.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
  storageUsed: true,
});

export const insertFolderSchema = createInsertSchema(folders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  metadata: true,
});

export const insertSharedItemSchema = createInsertSchema(sharedItems).omit({
  id: true,
  createdAt: true,
});

export const insertExternalAccountSchema = createInsertSchema(externalAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const googleLoginSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  username: z.string(),
  avatarUrl: z.string().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type SharedItem = typeof sharedItems.$inferSelect;
export type InsertSharedItem = z.infer<typeof insertSharedItemSchema>;
export type ExternalAccount = typeof externalAccounts.$inferSelect;
export type InsertExternalAccount = z.infer<typeof insertExternalAccountSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type GoogleLoginCredentials = z.infer<typeof googleLoginSchema>;
