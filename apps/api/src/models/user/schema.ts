import {z} from "zod/v4";

import {emailSchema} from "../email";
import {idSchema} from "../id";

export const userIdSchema = idSchema;

export const userSchema = z.object({
  id: userIdSchema,
  name: z.string().max(50, "Name must be less than 50 characters").trim(),
  email: emailSchema,
  emailVerified: z.boolean().default(false),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateUserNameInputSchema = userSchema.pick({
  name: true,
});

export const createUserInputSchema = userSchema.pick({
  email: true,
  name: true,
  emailVerified: true,
  image: true,
});
