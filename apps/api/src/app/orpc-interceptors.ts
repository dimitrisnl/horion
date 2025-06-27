import {ORPCError, ValidationError} from "@orpc/server";
import {z, ZodError} from "zod/v4";

export const zodValidationInterceptor = (error: unknown) => {
  if (
    error instanceof ORPCError &&
    error.code === "BAD_REQUEST" &&
    error.cause instanceof ValidationError
  ) {
    // If you only use Zod you can safely cast to ZodIssue[]
    const zodError = new ZodError(
      error.cause.issues as Array<z.core.$ZodIssue>,
    );

    throw new ORPCError("INPUT_VALIDATION_FAILED", {
      status: 422,
      data: z.flattenError(zodError),
      cause: error.cause,
      message: "Some of your input data is invalid",
    });
  }
};
