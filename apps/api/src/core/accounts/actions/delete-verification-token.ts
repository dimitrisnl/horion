import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface DeleteVerificationTokenProps {
  token: string;
}

export const deleteVerificationToken = ({db}: {db: Database}) => {
  return async (props: DeleteVerificationTokenProps) => {
    const {token} = props;

    await db
      .delete(schema.verifications)
      .where(eq(schema.verifications.identifier, token));
  };
};
