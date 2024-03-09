ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");