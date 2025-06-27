import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {PGlite} from "@electric-sql/pglite";
import {pushSchema} from "drizzle-kit/api";
import {drizzle} from "drizzle-orm/pglite";

export async function createTestDatabase() {
  const client = new PGlite();
  const db = drizzle(client, {schema});

  const {apply} = await pushSchema(schema, db as unknown as Database);
  await apply();

  return {client, db: db as unknown as Database};
}

export async function cleanupTestDatabase(client: PGlite) {
  if (client) {
    await client.query("DELETE FROM session_metadata");
    await client.query("DELETE FROM sessions");
    await client.query("DELETE FROM accounts");
    await client.query("DELETE FROM invitations");
    await client.query("DELETE FROM memberships");
    await client.query("DELETE FROM verifications");
    await client.query("DELETE FROM organizations");
    await client.query("DELETE FROM users");
  }
}
