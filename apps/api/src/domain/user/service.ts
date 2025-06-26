import {userRepo} from "~/domain/user/repository";

export const userService = {
  getUserById: async ({userId}: {userId: string}) => {
    const user = await userRepo.findById(userId);

    return user;
  },
  updateName: async ({userId, name}: {userId: string; name: string}) => {
    const updatedUser = await userRepo.update({userId, name});

    return updatedUser;
  },
};
