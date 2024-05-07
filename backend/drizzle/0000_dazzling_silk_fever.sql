CREATE TABLE IF NOT EXISTS "problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" varchar(512) NOT NULL,
	"prompt" text NOT NULL,
	"language_id" integer NOT NULL,
	"tests" json NOT NULL,
	"base_code" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"first_name" varchar(32) NOT NULL,
	"last_name" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer,
	"expiresAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"problemId" integer NOT NULL,
	"userId" integer NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(128) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admins" (
	"id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tests" (
	"token" varchar(40) PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"input" json NOT NULL,
	"expected" json NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "profiles" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_id_idx" ON "sessions" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submission_user_id_idx" ON "submissions" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problems" ADD CONSTRAINT "problems_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problemId_problems_id_fk" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admins" ADD CONSTRAINT "admins_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tests" ADD CONSTRAINT "tests_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
