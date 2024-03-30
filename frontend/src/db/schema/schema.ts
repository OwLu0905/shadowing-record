import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  bigserial,
  serial,
  uuid,
} from "drizzle-orm/pg-core";

import type { AdapterAccount } from "@auth/core/adapters";

import { sql } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey().unique(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: roleEnum("role").notNull().default("USER"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const records = pgTable("records", {
  recordId: uuid("record_id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  shadowingUrl: text("shadowing_url").notNull(),
  shadowingType: integer("shadowing_type")
    .notNull()
    .references(() => kinds.kindId),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const audios = pgTable("audios", {
  audioId: bigserial("audio_id", { mode: "number" }).notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
  recordId: uuid("record_id")
    .notNull()
    .references(() => records.recordId),
  audioUrl: text("audio_url").notNull(),
  startSeconds: integer("start_seconds").notNull(),
  endSeconds: integer("end_seconds").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const kinds = pgTable("kinds", {
  kindId: serial("kind_id").notNull().primaryKey(),
  name: text("name").notNull(),
});
