import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface GetSessionProps {
  token: string;
}

export const getSession = ({db}: {db: Database}) => {
  return async (props: GetSessionProps) => {
    const {token} = props;

    const [session = null] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.token, token))
      .limit(1);

    return session;
  };
};
