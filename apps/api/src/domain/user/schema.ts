import {z} from "zod/v4";

export const userNameSchema = z
  .string()
  .min(1, "Name must be at least 1 characters")
  .max(50, "Name must be less than 50 characters")
  .trim();

export const updateUserSchema = z.object({
  name: userNameSchema,
});
