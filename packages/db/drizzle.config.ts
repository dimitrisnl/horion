import {defineConfig} from "drizzle-kit";

import {envVars} from "~/config";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: envVars.DATABASE_URL,
  },
});
