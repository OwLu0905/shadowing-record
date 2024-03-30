import {
  bigserial,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const records = pgTable("records", {
  recordId: bigserial("record_id", { mode: "number" }).notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  shadowingUrl: text("shadowing_url").notNull(),
  shadowingType: text("shadowing_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const audios = pgTable("audios", {
  audioId: bigserial("audio_id", { mode: "number" }).notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
  recordId: bigserial("record_id", { mode: "number" })
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
