import * as schema from "@horionos/db/schema";

import {addMinutes} from "date-fns";
import {eq} from "drizzle-orm";
import {z} from "zod/v4";

import type {DatabaseConnection} from "~/types/database";

import {generateId} from "../id";
import {generateToken} from "../token";
import {
  type createVerificationInputSchema,
  VERIFICATION_EXPIRATION_IN_MINUTES,
  verificationSchema,
} from "./schema";

export const createVerification = async ({
  db,
  ...attrs
}: {
  db: DatabaseConnection;
} & z.infer<typeof createVerificationInputSchema>) => {
  const now = new Date();
  const values = verificationSchema.parse({
    ...attrs,
    id: generateId(),
    identifier: generateToken(),
    expiresAt: addMinutes(now, VERIFICATION_EXPIRATION_IN_MINUTES),
    createdAt: now,
    updatedAt: now,
  });

  const [verification] = await db
    .insert(schema.verifications)
    .values(values)
    .returning();

  return verification;
};

export const deleteVerificationByIdentifier = async ({
  db,
  identifier,
}: {
  db: DatabaseConnection;
  identifier: string;
}) => {
  const [result = null] = await db
    .delete(schema.verifications)
    .where(eq(schema.verifications.identifier, identifier))
    .returning();

  return result;
};
