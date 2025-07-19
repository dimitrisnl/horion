import {createUser, updateUserName} from "./mutations";
import {findUserByEmail, findUserById} from "./queries";

export const User = {
  create: createUser,
  updateName: updateUserName,
  findById: findUserById,
  findByEmail: findUserByEmail,
};

export * from "./schema";
