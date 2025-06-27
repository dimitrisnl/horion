import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

export const deleteVerificationToken = async ({token}: {token: string}) => {
  await db
    .delete(schema.verifications)
    .where(eq(schema.verifications.identifier, token));
};
