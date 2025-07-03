import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {eq} from "drizzle-orm";

interface GetInvitationsProps {
  organizationId: string;
  userId: string;
}

export const getInvitations = ({db}: {db: Database}) => {
  // TODO: Authorize this query

  return async ({organizationId}: GetInvitationsProps) => {
    // Join with users to get user details if needed
    const invitations = await db
      .select({
        id: schema.invitations.id,
        email: schema.invitations.email,
        role: schema.invitations.role,
        status: schema.invitations.status,
        inviterEmail: schema.users.email,
        inviterName: schema.users.name,
        createdAt: schema.invitations.createdAt,
        expiresAt: schema.invitations.expiresAt,
      })
      .from(schema.invitations)
      .innerJoin(
        schema.users,
        eq(schema.invitations.inviterId, schema.users.id),
      )
      .where(eq(schema.invitations.organizationId, organizationId));

    return invitations;
  };
};
