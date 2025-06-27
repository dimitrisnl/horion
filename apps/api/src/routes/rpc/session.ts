import {protectedProcedure} from "~/app/orpc-procedures";
import {getSessions} from "~/core/accounts/queries/get-sessions";

export const sessionRouter = {
  getAll: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const userId = session.userId;

    const sessions = await getSessions({db})({userId});

    return {
      sessions,
    };
  }),
};
