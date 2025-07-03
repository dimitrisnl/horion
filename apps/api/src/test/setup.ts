import * as schema from "@horionos/db/schema";

import {PGlite} from "@electric-sql/pglite";
import {pushSchema} from "drizzle-kit/api";
import {drizzle} from "drizzle-orm/pglite";

import type {DatabaseConnection} from "~/types/database";

let globalDb: DatabaseConnection | null = null;
let globalClient: PGlite | null = null;

export async function createTestDatabase() {
  if (globalDb && globalClient) {
    return {client: globalClient, db: globalDb};
  }

  const client = new PGlite();
  const db = drizzle(client, {schema});

  const {apply} = await pushSchema(schema, db as unknown as DatabaseConnection);
  await apply();

  globalClient = client;
  globalDb = db as unknown as DatabaseConnection;

  return {client, db: globalDb};
}

export async function cleanupTestDatabase(client: PGlite) {
  if (client) {
    await client.query("BEGIN");
    try {
      // Disable foreign key checks
      await client.query("SET session_replication_role = replica");

      // Fast truncate all tables
      await client.query(`
        TRUNCATE TABLE
          session_metadata,
          sessions,
          accounts,
          invitations,
          memberships,
          verifications,
          organizations,
          users
        RESTART IDENTITY CASCADE
      `);

      // Re-enable foreign key checks
      await client.query("SET session_replication_role = DEFAULT");

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
}
