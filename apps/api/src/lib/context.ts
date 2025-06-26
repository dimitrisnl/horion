import type {Context as HonoContext} from "hono";
import {deleteCookie, getSignedCookie} from "hono/cookie";

import {envVars} from "~/config";
import {SessionService} from "~/domain/session/service";

const SESSION_COOKIE_NAME = "horionos.session_token";

export interface CreateContextOptions {
  context: HonoContext;
}

export async function createContext({context}: CreateContextOptions) {
  const secret = envVars.SECRET;
  const isProduction = envVars.BUN_ENVIRONMENT === "production";

  const sessionToken = await getSignedCookie(
    context,
    secret,
    SESSION_COOKIE_NAME,
    isProduction ? "secure" : undefined,
  );

  if (!sessionToken) {
    return {
      session: null,
      headers: context.req.raw.headers,
    };
  }

  const session = await SessionService.getSession({token: sessionToken});

  if (!session) {
    deleteCookie(context, SESSION_COOKIE_NAME);

    return {
      session: null,
      headers: context.req.raw.headers,
    };
  }

  return {
    session,
    headers: context.req.raw.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
