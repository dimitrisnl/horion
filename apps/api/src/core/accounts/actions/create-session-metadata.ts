import type {Database} from "@horionos/db";
import * as schema from "@horionos/db/schema";

import {generateId} from "~/utils/id/generate-id";

interface CreateSessionMetadataProps {
  sessionId: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  engine: string;
  model: string;
  ipAddress?: string;
}

export const createSessionMetadata = ({db}: {db: Database}) => {
  return async (props: CreateSessionMetadataProps) => {
    const {
      sessionId,
      userAgent,
      browser,
      os,
      device,
      engine,
      model,
      ipAddress,
    } = props;

    const metadataId = generateId();

    const [metadata = null] = await db
      .insert(schema.sessionMetadata)
      .values({
        id: metadataId,
        sessionId,
        userAgent,
        browser,
        os,
        device,
        engine,
        model,
        ipAddress: ipAddress || null,
      })
      .returning();

    return metadata;
  };
};
