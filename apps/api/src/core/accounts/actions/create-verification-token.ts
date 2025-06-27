import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {VERIFICATION_TOKEN_DURATION_IN_SECONDS} from "~/constants";
import {generateId} from "~/utils/id/generate-id";
import {generateToken} from "~/utils/id/generate-token";

interface CreateVerificationTokenProps {
  email: string;
}

export const createVerificationToken = ({db}: {db: Database}) => {
  return async (props: CreateVerificationTokenProps) => {
    const {email} = props;

    const token = generateToken();
    const id = generateId();

    const expiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_DURATION_IN_SECONDS * 1000,
    ); // 5 minutes

    const values = {
      id,
      value: email,
      identifier: token,
      expiresAt,
    };

    const [verification] = await db
      .insert(schema.verifications)
      .values(values)
      .returning();

    return verification;
  };
};
