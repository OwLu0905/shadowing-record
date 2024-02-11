CREATE TABLE "accounts" (
  "user_id" bigserial PRIMARY KEY,
  "username" varchar NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "last_login" timestamptz
);

CREATE TABLE "lessons" (
  "lesson_id" bigserial PRIMARY KEY,
  "creator_user_id" bigint NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" text,
  "video_url" varchar(255) NOT NULL,
  "start_seconds" integer NOT NULL,
  "end_seconds" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "records" (
  "record_id" bigserial PRIMARY KEY,
  "user_id" bigint NOT NULL,
  "lesson_id" bigint NOT NULL,
  "audio_url" varchar(255) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "accounts" ("email");

CREATE INDEX ON "lessons" ("lesson_id");

COMMENT ON COLUMN "lessons"."end_seconds" IS 'must greater than start time';

ALTER TABLE "lessons" ADD FOREIGN KEY ("creator_user_id") REFERENCES "accounts" ("user_id");

ALTER TABLE "records" ADD FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id");

ALTER TABLE "records" ADD FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("lesson_id");
