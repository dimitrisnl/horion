import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {generateId} from "~/utils/id/generate-id";

interface CreateUserProps {
  email: string;
}

export const createUser = ({db}: {db: Database}) => {
  return async (props: CreateUserProps) => {
    const {email} = props;

    const userId = generateId();

    const [newUser = null] = await db
      .insert(schema.users)
      .values({
        id: userId,
        name: "",
        email: email.toLowerCase(),
        emailVerified: true,
      })
      .returning();

    return newUser;
  };
};
