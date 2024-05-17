import { db } from "../utils/db.server";
import bcrypt from "bcrypt";

type LoginUserType = {
  email: string;
  password: string;
};
export const getUser = async (dataUser: Omit<LoginUserType, "id">) => {
  const user = await db.user.findFirst({
    where: {
      email: dataUser.email,
      password: bcrypt.hashSync(dataUser.password, 10),
    },
  });
  return user;
};
