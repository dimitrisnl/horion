import {ORPCError, os} from "@orpc/server";

import type {Context} from "./context";

export const op = os.$context<Context>();

export const requireAuth = op.middleware(async ({context, next}) => {
  if (!context.session?.userId) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const publicProcedure = op;
export const protectedProcedure = publicProcedure.use(requireAuth);
