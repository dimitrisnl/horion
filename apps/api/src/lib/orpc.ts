import {ORPCError, os} from "@orpc/server";

import type {Context} from "./context";

export const op = os.$context<Context>();

export const publicProcedure = op;

const requireAuth = op.middleware(async ({context, next}) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);
