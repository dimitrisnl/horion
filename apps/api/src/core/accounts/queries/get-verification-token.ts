import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const getVerificationToken = async ({token}: {token: string}) => {
  const [verification = null] = await db
    .select()
    .from(schema.verifications)
    .where(eq(schema.verifications.identifier, token))
    .limit(1);

  return verification;
};
