import "dotenv/config";

import {z} from "zod/v4";

const envSchema = z.object({
  SECRET: z.string(),
  BASE_URL: z.url(),
  DASHBOARD_URL: z.url(),
  RESEND_API_KEY: z.string(),
  BUN_ENVIRONMENT: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(3000),
});

export const envVars = envSchema.parse(process.env);
