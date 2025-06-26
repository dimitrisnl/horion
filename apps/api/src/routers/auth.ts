import {z} from "zod/v4";

import {envVars} from "~/config";
import {auth} from "~/lib/auth";
import {publicProcedure} from "~/lib/orpc";

const DASHBOARD_URL = envVars.DASHBOARD_URL;

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
          body: {email, callbackURL: DASHBOARD_URL},
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

  signOut: publicProcedure.handler(async ({context}) => {
    const {success: ok} = await auth.api
      .signOut({
        headers: context.headers,
      })
      .catch(() => {
        throw new Error("Failed to sign out");
      });

    if (!ok) {
      throw new Error("Failed to sign out");
    }

    return {message: "Signed out successfully"};
  }),
};
