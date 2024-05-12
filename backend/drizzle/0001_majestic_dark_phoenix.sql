ALTER TABLE "submissions" RENAME COLUMN "problemId" TO "problem_id";--> statement-breakpoint
ALTER TABLE "submissions" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_problemId_problems_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_userId_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "submission_user_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submission_user_id_idx" ON "submissions" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
