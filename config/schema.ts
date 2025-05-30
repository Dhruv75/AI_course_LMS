import { integer, json, pgTable, varchar, boolean, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  subscriptionId: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  noOfChapters: integer(),
  includeVideo: boolean().default(false),
  level: varchar({ length: 50 }),
  category: varchar({ length: 255 }),
  userEmail: varchar('user_email', { length: 255 }).notNull().references(() => usersTable.email),
  courseJson: json(),
});