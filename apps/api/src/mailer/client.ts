import {Resend} from "resend";

import {envVars} from "~/config/env";
import {isProduction} from "~/config/runtime";

export const FROM_EMAIL = "Jim from Horionos <send@horionos.com>";

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

  console.log("Email (mock):", {to, subject, react});
};
