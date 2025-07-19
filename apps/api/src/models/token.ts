import {nanoid} from "nanoid";
import {z} from "zod/v4";

export const tokenSchema = z.string().length(21, {
  error: "Invalid token format",
});

export const generateToken = () => {
  const token = nanoid(21);
  return tokenSchema.parse(token);
};
