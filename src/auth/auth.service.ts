import jwt from "jsonwebtoken";
import { db } from "../utils/db.server";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export type UserLoginType = {
  id: string;
  userName: string;
  email: string;
  password: string;
  imgUrl: string;
  emailVerified: string;
  provider: string;
};

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

export const loginUser = async (
  dataUser: Omit<UserLoginType, "imgUrl" | "emailVerified">
) => {
  const { password: deletePassword, ...userInfo } = dataUser;
  //todo: create jwt (json web token)
  const access_token =
    process.env.JWT_SECRET &&
    jwt.sign({ id: dataUser.id }, process.env.JWT_SECRET); //* Create token with the id of user mix to JWT_SECRET (vì vậy từ token này, chúng ta có thể giải mã để lấy được id của user)

  const refresh_token =
    process.env.JWT_SECRET &&
    jwt.sign(
      { id: dataUser.id, email: dataUser.email },
      process.env.JWT_SECRET
    ); //* Create token with the id of user mix to JWT_SECRET (vì vậy từ token này, chúng ta có thể giải mã để lấy được id của user)

  return { access_token, refresh_token, userInfo };
};

export const googleUser = async (
  dataUser: Omit<UserLoginType, "id" | "password">
) => {
  //todo: Check user existing or not
  const existingUser = await db.user.findUnique({
    where: {
      email: dataUser.email,
    },
  });
  //todo: if user is not exist, we create a user
  if (!existingUser) {
    //todo: Bởi vì trong User Schema model bắt buộc phải có password để sử dụng cho login credentials, nên tại OAuth, phải create fake password
    const fakePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8); //*toString(36) mean: number is 0-9, letter is a-z, it mix together, slice(-8) là index sẽ tính -1 từ thành phần cuối cùng lên nên sẽ lấy 8 thành phần cuối cùng, slice(8) là lấy từ index 8 tới hết
    const password = bcrypt.hashSync(fakePassword, 10);
    const userGoogle = await db.user.create({
      data: {
        userName: dataUser.userName,
        email: dataUser.email,
        imgUrl: dataUser.imgUrl,
        emailVerified: dataUser.emailVerified,
        provider: dataUser.provider,
        password,
      },
    });
    const { password: deletePassword, ...userInfo } = userGoogle;

    //todo: Tạo token
    const token = jwt.sign(
      { id: userGoogle.id },
      process.env.JWT_SECRET as string
    );
    return { token, userInfo };
  }

  //todo: if user is exist, we need sign in the user
  const token = jwt.sign(
    //todo: create token for this user and save this in cookie
    { id: existingUser.id },
    process.env.JWT_SECRET as string
  );
  const { password: deletePassword, ...userInfo } = existingUser;
  return { token, userInfo };
};
