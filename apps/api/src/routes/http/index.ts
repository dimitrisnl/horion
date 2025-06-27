import type {Context as HonoContext} from "hono";

import {verifyMagicLinkRoute} from "./auth";

export const httpRouter = {
  "/auth/verify": {GET: verifyMagicLinkRoute},
  "/": {GET: (ctx: HonoContext) => ctx.text("OK")},
};
