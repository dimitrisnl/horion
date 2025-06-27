import {MagicLinkEmail} from "@horionos/emails";

import {sendEmail} from "./client";

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
