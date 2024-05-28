import jwt from "jsonwebtoken";
import { db } from "../utils/db.server";
import bcrypt from "bcrypt";

export type UserLoginType = {
  id: string;
  userName: string;
  email: string;
  password: string;
  imgUrl: string;
  emailVerified: string;
  provider: string;
};

export const loginUser = async (
  dataUser: Omit<UserLoginType, "password" | "imgUrl" | "emailVerified">
) => {
  //*sử dụng Omit để lọc đi password vaf imgUrl của UserType
  //todo: create jwt (json web token)
  const token = jwt.sign({ id: dataUser.id }, process.env.JWT_SECRET as string); //* Create token with the id of user mix to JWT_SECRET (vì vậy từ token này, chúng ta có thể giải mã để lấy được id của user)
  return { token, dataUser };
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
