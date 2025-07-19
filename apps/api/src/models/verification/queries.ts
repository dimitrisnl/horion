import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

import type {DatabaseConnection} from "~/types/database";

export const findVerificationByIdentifier = async ({
  db,
  identifier,
}: {
  db: DatabaseConnection;
  identifier: string;
}) => {
  const [verification = null] = await db
    .select()
    .from(schema.verifications)
    .where(eq(schema.verifications.identifier, identifier))
    .limit(1);

  return verification;
};
