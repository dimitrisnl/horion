import {z} from "zod/v4";

import {AccountContext} from "~/core/contexts/account";
import {OrganizationNotFoundError} from "~/core/errors/error-types";
import {updateUserNameInputSchema} from "~/core/models/user";
import {protectedProcedure, publicProcedure} from "~/orpc";

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

  getMembership: protectedProcedure
    .input(z.object({organizationId: z.string()}))
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const actorId = session.userId;

      const {organizationId} = input;

      const membership = await AccountContext.getUserMembership({
        db,
        actorId,
        organizationId,
      });

      if (!membership) {
        throw new OrganizationNotFoundError();
      }

      return {membership};
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

  // Todo: Add session metadata fingerprinting
  acceptInvitationAsGuest: publicProcedure
    .input(
      z.object({
        invitationToken: z.string(),
      }),
    )
    .handler(async ({context, input}) => {
      const {db, cookieService} = context;
      const {invitationToken} = input;

      const {user, membership, session} =
        await AccountContext.acceptInvitationAsGuest({
          db,
          invitationToken,
        });

      await cookieService.createSessionCookie(session.token);

      return {user, membership};
    }),

  acceptInvitationAsUser: protectedProcedure
    .input(
      z.object({
        invitationId: z.string(),
      }),
    )
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const actorId = session.userId;
      const {invitationId} = input;

      const {membership} = await AccountContext.acceptInvitationAsUser({
        db,
        actorId,
        invitationId,
      });

      return {membership};
    }),
};
