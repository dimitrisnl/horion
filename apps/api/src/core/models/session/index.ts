import {createSession, deleteSession} from "./mutations";
import {findSessionByToken, findSessionsByUserId} from "./queries";

export const Session = {
  create: createSession,
  findByToken: findSessionByToken,
  findManyByUserId: findSessionsByUserId,
  delete: deleteSession,
};

export * from "./schema";
