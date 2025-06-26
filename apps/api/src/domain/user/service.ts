import {userRepo} from "~/domain/user/repository";

export const userService = {
  getUserById: async ({userId}: {userId: string}) => {
    const user = await userRepo.findById(userId);

    return user;
  },
  getUserByEmail: async ({email}: {email: string}) => {
    const user = await userRepo.findByEmail(email);

    return user;
  },
  updateName: async ({userId, name}: {userId: string; name: string}) => {
    const updatedUser = await userRepo.update({userId, name});

    return updatedUser;
  },
  createUser: async ({email}: {email: string}) => {
    const user = await userRepo.create({email});

    return user;
  },
};
