import {ORPCError} from "@orpc/client";

import {protectedProcedure} from "~/app/orpc";
import {updateUser} from "~/core/accounts/actions/update-user";
import {getUserById} from "~/core/accounts/queries/get-user-by-id";
import {updateUserSchema} from "~/core/accounts/schemas/user";

export const userRouter = {
  getCurrentUser: protectedProcedure.handler(async ({context}) => {
    const userId = context.session.userId;

    if (!userId) {
      throw new ORPCError("User not authenticated");
    }
    const user = await getUserById({userId});

    if (!user) {
      throw new ORPCError("User not found");
    }
    return {
      user,
    };
  }),

  updateName: protectedProcedure
    .input(updateUserSchema)
    .handler(async ({context, input}) => {
      const name = input.name;
      const userId = context.session.userId;

      const updatedUser = await updateUser({userId, name});

      return {
        message: "User updated successfully",
        user: updatedUser,
      };
    }),
};
