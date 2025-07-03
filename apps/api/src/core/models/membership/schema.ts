import {z} from "zod/v4";

import {idSchema} from "../id";
import {organizationIdSchema} from "../organization";
import {userIdSchema} from "../user";

const membershipIdSchema = idSchema;
export const membershipRoleSchema = z.enum(["admin", "member", "owner"]);

export const membershipSchema = z.object({
  id: membershipIdSchema,
  organizationId: organizationIdSchema,
  userId: userIdSchema,
  role: membershipRoleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createMembershipInputSchema = membershipSchema.pick({
  organizationId: true,
  userId: true,
  role: true,
});
