import {nanoid} from "nanoid";
import {z} from "zod/v4";

export const idSchema = z.string().length(12, {error: "Invalid ID format"});

export const generateId = () => {
  const id = nanoid(12);
  return idSchema.parse(id);
};
