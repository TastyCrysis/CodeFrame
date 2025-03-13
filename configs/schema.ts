import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(0),
});

export const wireframeToCodeTable = pgTable("wireframeToCode", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uid: varchar().notNull(),
  imageUrl: varchar().notNull(),
  model: varchar().notNull(),
  description: varchar().notNull(),
  code: json(),
  createdBy: varchar().notNull(),
});
