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

export const organizationDomainSchema = z.object({
  id: organizationIdSchema,
  name: organizationNameSchema,
  logo: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const getOrganizationInputSchema = organizationDomainSchema.pick({
  id: true,
});

export const createOrganizationInputSchema = organizationDomainSchema.pick({
  name: true,
});

export const updateOrganizationInputSchema = organizationDomainSchema.pick({
  id: true,
  name: true,
});
