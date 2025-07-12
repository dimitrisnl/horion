import * as schema from "@horionos/db/schema";

import type {z} from "zod/v4";

import type {DatabaseConnection} from "~/types/database";

import {generateId} from "../id";
import {
  createSessionMetadataInputSchema,
  sessionMetadataSchema,
} from "./schema";

export const createSessionMetadata = async ({
  db,
  ...attrs
}: {
  db: DatabaseConnection;
} & z.infer<typeof createSessionMetadataInputSchema>) => {
  const now = new Date();

  const values = sessionMetadataSchema.parse({
    ...attrs,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  });

  const [newSession] = await db
    .insert(schema.sessionMetadata)
    .values(values)
    .returning();

  return newSession;
};
