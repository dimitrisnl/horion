CREATE TABLE "session_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"browser" text NOT NULL,
	"os" text NOT NULL,
	"device" text NOT NULL,
	"engine" text NOT NULL,
	"model" text NOT NULL,
	"user_agent" text NOT NULL,
	"ip_address" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_metadata" ADD CONSTRAINT "session_metadata_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_metadata_session_id_idx" ON "session_metadata" USING btree ("session_id");--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "ip_address";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "user_agent";