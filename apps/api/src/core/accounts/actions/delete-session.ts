import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface DeleteSessionProps {
  token: string;
}

export const deleteSession = ({db}: {db: Database}) => {
  return async (props: DeleteSessionProps) => {
    const {token} = props;

    await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
  };
};
