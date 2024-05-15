import bcrypt from "bcrypt";
import { db } from "../utils/db.server";

type UserType = {
  email: string;
  password: string;
};
type Annouce = {
  success?: string;
  error?: string;
};
export const createUser = async (
  user: Omit<UserType, "id">
): Promise<UserType | Annouce> => {
  //todo: Check existingUser
  const existingUser = await db.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (existingUser) {
    return { error: "This email is existing!" };
  }
  //todo: create user
  const password = bcrypt.hashSync(user.password, 10);
  const userCreated = await db.user.create({
    data: {
      email: user.email,
      password,
    },
  });
  return userCreated;
};
