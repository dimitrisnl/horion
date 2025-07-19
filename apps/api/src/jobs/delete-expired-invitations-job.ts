import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {Cron} from "croner";
import {lte} from "drizzle-orm";

import {EVERY_HOUR} from "./intervals";

export const deleteExpiredInvitationsJob = () => {
  return new Cron(EVERY_HOUR, {protect: true}, async () => {
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
  });
};
