import {db} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {Cron} from "croner";
import {lte} from "drizzle-orm";

import {EVERY_HOUR} from "./intervals";

export const deleteExpiredVerificationsJob = () => {
  return new Cron(EVERY_HOUR, {protect: true}, async () => {
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
  });
};
