import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface UpdateUserProps {
  userId: string;
  name: string;
}

export const updateUser = ({db}: {db: Database}) => {
  return async (props: UpdateUserProps) => {
    const {userId, name} = props;

    const [updatedUser] = await db
      .update(schema.users)
      .set({name})
      .where(eq(schema.users.id, userId))
      .returning();

    return updatedUser || null;
  };
};
