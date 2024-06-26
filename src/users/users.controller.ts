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
    existingUser.userName === request.body.userName &&
    existingUser.email === request.body.email &&
    existingUser.phone === request.body.phone &&
    existingUser.gender === request.body.gender &&
    existingUser.address === request.body.address &&
    existingUser.birthday === request.body.birthday &&
    existingUser.imgUrl === request.body.imgUrl &&
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

export const UpdateOauthUserInfo = async (
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
  try {
    const userUpdated = await UserService.updateOauthUser(
      request.body,
      request.params.id
    );
    return response.status(200).json(userUpdated);
  } catch (error) {
    return next(error);
  }
};

export const DeleteUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.params.id) {
    return next({ statusCode: 400, message: "The params is not available!" });
  }

  //todo: Check xem token chứa request.body.user.id của verifiUser có tồn tại hay không (tồn tại đồng nghĩa với việc user đang được log in)
  if (request.params.id !== request.body.user.id) {
    return next({
      statusCode: 400,
      message: "The access_token is not existing!",
    });
  }

  const existingUser = await db.user.findFirst({
    where: {
      id: request.params.id,
    },
  });
  if (!existingUser) {
    return next({ statusCode: 401, message: "The user is not existing!" });
  }
  try {
    UserService.deleteUser(request.params.id);
    return response
      .clearCookie("access_token")
      .status(200)
      .json({ message: "The user has been deleted." });
  } catch (error) {
    return next(error);
  }
};

