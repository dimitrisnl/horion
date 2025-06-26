import {z} from "zod/v4";

import {envVars} from "~/config";
import {SessionService} from "~/domain/session/service";
import {verificationService} from "~/domain/verification/service";
import {sendMagicLinkEmail} from "~/lib/email-client";
import {protectedProcedure, publicProcedure} from "~/lib/orpc";

const getMagicLinkUrl = (token: string) => {
  return `${envVars.BASE_URL}/auth/verify?token=${token}`;
};

export const authRouter = {
  getActiveSession: publicProcedure.handler(({context}) => {
    const {session} = context;

    if (!session) {
      return {
        session: null,
      };
    }

    return {
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
    };
  }),

  sendMagicLink: publicProcedure
    .input(z.object({email: z.email()}))
    .handler(async ({input}) => {
      const {email} = input;

      const verification = await verificationService.createVerificationToken({
        email,
      });

      const url = getMagicLinkUrl(verification.identifier);

      return sendMagicLinkEmail({to: email, url})
        .then(() => {
          return {message: "Magic link sent successfully"};
        })
        .catch(() => {
          throw new Error("Failed to send magic link email");
        });
    }),

  signOut: protectedProcedure.handler(async ({context}) => {
    const {session, cookieService} = context;

    await SessionService.deleteSession({token: session.token});
    cookieService.deleteSessionCookie();

    return {message: "Signed out successfully"};
  }),
};
