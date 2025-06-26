import {SESSION_DURATION_IN_SECONDS} from "~/constants";
import {generateToken} from "~/lib/token";

import {SessionRepository} from "./repository";

export const SessionService = {
  getSession: async ({token}: {token: string}) => {
    const session = await SessionRepository.find({token});

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      token: session.token,
      userId: session.userId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      expiresAt: session.expiresAt,
    };
  },

  getAll: async ({userId}: {userId: string}) => {
    const sessions = await SessionRepository.findAll({userId});

    return sessions;
  },

  createSession: async ({userId}: {userId: string}) => {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_SECONDS * 1000); // 30 days

    const session = await SessionRepository.create({token, userId, expiresAt});

    return session;
  },

  deleteSession: async ({token}: {token: string}) => {
    // eslint-disable-next-line
    await SessionRepository.delete({token});
  },

  createSessionMetadata: async ({
    sessionId,
    userAgent,
    browser,
    os,
    device,
    engine,
    model,
    ipAddress,
  }: {
    sessionId: string;
    userAgent: string;
    browser: string;
    os: string;
    device: string;
    engine: string;
    model: string;
    ipAddress?: string;
  }) => {
    const sessionMetadata = await SessionRepository.createMetadata({
      sessionId,
      userAgent,
      browser,
      os,
      device,
      engine,
      model,
      ipAddress: ipAddress || "",
    });

    return sessionMetadata;
  },
};
