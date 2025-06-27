import {Resend} from "resend";

import {envVars} from "~/config";
import {FROM_EMAIL} from "~/constants";
import {isProduction} from "~/utils/environment";

const resendClient = new Resend(envVars.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactNode;
}) => {
  if (isProduction()) {
    return resendClient.emails.send({from: FROM_EMAIL, to, subject, react});
  }

  console.log("Email (mock):", {to, subject});
};
