import {ORPCError, os, ValidationError} from "@orpc/server";
import {z, ZodError} from "zod/v4";

import {AuthenticationError, BaseError} from "~/core/errors/error-types";

import type {Context} from "./context";

export const op = os.$context<Context>();

const errorHandlingMiddleware = op.middleware(async ({next}) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof BaseError) {
      throw new ORPCError(error.code, {
        status: error.status,
        message: error.message,
        data: {
          details: error.details,
        },
      });
    }

    if (
      error instanceof ORPCError &&
      error.code === "BAD_REQUEST" &&
      error.cause instanceof ValidationError
    ) {
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

    console.log(error);

    // Report the error to a logging service.
    throw error;
  }
});

const requireAuthMiddleware = op.middleware(async ({context, next}) => {
  if (!context.session?.userId) {
    throw new AuthenticationError(
      "You must be authenticated to perform this action.",
    );
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const publicProcedure = op.use(errorHandlingMiddleware);
export const protectedProcedure = publicProcedure.use(requireAuthMiddleware);
