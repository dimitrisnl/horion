import "dotenv/config";

import {z} from "zod/v4";

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

export const envVars = envSchema.parse(process.env);
