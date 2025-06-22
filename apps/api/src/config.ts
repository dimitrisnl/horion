import "dotenv/config";

import {z} from "zod/v4";

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  DATABASE_URL: z.string(),
  DASHBOARD_URL: z.url(),
  RESEND_API_KEY: z.string(),
  BUN_ENVIRONMENT: z.enum(["development", "production", "test"]),
});

export const envVars = envSchema.parse(process.env);
