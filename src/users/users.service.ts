import { db } from "../utils/db.server";
import bcrypt from "bcrypt";

export type UserUpdateType = {
  userName: string;
  email: string;
  gender: "Male" | "Female";
  birthday: string;
  phone: string;
  address: string;
  imgUrl: string;
  newPassword: string;
};

export const updateUser = async (dataUser: UserUpdateType, userId: string) => {
  const passwordUpdated = bcrypt.hashSync(dataUser.newPassword, 10);
  if (dataUser.newPassword) {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordUpdated,
      },
    });
  }
  const userUpdated = await db.user.update({
    where: { id: userId },
    data: {
      userName: dataUser.userName,
      email: dataUser.email,
      gender: dataUser.gender,
      phone: dataUser.phone,
      birthday: dataUser.birthday,
      address: dataUser.address,
      imgUrl: dataUser.imgUrl,
    },
  });
  return userUpdated;
};

export const updateOauthUser = async (
  dataUser: Omit<UserUpdateType, "newPassword" | "email">,
  userId: string
) => {
  const userUpdated = await db.user.update({
    where: { id: userId },
    data: {
      userName: dataUser.userName,
      gender: dataUser.gender,
      phone: dataUser.phone,
      birthday: dataUser.birthday,
      address: dataUser.address,
      imgUrl: dataUser.imgUrl,
    },
  });
  return userUpdated;
};
