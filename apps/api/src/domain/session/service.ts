import {UAParser} from "ua-parser-js";

import {SessionRepository} from "./repository";

export const SessionService = {
  getSession: async ({token}: {token: string}) => {
    const session = await SessionRepository.getOne({token});

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
    const sessions = await SessionRepository.getAll({userId});

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
};
