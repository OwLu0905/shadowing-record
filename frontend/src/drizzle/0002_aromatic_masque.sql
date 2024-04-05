ALTER TABLE "audios" DROP CONSTRAINT "audios_record_id_records_record_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audios" ADD CONSTRAINT "audios_record_id_records_record_id_fk" FOREIGN KEY ("record_id") REFERENCES "records"("record_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
