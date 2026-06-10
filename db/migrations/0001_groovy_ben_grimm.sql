CREATE TYPE "public"."account_status" AS ENUM('active', 'blocked', 'suspended', 'deleted');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "account_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");