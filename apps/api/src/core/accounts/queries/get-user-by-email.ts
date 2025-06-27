import type {Database} from "@horionos/db";
import {users} from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface GetUserByEmailProps {
  email: string;
}

export const getUserByEmail = ({db}: {db: Database}) => {
  return async (props: GetUserByEmailProps) => {
    const {email} = props;

    const [user = null] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  };
};
