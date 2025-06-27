import type {Context, Next} from "hono";
import {cors} from "hono/cors";

import {onError} from "@orpc/server";
import {RPCHandler} from "@orpc/server/fetch";
import {ResponseHeadersPlugin} from "@orpc/server/plugins";

import {createContext} from "~/app/context";
import {zodValidationInterceptor} from "~/app/orpc-interceptors";
import {envVars} from "~/config";
import {rpcRouter} from "~/routes/rpc";
import {clientHints, criticalHints} from "~/utils/fingerprint";

export function setupClientHints() {
  return async (ctx: Context, next: Next) => {
    ctx.header("Accept-CH", clientHints.join(", "));
    ctx.header("Critical-CH", criticalHints.join(", "));
    await next();
  };
}

export function setupCors() {
  return cors({
    origin: envVars.DASHBOARD_URL,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
}

export function setupRPC() {
  const handler = new RPCHandler(rpcRouter, {
    clientInterceptors: [onError((error) => zodValidationInterceptor(error))],
    plugins: [new ResponseHeadersPlugin()],
  });

  return async (ctx: Context, next: Next) => {
    const context = await createContext({context: ctx});
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
