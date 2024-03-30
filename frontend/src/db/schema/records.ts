import {
  bigserial,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { sql } from "drizzle-orm";

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
