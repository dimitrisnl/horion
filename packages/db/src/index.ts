import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";

import {envVars} from "./config";

const pool = new Pool({
  connectionString: envVars.DATABASE_URL,
  // Connection pool configuration
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

export const db = drizzle(pool);

export type Database = typeof db;
