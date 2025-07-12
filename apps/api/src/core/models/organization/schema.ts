import {z} from "zod/v4";

import {idSchema} from "../id";

const invalidOrganizationNames = [
  "undefined",
  "null",
  "false",
  "true",
  "admin",
  "support",
];

export const organizationIdSchema = idSchema;

const organizationNameSchema = z
  .string()
  .trim()
  .refine((name) => !invalidOrganizationNames.includes(name.toLowerCase()), {
    message: "Invalid organization name",
  })
  .min(2, {error: "Organization name must be at least 2 characters"})
  .max(100, {error: "Organization name must be less than 100 characters"});

export const organizationSchema = z.object({
  id: organizationIdSchema,
  name: organizationNameSchema,
  logo: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getOrganizationInputSchema = organizationSchema.pick({
  id: true,
});

export const createOrganizationInputSchema = organizationSchema.pick({
  name: true,
});

export const updateOrganizationInputSchema = organizationSchema.pick({
  id: true,
  name: true,
});
