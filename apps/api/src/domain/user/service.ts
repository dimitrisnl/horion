import {userRepo} from "~/domain/user/repository";

export const userService = {
  updateName: async ({userId, name}: {userId: string; name: string}) => {
    const updatedUser = await userRepo.update({userId, name});

    return updatedUser;
  },
};
