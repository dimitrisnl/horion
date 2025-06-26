import {ORPCError} from "@orpc/client";

import {updateUserSchema} from "~/domain/user/schema";
import {userService} from "~/domain/user/service";
import {protectedProcedure} from "~/lib/orpc";

export const userRouter = {
  getCurrentUser: protectedProcedure.handler(async ({context}) => {
    const userId = context.session.userId;

    if (!userId) {
      throw new ORPCError("User not authenticated");
    }
    const user = await userService.getUserById({userId});

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

      const updatedUser = await userService.updateName({
        userId,
        name,
      });

      return {
        message: "User updated successfully",
        user: updatedUser,
      };
    }),
};
