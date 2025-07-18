import {z} from "zod/v4";

import {envVars} from "~/config";
import {AccountContext} from "~/core/contexts/account";
import {MagicLinkSentFailError} from "~/core/errors/error-types";
import {emailSchema} from "~/core/models/email";
import {Verification} from "~/core/models/verification";
import {publicProcedure} from "~/orpc";
import {sendMagicLinkEmail} from "~/services/email";
import {getSessionFingerprint} from "~/utils/fingerprint";

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

      const verification = await AccountContext.validateTokenAndCreateUser({
        db,
        token,
        fingerprintMetadata,
      });

      const sessionToken = verification.session.token;
      await cookieService.createSessionCookie(sessionToken);

      return {success: true};
    }),
};
