import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface GetVerificationTokenProps {
  token: string;
}

export const getVerificationToken = ({db}: {db: Database}) => {
  return async (props: GetVerificationTokenProps) => {
    const {token} = props;

    const [verification = null] = await db
      .select()
      .from(schema.verifications)
      .where(eq(schema.verifications.identifier, token))
      .limit(1);

    return verification;
  };
};
