import {z} from "zod/v4";

import {envVars} from "~/config/env";
import {MagicLinkSentFailError} from "~/errors";
import {sendMagicLinkEmail} from "~/mailer/send-magic-link";
import {emailSchema} from "~/models/email";
import {Verification} from "~/models/verification";
import {publicProcedure} from "~/orpc";
import {AccountService} from "~/services/account-service";
import {getSessionFingerprint} from "~/utils/session-fingerprint";

const getMagicLinkUrl = (token: string) => {
  return `${envVars.DASHBOARD_URL}/verify-token/?token=${token}`;
};

export const authRouter = {
  sendMagicLink: publicProcedure
    .input(z.object({email: emailSchema}))
    .handler(async ({input, context}) => {
      const {email} = input;
      const {db} = context;

      const verification = await Verification.create({db, value: email});
      const url = getMagicLinkUrl(verification.identifier);

      return sendMagicLinkEmail({to: email, url})
        .then(() => ({message: "Magic link sent successfully"}))
        .catch(() => {
          throw new MagicLinkSentFailError();
        });
    }),
  verifyMagicLink: publicProcedure
    .input(z.object({token: z.string()}))
    .handler(async ({input, context}) => {
      const {token} = input;
      const {db, cookieService, headers} = context;

      const incomingHeaders = Object.fromEntries(headers.entries());
      const fingerprintMetadata = await getSessionFingerprint(incomingHeaders);

      const verification = await AccountService.validateTokenAndCreateUser({
        db,
        token,
        fingerprintMetadata,
      });

      const sessionToken = verification.session.token;
      await cookieService.createSessionCookie(sessionToken);

      return {success: true};
    }),
};
