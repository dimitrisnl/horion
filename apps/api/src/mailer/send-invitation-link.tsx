import {
  InvitationWithAccountCreationEmail,
  InvitationWithoutAccountCreationEmail,
} from "@horionos/emails";

import {sendEmail} from "./client";

export const sendInvitationWithAccountEmail = async ({
  to,
  url,
  organization,
}: {
  to: string;
  url: string;
  organization: {name: string};
}) => {
  return sendEmail({
    to,
    subject: `You're invited to join ${organization.name}`,
    react: (
      <InvitationWithAccountCreationEmail
        url={url}
        organizationName={organization.name}
      />
    ),
  });
};

export const sendInvitationWithoutAccountEmail = async ({
  to,
  url,
  organization,
}: {
  to: string;
  url: string;
  organization: {name: string};
}) => {
  return sendEmail({
    to,
    subject: `You're invited to join ${organization.name}`,
    react: (
      <InvitationWithoutAccountCreationEmail
        url={url}
        organizationName={organization.name}
      />
    ),
  });
};
