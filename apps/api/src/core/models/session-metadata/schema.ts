import {z} from "zod/v4";

import {idSchema} from "../id";

export const sessionMetadataSchema = z.object({
  id: idSchema,
  sessionId: idSchema,
  browser: z.string(),
  os: z.string(),
  device: z.string(),
  engine: z.string(),
  model: z.string(),
  userAgent: z.string(),
  ipAddress: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSessionMetadataInputSchema = sessionMetadataSchema.pick({
  sessionId: true,
  browser: true,
  os: true,
  device: true,
  engine: true,
  model: true,
  userAgent: true,
  ipAddress: true,
});
