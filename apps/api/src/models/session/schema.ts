import {z} from "zod/v4";

import {idSchema} from "../id";
import {tokenSchema} from "../token";
import {userIdSchema} from "../user";

export const SESSION_EXPIRATION_IN_DAYS = 30;

const sessionIdSchema = idSchema;

export const sessionSchema = z.object({
  id: sessionIdSchema,
  userId: userIdSchema,
  token: tokenSchema,
  expiresAt: z
    .date()
    .min(new Date(), {message: "Expiration date must be in the future"}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSessionInputSchema = sessionSchema.pick({
  userId: true,
});

export const getSessionInputSchema = sessionSchema.pick({
  id: true,
});

export const deleteSessionInputSchema = sessionSchema.pick({
  token: true,
  userId: true,
});
