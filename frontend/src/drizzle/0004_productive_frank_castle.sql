ALTER TABLE "lessons" RENAME COLUMN "creator_user_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_creator_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "records" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
