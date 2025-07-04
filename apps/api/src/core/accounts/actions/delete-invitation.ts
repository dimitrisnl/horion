import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {ORPCError} from "@orpc/client";
import {and, eq} from "drizzle-orm";

import {getUserMembership} from "../queries/get-user-membership";

interface DeleteInvitationProps {
  invitationId: string;
  organizationId: string;
  userId: string;
}

export const deleteInvitation = ({db}: {db: Database}) => {
  return async (props: DeleteInvitationProps) => {
    const {invitationId, organizationId, userId} = props;

    const membership = await getUserMembership({db})({
      organizationId,
      userId,
    });

    if (!membership) {
      throw new ORPCError("Invitation not found");
    }

    // TODO: Authorize this query in a more robust way
    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new ORPCError("Only admins and owners can delete invitations.");
    }

    await db
      .delete(schema.invitations)
      .where(
        and(
          eq(schema.invitations.id, invitationId),
          eq(schema.invitations.organizationId, organizationId),
        ),
      );
  };
};
