import {sendEmail} from "./client";

export const sendInvitationEmail = async ({
  to,
  url,
}: {
  to: string;
  url: string;
}) => {
  return sendEmail({
    to,
    subject: "You're invited",
    react: null,
  });
};
