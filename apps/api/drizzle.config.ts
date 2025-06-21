import {defineConfig} from "drizzle-kit";

import {envVars} from "~/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: envVars.DATABASE_URL,
  },
});
