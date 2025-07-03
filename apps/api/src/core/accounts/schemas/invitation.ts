import {z} from "zod/v4";

import {emailSchema} from "./email";
import {organizationIdSchema} from "./organization";
import {userIdSchema} from "./user";

export const invitationIdSchema = z.string().length(12, {
  error: "Invalid invitation ID",
});

export const invitationDomainSchema = z.object({
  id: invitationIdSchema,
  organizationId: organizationIdSchema,
  email: emailSchema,
  role: z.enum(["admin", "member"]),
  expiresAt: z
    .date()
    .min(new Date(), {message: "Expiration date must be in the future"}),
  inviterId: userIdSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createInvitationInputSchema = invitationDomainSchema.pick({
  email: true,
  role: true,
  organizationId: true,
});

export const getInvitationsInputSchema = invitationDomainSchema.pick({
  organizationId: true,
});

export const updateInvitationInputSchema = invitationDomainSchema.pick({
  id: true,
  role: true,
  organizationId: true,
});

export const deleteInvitationInputSchema = invitationDomainSchema.pick({
  id: true,
  organizationId: true,
});
