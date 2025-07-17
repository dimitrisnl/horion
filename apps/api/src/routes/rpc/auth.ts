import {z} from "zod/v4";

import {publicProcedure} from "~/app/orpc";
import {envVars} from "~/config";
import {MagicLinkSentFailError} from "~/core/errors/error-types";
import {emailSchema} from "~/core/models/email";
import {Verification} from "~/core/models/verification";
import {sendMagicLinkEmail} from "~/services/email";

const getMagicLinkUrl = (token: string) => {
  return `${envVars.BASE_URL}/auth/verify?token=${token}`;
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
};
