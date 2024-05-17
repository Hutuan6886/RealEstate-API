import bcrypt from "bcrypt";
import { db } from "../utils/db.server";

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
): Promise<RegisterUserType | Annouce> => {
  //todo: create user
  const password = bcrypt.hashSync(user.password, 10);
  const userCreated = await db.user.create({
    data: {
      userName: user.userName,
      email: user.email,
      password: bcrypt.hashSync(user.password, 10),
    },
  });
  return userCreated;
};
