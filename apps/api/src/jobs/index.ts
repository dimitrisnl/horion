import {deleteExpiredInvitationsJob} from "./delete-expired-invitations-job";
import {deleteExpiredVerificationsJob} from "./delete-expired-verifications-job";

export const setupCrons = () => {
  deleteExpiredInvitationsJob();
  deleteExpiredVerificationsJob();
};
