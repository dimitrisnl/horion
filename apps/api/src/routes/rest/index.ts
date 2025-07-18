import type {Context as HonoContext} from "hono";

export const restRouter = {
  "/": {GET: (ctx: HonoContext) => ctx.text("OK")},
};
