import {updateUserSchema} from "~/domain/user/schema";
import {userService} from "~/domain/user/service";
import {protectedProcedure} from "~/lib/orpc";

export const userRouter = {
  updateName: protectedProcedure
    .input(updateUserSchema)
    .handler(async ({context, input}) => {
      const name = input.name;
      const userId = context.session.user.id;

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
