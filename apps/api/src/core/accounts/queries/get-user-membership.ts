import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {and, eq} from "drizzle-orm";

interface GetUserMembershipProps {
  organizationId: string;
  userId: string;
}

export const getUserMembership = ({db}: {db: Database}) => {
  return async (props: GetUserMembershipProps) => {
    const {organizationId, userId} = props;

    const [membership = null] = await db
      .select()
      .from(schema.memberships)
      .where(
        and(
          eq(schema.memberships.organizationId, organizationId),
          eq(schema.memberships.userId, userId),
        ),
      )
      .limit(1);

    return membership;
  };
};
