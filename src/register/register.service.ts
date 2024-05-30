import bcrypt from "bcrypt";
import { db } from "../utils/db.server";
import { User } from "@prisma/client";

type RegisterUserType = {
  userName: string;
  email: string;
  password: string;
};
type Annouce = {
  success?: string;
  error?: string;
};
export const createUser = async (
  user: Omit<RegisterUserType, "id">
): Promise<Omit<User, "password"> | Annouce> => {
  //todo: create user
  const password = bcrypt.hashSync(user.password, 10);
  const userCreated = await db.user.create({
    data: {
      userName: user.userName,
      email: user.email,
      password,
    },
  });
  const { password: deletePassword, ...userInfo } = userCreated;
  return userInfo;
};
