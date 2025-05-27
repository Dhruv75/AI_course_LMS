import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
 subscriptionId: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
});
