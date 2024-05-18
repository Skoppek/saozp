ALTER TABLE "users" RENAME COLUMN "email" TO "login";--> statement-breakpoint
DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_idx" ON "users" ("login");