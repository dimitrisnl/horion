import {z} from "zod/v4";

import {envVars} from "~/config";
import {SessionService} from "~/domain/session/service";
import {auth} from "~/lib/auth";
import {protectedProcedure, publicProcedure} from "~/lib/orpc";

export const authRouter = {
  getSession: publicProcedure.handler(({context}) => {
    const {session} = context;

    if (!session) {
      return {
        session: null,
      };
    }

    return {
      session: {
        token: session.token,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
    };
  }),

  sendMagicLink: publicProcedure
    .input(z.object({email: z.email()}))
    .handler(async ({input, context}) => {
      const {email} = input;

      const {status: ok} = await auth.api
        .signInMagicLink({
          body: {email, callbackURL: envVars.DASHBOARD_URL},
          headers: context.headers,
        })
        .catch(() => {
          throw new Error("Failed to send magic link");
        });

      if (!ok) {
        throw new Error("Failed to send magic link");
      }

      return {message: "Magic link sent successfully"};
    }),

  signOut: protectedProcedure.handler(async ({context}) => {
    const {session, cookieService} = context;

    await SessionService.deleteSession({token: session.token});
    cookieService.deleteSessionCookie();

    return {message: "Signed out successfully"};
  }),
};
