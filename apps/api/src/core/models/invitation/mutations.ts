import * as schema from "@horionos/db/schema";

import {addDays} from "date-fns";
import {and, eq} from "drizzle-orm";
import type {z} from "zod/v4";

import {InvitationAlreadyExistsError} from "~/core/errors/error-types";
import type {DatabaseConnection} from "~/types/database";

import {generateId} from "../id";
import {generateToken} from "../token";
import {
  type createInvitationInputSchema,
  deleteInvitationInputSchema,
  INVITATION_EXPIRATION_IN_DAYS,
  invitationSchema,
} from "./schema";

export const createInvitation = async ({
  db,
  inviterId,
  ...attrs
}: {
  db: DatabaseConnection;
  inviterId: string;
} & z.infer<typeof createInvitationInputSchema>) => {
  const now = new Date();

  const values = invitationSchema.parse({
    ...attrs,
    inviterId,
    id: generateId(),
    token: generateToken(),
    status: "pending",
    expiresAt: addDays(now, INVITATION_EXPIRATION_IN_DAYS),
    createdAt: now,
    updatedAt: now,
  });

  const [newInvitation = null] = await db
    .insert(schema.invitations)
    .values(values)
    .returning()
    .onConflictDoNothing();

  if (!newInvitation) {
    throw new InvitationAlreadyExistsError();
  }

  return newInvitation;
};

export const deleteInvitation = async ({
  db,
  ...attrs
}: {
  db: DatabaseConnection;
} & z.infer<typeof deleteInvitationInputSchema>) => {
  const {id, organizationId} = deleteInvitationInputSchema.parse(attrs);

  const [deleted = null] = await db
    .delete(schema.invitations)
    .where(
      and(
        eq(schema.invitations.organizationId, organizationId),
        eq(schema.invitations.id, id),
      ),
    )
    .returning({
      id: schema.invitations.id,
    });

  return deleted;
};
