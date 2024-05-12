ALTER TABLE "admins" RENAME COLUMN "id" TO "user_id";--> statement-breakpoint
ALTER TABLE "admins" DROP CONSTRAINT "admins_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
