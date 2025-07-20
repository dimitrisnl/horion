import {defineHandlers} from "@hono/event-emitter";

import {envVars} from "~/config/env";
import {
  sendInvitationWithAccountEmail,
  sendInvitationWithoutAccountEmail,
} from "~/mailer/send-invitation-link";
import {sendMagicLinkEmail} from "~/mailer/send-magic-link";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AvailableEvents = {
  "user-created": {
    email: string;
    id: string;
  };
  "magic-link-requested": {
    email: string;
    identifier: string;
  };
  "invitation-created": {
    inviteeEmail: string;
    inviteeId?: string;
    organizationName: string;
    invitationToken: string;
  };
};

export const handlers = defineHandlers<AvailableEvents>({
  "user-created": [
    (_, payload) => {
      console.log("New user created:", payload);
    },
  ],
  "magic-link-requested": [
    (_, payload) => {
      const magicLinkUrl = `${envVars.DASHBOARD_URL}/verify-token/?token=${payload.identifier}`;

      sendMagicLinkEmail({
        to: payload.email,
        url: magicLinkUrl,
      });
    },
  ],
  "invitation-created": [
    (_, payload) => {
      if (payload.inviteeId) {
        const invitationUrl = `${envVars.DASHBOARD_URL}/account/invitations`;
        sendInvitationWithAccountEmail({
          to: payload.inviteeEmail,
          url: invitationUrl,
          organization: {name: payload.organizationName},
        });
      } else {
        sendInvitationWithoutAccountEmail({
          to: payload.inviteeEmail,
          url: `${envVars.DASHBOARD_URL}/invitation/${payload.invitationToken}`,
          organization: {name: payload.organizationName},
        });
      }
    },
  ],
});
