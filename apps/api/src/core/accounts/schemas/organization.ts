import {z} from "zod/v4";

const invalidOrganizationNames = [
  "undefined",
  "null",
  "false",
  "true",
  "admin",
  "support",
];

export const organizationIdSchema = z.string().length(12, {
  error: "Invalid organization ID",
});

export const organizationNameSchema = z
  .string()
  .trim()
  .refine((name) => !invalidOrganizationNames.includes(name.toLowerCase()), {
    message: "Invalid organization name",
  })
  .min(2, {error: "Organization name must be at least 2 characters"})
  .max(100, {error: "Organization name must be less than 100 characters"});

export const getOrganizationSchema = z.object({
  organizationId: organizationIdSchema,
});

export const createOrganizationSchema = z.object({
  name: organizationNameSchema,
});

export const updateOrganizationSchema = z.object({
  organizationId: organizationIdSchema,
  name: organizationNameSchema,
});
