import {z} from "zod/v4";
import {emailSchema} from "./email";

export const userIdSchema = z.string().length(12, {
  error: "Invalid user ID",
});

export const userNameSchema = z
  .string()
  .min(1, "Name must be at least 1 characters")
  .max(50, "Name must be less than 50 characters")
  .trim();

export const userDomainSchema = z.object({
  id: userIdSchema,
  name: userNameSchema,
  email: emailSchema,
  emailVerified: z.boolean().default(false),
  image: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const updateUserNameInputSchema = z.object({
  name: userNameSchema,
});
