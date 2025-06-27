import {os} from "@orpc/server";

import type {Context} from "./context";
import {requireAuth} from "./require-auth";

export const op = os.$context<Context>();

export const publicProcedure = op;

export const protectedProcedure = publicProcedure.use(requireAuth);
