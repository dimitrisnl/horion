import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {Cron} from "croner";
import {lte} from "drizzle-orm";

const EVERY_HOUR = "0 * * * *";

export const setupCrons = () => {
  const deleteExpiredInvitations = new Cron(
    EVERY_HOUR,
    {protect: true},
    async () => {
      console.log("[CRON: deleteExpiredInvitations]: Starting...");
      return db
        .delete(schema.invitations)
        .where(lte(schema.invitations.expiresAt, new Date()))
        .returning()
        .then((deleted) => {
          const deletedCount = deleted.length;
          if (deletedCount > 0) {
            console.log(
              `[CRON: deleteExpiredInvitations]: Deleted ${deletedCount} expired invitations`,
            );
          } else {
            console.log(
              "[CRON: deleteExpiredInvitations]: No expired invitations found",
            );
          }
        });
    },
  );

  const deleteExpiredVerifications = new Cron(
    EVERY_HOUR,
    {protect: true},
    async () => {
      console.log("[CRON: deleteExpiredVerifications]: Starting...");
      return db
        .delete(schema.verifications)
        .where(lte(schema.verifications.expiresAt, new Date()))
        .returning()
        .then((deleted) => {
          const deletedCount = deleted.length;
          if (deletedCount > 0) {
            console.log(
              `[CRON: deleteExpiredVerifications]: Deleted ${deletedCount} expired verifications`,
            );
          } else {
            console.log(
              "[CRON: deleteExpiredVerifications]: No expired verifications found",
            );
          }
        });
    },
  );

  return {deleteExpiredInvitations, deleteExpiredVerifications};
};
