import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {ORPCError} from "@orpc/client";
import {eq} from "drizzle-orm";

import {getUserMembership} from "~/core/accounts/queries/get-user-membership";

interface UpdateOrganizationProps {
  organizationId: string;
  userId: string;
  name: string;
}

export const updateOrganization = ({db}: {db: Database}) => {
  return async (props: UpdateOrganizationProps) => {
    const {organizationId, userId, name} = props;

    const membership = await getUserMembership({db})({organizationId, userId});

    if (!membership) {
      throw new ORPCError("Organization not found");
    }

    // TODO: Authorize this query in a more robust way
    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new ORPCError("Only admins and owners can update organizations.");
    }

    const [org = null] = await db
      .update(schema.organizations)
      .set({name})
      .where(eq(schema.organizations.id, organizationId))
      .returning();

    return org;
  };
};
