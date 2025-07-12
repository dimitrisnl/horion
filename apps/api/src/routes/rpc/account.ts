import {protectedProcedure, publicProcedure} from "~/app/orpc-procedures";
import {AccountContext} from "~/core/contexts/account";
import {updateUserNameInputSchema} from "~/core/models/user";

export const accountRouter = {
  getSession: publicProcedure.handler(({context}) => {
    const {session} = context;

    if (!session) {
      return {session: null};
    }

    return {
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
    };
  }),

  getCurrentUser: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const actorId = session.userId;

    const user = await AccountContext.getUserById({db, actorId});

    return {user};
  }),

  deleteSession: protectedProcedure.handler(async ({context}) => {
    const {session, cookieService, db} = context;

    await AccountContext.deleteUserSession({
      db,
      actorId: session.userId,
      token: session.token,
    });

    cookieService.deleteSessionCookie();

    return;
  }),

  getSessions: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const actorId = session.userId;

    const sessions = await AccountContext.getUserSessions({
      db,
      actorId,
    });

    return {sessions};
  }),

  updateName: protectedProcedure
    .input(updateUserNameInputSchema)
    .handler(async ({context, input}) => {
      const {db, session} = context;

      const name = input.name;
      const actorId = session.userId;

      const user = await AccountContext.updateUserName({db, actorId, name});

      return {user};
    }),

  getMemberships: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const userId = session.userId;

    const memberships = await AccountContext.getUserMemberships({
      db,
      actorId: userId,
    });

    return {memberships};
  }),

  getInvitations: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const userId = session.userId;

    const invitations = await AccountContext.getUserInvitations({
      db,
      actorId: userId,
    });

    return {invitations};
  }),
};
