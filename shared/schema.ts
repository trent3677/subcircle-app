import { pgTable, varchar, text, boolean, decimal, timestamp, jsonb, uuid, serial, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const streamingServices = pgTable('streaming_services', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
  logoUrl: text('logo_url'),
  category: text('category'),
  monthlyPrice: decimal('monthly_price', { precision: 8, scale: 2 }),
  websiteUrl: text('website_url'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`)
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`)
});

export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull(),
  serviceId: uuid('service_id').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  sharedWithPartners: boolean('shared_with_partners').notNull().default(false),
  shareCredentials: boolean('share_credentials').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`)
});

export const partnerConnections = pgTable('partner_connections', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull(),
  partnerId: text('partner_id').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`)
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: jsonb('data'),
  read: boolean('read').notNull().default(false),
  priority: text('priority').default('low'),
  category: text('category').default('partner'),
  actionUrl: text('action_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`)
});

export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull().unique(),
  emailEnabled: boolean('email_enabled').notNull().default(true),
  pushEnabled: boolean('push_enabled').notNull().default(true),
  partnerNotifications: boolean('partner_notifications').notNull().default(true),
  subscriptionNotifications: boolean('subscription_notifications').notNull().default(true),
  securityNotifications: boolean('security_notifications').notNull().default(true),
  systemNotifications: boolean('system_notifications').notNull().default(false),
  emailFrequency: text('email_frequency').default('instant'),
  quietHoursEnabled: boolean('quiet_hours_enabled').notNull().default(false),
  quietHoursStart: text('quiet_hours_start').default('22:00'),
  quietHoursEnd: text('quiet_hours_end').default('08:00'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`)
});

export const subscriptionCredentials = pgTable('subscription_credentials', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: uuid('subscription_id').notNull().unique(),
  userId: text('user_id').notNull(),
  encryptedUsername: text('encrypted_username'),
  encryptedPassword: text('encrypted_password'),
  encryptedNotes: text('encrypted_notes'),
  encryptionKeyHint: text('encryption_key_hint'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`)
});

export const webPushSubscriptions = pgTable('web_push_subscriptions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull(),
  endpoint: text('endpoint').notNull(),
  p256dhKey: text('p256dh_key').notNull(),
  authKey: text('auth_key').notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`)
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;