import {db} from "@horionos/db";

import type {Context, Next} from "hono";

import {RPCHandler} from "@orpc/server/fetch";
import {ResponseHeadersPlugin} from "@orpc/server/plugins";

import {createContext} from "~/context";
import {rpcRouter} from "~/routes/rpc";

export function setupRPC() {
  const handler = new RPCHandler(rpcRouter, {
    plugins: [new ResponseHeadersPlugin()],
  });

  return async (ctx: Context, next: Next) => {
    const context = await createContext({context: ctx, db});
    const {matched, response} = await handler.handle(ctx.req.raw, {
      prefix: "/rpc",
      context,
    });

    if (matched) {
      return ctx.newResponse(response.body, response);
    }
    await next();
  };
}
