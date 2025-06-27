import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface GetUserByIdProps {
  userId: string;
}

export const getUserById = ({db}: {db: Database}) => {
  return async (props: GetUserByIdProps) => {
    const {userId} = props;

    const [user = null] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    return user;
  };
};
