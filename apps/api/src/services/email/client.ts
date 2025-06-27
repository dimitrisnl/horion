import {Resend} from "resend";

import {envVars} from "~/config";

const resendClient = new Resend(envVars.RESEND_API_KEY);
const FROM_EMAIL = "Jim from Horionos <send@horionos.com>";

export const sendEmail = async ({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactNode;
}) => {
  if (envVars.BUN_ENVIRONMENT === "production") {
    return resendClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
    });
  }

  console.log("Email (mock):", {to, subject});
};
