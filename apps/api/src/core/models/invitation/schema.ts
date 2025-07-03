import {z} from "zod/v4";

import {emailSchema} from "../email";
import {idSchema} from "../id";
import {organizationIdSchema} from "../organization";
import {tokenSchema} from "../token";
import {userIdSchema} from "../user";

const invitationIdSchema = idSchema;
const invitationTokenSchema = tokenSchema;

export const invitationRoleSchema = z.enum(["admin", "member"]);

export const INVITATION_EXPIRATION_IN_DAYS = 7;

export const invitationSchema = z.object({
  id: invitationIdSchema,
  token: invitationTokenSchema,
  organizationId: organizationIdSchema,
  email: emailSchema,
  role: invitationRoleSchema,
  expiresAt: z
    .date()
    .min(new Date(), {message: "Expiration date must be in the future"}),
  inviterId: userIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createInvitationInputSchema = invitationSchema.pick({
  email: true,
  role: true,
  organizationId: true,
});

export const getInvitationsInputSchema = invitationSchema.pick({
  organizationId: true,
});

export const deleteInvitationInputSchema = invitationSchema.pick({
  id: true,
  organizationId: true,
});
