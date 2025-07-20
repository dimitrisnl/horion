import type {Context as HonoContext} from "hono";

import {Session} from "~/models/session";
import type {DatabaseConnection} from "~/types/database";
import {createSessionCookieHelper} from "~/utils/session-cookie";

import {createContextEventEmitter} from "./events";

export interface CreateContextOptions {
  context: HonoContext;
  db: DatabaseConnection;
}

export async function createContext({context, db}: CreateContextOptions) {
  const cookieHelper = createSessionCookieHelper(context);
  const eventEmitter = createContextEventEmitter(context);
  const headers = context.req.raw.headers;

  const sessionToken = await cookieHelper.getSessionToken();

  if (!sessionToken) {
    return {
      session: null,
      headers,
      cookieHelper,
      db,
      eventEmitter,
    };
  }

  const session = await Session.findByToken({
    db,
    token: sessionToken,
  });

  if (!session) {
    cookieHelper.deleteSessionCookie();

    return {
      session: null,
      headers,
      cookieHelper,
      db,
      eventEmitter,
    };
  }

  return {
    session,
    headers,
    cookieHelper,
    db,
    eventEmitter,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
