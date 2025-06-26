import {eq} from "drizzle-orm";

import {db} from "~/db";
import * as schema from "~/db/schema";
import {generateId} from "~/lib/id";

export const verificationRepo = {
  create: async ({
    email,
    token,
    expiresAt,
  }: {
    email: string;
    token: string;
    expiresAt: Date;
  }) => {
    const id = generateId();

    const values = {
      id,
      value: email,
      identifier: token,
      expiresAt,
    };

    const [verification] = await db
      .insert(schema.verifications)
      .values(values)
      .returning();

    return verification;
  },
  findByToken: async (token: string) => {
    const [verification = null] = await db
      .select()
      .from(schema.verifications)
      .where(eq(schema.verifications.identifier, token))
      .limit(1);

    return verification;
  },
  deleteByToken: async (token: string) => {
    await db
      .delete(schema.verifications)
      .where(eq(schema.verifications.identifier, token));
  },
};
