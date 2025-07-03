import {z} from "zod/v4";

import {idSchema} from "../id";
import {tokenSchema} from "../token";

export const VERIFICATION_EXPIRATION_IN_MINUTES = 5;

const verificationIdSchema = idSchema;
const verificationTokenSchema = tokenSchema;

export const verificationSchema = z.object({
  id: verificationIdSchema,
  identifier: verificationTokenSchema,
  value: z.string(),
  expiresAt: z
    .date()
    .min(new Date(), {message: "Expiration date must be in the future"}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createVerificationInputSchema = verificationSchema.pick({
  value: true,
});

export const deleteVerificationInputSchema = verificationSchema.pick({
  id: true,
});

export const isVerificationExpired = (
  verification: z.infer<typeof verificationSchema>,
) => {
  return verification.expiresAt < new Date();
};
