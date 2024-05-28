import { NextFunction, Request, Response } from "express";
import * as UserService from "./users.service";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server";
import bcrypt from "bcrypt";

export const getUsers = async (request: Request, response: Response) => {
  try {
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

//! request.body.user là giá trị user tạo thành jwt token (trong dự án này sử dụng userId và JWT_SECRET nên request.body.user={id:'....',...})
//! request.body là các giá trị user gửi request từ client

export const UpdateUserInfo = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //todo: Check validation
  const validError = validationResult(request.body);
  if (!validError.isEmpty()) {
    return next(validError.array());
  }

  //todo: Check params id of user, có giống với id of user của user từ verifyUser gửi qua hay không
  if (request.body.user.id !== request.params.id) {
    return next({ statusCode: 401, message: "This account is not available!" });
  }
  //todo: Check existingUser
  const existingUser = await db.user.findFirst({
    where: {
      id: request.params.id,
    },
  });
  if (!existingUser) {
    return next({ statusCode: 400, message: "This account is not existing!" });
  }

  //todo: Check thông tin hiện tại và thông tin gửi lên có giống nhau k, nếu giống thì return
  if (
    !!existingUser.userName === !!request.body.userName &&
    !!existingUser.email === !!request.body.email &&
    !!existingUser.phone === !!request.body.phone &&
    !!existingUser.gender === !!request.body.gender &&
    !!existingUser.address === !!request.body.address &&
    !!existingUser.birthday === !!request.body.birthday &&
    !!existingUser.imgUrl === !!request.body.imgUrl &&
    !request.body.newPassword &&
    !request.body.reNewPassword
  ) {
    return next({ statusCode: 400, message: "Nothing is not changed!" }); //* bad req
  }

  //todo: Check newPassword and reNewPassword
  if (
    !!request.body.newPassword &&
    !!request.body.reNewPassword &&
    request.body.newPassword !== request.body.reNewPassword
  ) {
    return next({
      statusCode: 400,
      message: "The new-password and the re-new-password are not match!", //*bad req
    });
  }

  //todo: Check currentPassword
  const isPasswordMatched = bcrypt.compareSync(
    request.body.currentPassword,
    existingUser.password
  );
  if (!isPasswordMatched) {
    return next({ statusCode: 401, message: "The password is incorrect!" }); //* authorized
  }
  try {
    const userUpdated = await UserService.updateUser(
      request.body,
      request.params.id
    );
    return response.status(200).json(userUpdated);
  } catch (error: any) {
    return next(error);
  }
};
