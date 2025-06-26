import type {Context as HonoContext} from "hono";
import {deleteCookie, getSignedCookie} from "hono/cookie";

import {envVars} from "~/config";
import {SESSION_COOKIE_NAME} from "~/constants";

export function createCookieService(context: HonoContext) {
  return {
    getSessionToken: async () =>
      getSignedCookie(
        context,
        envVars.SECRET,
        SESSION_COOKIE_NAME,
        envVars.BUN_ENVIRONMENT === "production" ? "secure" : undefined,
      ),

    deleteSessionCookie: () => {
      deleteCookie(context, SESSION_COOKIE_NAME);
    },
  };
}
