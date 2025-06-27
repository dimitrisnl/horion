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

    const [org = null] = await db
      .update(schema.organizations)
      .set({name})
      .where(eq(schema.organizations.id, organizationId))
      .returning();

    return org;
  };
};
