import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {magicLink} from "better-auth/plugins";

import {envVars} from "~/config";

import {db} from "../db";
import * as schema from "../db/schema";
import {sendMagicLinkEmail} from "./email-client";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
    usePlural: true,
  }),
  rateLimit: {
    window: 60, // seconds
    max: 100, // requests
    message: "Too many requests, please try again later.",
  },
  user: {
    changeEmail: {enabled: false},
    deleteUser: {enabled: false},
  },
  trustedOrigins: [envVars.CORS_ORIGIN],
  emailAndPassword: {enabled: false},
  secret: envVars.BETTER_AUTH_SECRET,
  baseURL: envVars.BETTER_AUTH_URL,
  plugins: [
    // TODO: Don't block the API
    magicLink({
      sendMagicLink: async ({email, url}) => {
        await sendMagicLinkEmail({to: email, url});
      },
    }),
  ],
  disabledPaths: [
    "/account-info",
    "/change-email",
    "/change-password",
    "/delete-user",
    "/delete-user/callback",
    "/error",
    "/forget-password",
    "/get-access-token",
    "/link-social",
    "/list-accounts",
    "/list-sessions",
    "/ok",
    "/request-password-reset",
    "/reset-password",
    "/reset-password/:token",
    "/revoke-other-sessions",
    "/revoke-session",
    "/revoke-sessions",
    "/send-verification-email",
    "/sign-in/email",
    "/sign-in/social",
    "/sign-up/email",
    "/unlink-account",
    "/update-user",
    "/verify-email",
    "/get-session",
    "/sign-out",
    "/sign-in/magic-link",
    "/refresh-token",
  ],
});
