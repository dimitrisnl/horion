import type {Context as HonoContext} from "hono";

import {getSession} from "~/core/accounts/queries/get-session";
import {createCookieService} from "~/services/cookies";

export interface CreateContextOptions {
  context: HonoContext;
}

export async function createContext({context}: CreateContextOptions) {
  const cookieService = createCookieService(context);
  const headers = context.req.raw.headers;

  const sessionToken = await cookieService.getSessionToken();

  if (!sessionToken) {
    return {
      session: null,
      headers,
      cookieService,
    };
  }

  const session = await getSession({token: sessionToken});

  if (!session) {
    cookieService.deleteSessionCookie();

    return {
      session: null,
      headers,
      cookieService,
    };
  }

  return {
    session,
    headers,
    cookieService,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
