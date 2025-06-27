import {drizzle} from "drizzle-orm/node-postgres";

import {envVars} from "./config";

export const db = drizzle(envVars.DATABASE_URL);
