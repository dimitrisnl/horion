import type {Database} from "@horionos/db";

import type {Context as HonoContext} from "hono";

import {getSession} from "~/core/accounts/queries/get-session";
import {createCookieService} from "~/services/cookies";

export interface CreateContextOptions {
  context: HonoContext;
  db: Database;
}

export async function createContext({context, db}: CreateContextOptions) {
  const cookieService = createCookieService(context);
  const headers = context.req.raw.headers;

  const sessionToken = await cookieService.getSessionToken();

  if (!sessionToken) {
    return {
      session: null,
      headers,
      cookieService,
      db,
    };
  }

  const session = await getSession({db})({token: sessionToken});

  if (!session) {
    cookieService.deleteSessionCookie();

    return {
      session: null,
      headers,
      cookieService,
      db,
    };
  }

  return {
    session,
    headers,
    cookieService,
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
