import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {generateId} from "~/utils/id/generate-id";

export const createOrganization = async ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) => {
  const now = new Date();
  const orgId = generateId();
  const memberId = generateId();

  const [org = null] = await db.transaction(async (tx) => {
    const [newOrg] = await tx
      .insert(schema.organizations)
      .values({id: orgId, name, createdAt: now})
      .returning();

    await tx.insert(schema.memberships).values({
      id: memberId,
      userId: userId,
      organizationId: orgId,
      role: "owner",
      createdAt: now,
    });

    return [newOrg];
  });

  return org;
};
