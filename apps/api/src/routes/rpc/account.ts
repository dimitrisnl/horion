import {z} from "zod/v4";

import {OrganizationNotFoundError} from "~/errors";
import {updateUserNameInputSchema} from "~/models/user";
import {protectedProcedure, publicProcedure} from "~/orpc";
import {AccountService} from "~/services/account-service";

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

    const user = await AccountService.getUserById({db, actorId});

    return {user};
  }),

  getMembership: protectedProcedure
    .input(z.object({organizationId: z.string()}))
    .handler(async ({context, input}) => {
      const {db, session} = context;
      const actorId = session.userId;

      const {organizationId} = input;

      const membership = await AccountService.getUserMembership({
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
    const {session, cookieHelper, db} = context;

    await AccountService.deleteUserSession({
      db,
      actorId: session.userId,
      token: session.token,
    });

    cookieHelper.deleteSessionCookie();

    return;
  }),

  getSessions: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const actorId = session.userId;

    const sessions = await AccountService.getUserSessions({
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

      const user = await AccountService.updateUserName({db, actorId, name});

      return {user};
    }),

  getMemberships: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const userId = session.userId;

    const memberships = await AccountService.getUserMemberships({
      db,
      actorId: userId,
    });

    return {memberships};
  }),

  getInvitations: protectedProcedure.handler(async ({context}) => {
    const {db, session} = context;
    const userId = session.userId;

    const invitations = await AccountService.getUserInvitations({
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
      const {db, cookieHelper} = context;
      const {invitationToken} = input;

      const {user, membership, session} =
        await AccountService.acceptInvitationAsGuest({
          db,
          invitationToken,
        });

      await cookieHelper.createSessionCookie(session.token);

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

      const {membership} = await AccountService.acceptInvitationAsUser({
        db,
        actorId,
        invitationId,
      });

      return {membership};
    }),
};
