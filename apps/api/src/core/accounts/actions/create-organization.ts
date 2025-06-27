import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {generateId} from "~/utils/id/generate-id";

interface CreateOrganizationProps {
  name: string;
  userId: string;
}

export const createOrganization = ({db}: {db: Database}) => {
  return async (props: CreateOrganizationProps) => {
    const {name, userId} = props;

    const orgId = generateId();
    const memberId = generateId();

    const [org = null] = await db.transaction(async (tx) => {
      const [newOrg] = await tx
        .insert(schema.organizations)
        .values({id: orgId, name})
        .returning();

      await tx.insert(schema.memberships).values({
        id: memberId,
        userId: userId,
        organizationId: orgId,
        role: "owner",
      });

      return [newOrg];
    });

    return org;
  };
};
