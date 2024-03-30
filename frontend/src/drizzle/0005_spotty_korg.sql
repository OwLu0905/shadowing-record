CREATE TABLE IF NOT EXISTS "kinds" (
	"kind_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lessons" RENAME TO "audios";--> statement-breakpoint
ALTER TABLE "records" RENAME COLUMN "audio_url" TO "shadowing_url";--> statement-breakpoint
ALTER TABLE "audios" RENAME COLUMN "lesson_id" TO "audio_id";--> statement-breakpoint
ALTER TABLE "records" DROP CONSTRAINT "records_lesson_id_lessons_lesson_id_fk";
--> statement-breakpoint
ALTER TABLE "audios" DROP CONSTRAINT "lessons_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "records" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "records" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "records" ADD COLUMN "shadowing_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "audios" ADD COLUMN "record_id" bigserial NOT NULL;--> statement-breakpoint
ALTER TABLE "audios" ADD COLUMN "audio_url" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audios" ADD CONSTRAINT "audios_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audios" ADD CONSTRAINT "audios_record_id_records_record_id_fk" FOREIGN KEY ("record_id") REFERENCES "records"("record_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "records" DROP COLUMN IF EXISTS "lesson_id";--> statement-breakpoint
ALTER TABLE "audios" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "audios" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "audios" DROP COLUMN IF EXISTS "video_url";