import type {Context as HonoContext} from "hono";

import {Session} from "~/models/session";
import type {DatabaseConnection} from "~/types/database";
import {createSessionCookieHelper} from "~/utils/session-cookie";

export interface CreateContextOptions {
  context: HonoContext;
  db: DatabaseConnection;
}

export async function createContext({context, db}: CreateContextOptions) {
  const cookieService = createSessionCookieHelper(context);
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

  const session = await Session.findByToken({
    db,
    token: sessionToken,
  });

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
