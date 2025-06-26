import {UAParser} from "ua-parser-js";

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

    const formattedSessions = sessions.map((session) => {
      const {browser, os, device, engine} = UAParser(session.userAgent || "");

      return {
        id: session.id,
        token: session.token,
        os: os.toString(),
        browser: browser.toString(),
        device: device.toString(),
        engine: engine.toString(),
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    });

    return formattedSessions;
  },

  createSession: async ({userId}: {userId: string}) => {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_SECONDS * 1000); // 30 days

    const session = await SessionRepository.create({
      token,
      userId,
      userAgent: "",
      ipAddress: "", // TODO: remove this, don't store IP address
      expiresAt,
    });

    return session;
  },

  deleteSession: async ({token}: {token: string}) => {
    // eslint-disable-next-line
    await SessionRepository.delete({token});
  },
};
