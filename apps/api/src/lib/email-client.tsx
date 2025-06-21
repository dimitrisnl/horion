import {MagicLinkEmail} from "@horion/emails";

import {Resend} from "resend";

import {envVars} from "~/config";

const resendClient = new Resend(envVars.RESEND_API_KEY);

const FROM_EMAIL_STRING = "Jim from Horionos <send@horionos.com>";

export const sendMagicLinkEmail = async ({
  to,
  url,
}: {
  to: string;
  url: string;
}) => {
  return sendEmail({
    to,
    subject: "Your magic link",
    react: <MagicLinkEmail url={url} />,
  });
};

const sendEmail = async (props: {
  to: string;
  subject: string;
  react: React.ReactNode;
}) => {
  if (envVars.BUN_ENVIRONMENT === "production") {
    return await resendClient.emails.send({
      from: FROM_EMAIL_STRING,
      ...props,
    });
  }

  console.log("Sending email:", props);
  return;
};
