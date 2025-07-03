DROP INDEX "invitations_email_org_idx";--> statement-breakpoint
DROP INDEX "memberships_user_org_idx";--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
CREATE INDEX "invitations_token_idx" ON "invitations" USING btree ("token");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_account_provider_unique" UNIQUE("account_id","provider_id");--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_email_org_unique" UNIQUE("email","organization_id");--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_org_idx_unique" UNIQUE("user_id","organization_id");