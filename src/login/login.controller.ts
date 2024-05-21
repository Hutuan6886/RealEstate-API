import { Request, Response, response } from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server";
import * as LoginService from "./login.service";
import bcrypt from "bcrypt";

export const loginUser = async (
  request: Request,
  response: Response,
  next: any
) => {
  const validError = validationResult(request);
  if (!validError.isEmpty()) {
    return response.status(400).json(validError.array());
  }
  const { email, password } = request.body;
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!existingUser) {
    // return Response.status(404).json({error:'This email is not existing!'})
    return next({ statusCode: 404, message: "This email is not existing!" });
  }
  const isMatchPassword = bcrypt.compareSync(password, existingUser?.password);
  if (!isMatchPassword) {
    // return Response.status(404).json({ error: "The password is incorrect!" });
    return next({ statusCode: 401, message: "The password is incorrect!" });
  }

  if (!process.env.JWT_SECRET) {
    // return Response.status(400).json({ error: "JWT_SECRET is not available!" });
    return next({ statusCode: 400, message: "JWT_SECRET is not available!" });
  }
  try {
    /* //todo: Không sử dụng service
     const token = jwt.sign({ id: dataUser.id }, process.env.JWT_SECRET); //* Create token with the id of user mix to JWT_SECRET (vì vậy từ token này, chúng ta có thể giải mã để lấy được id của user)
     const { password: pass, ...infoEXistingUser } = dataUser; //* Cần xoá mật khẩu của user trước khi gửi thông tin user đó về browser
    */
    const res = await LoginService.loginUser(existingUser);
    return response
      .cookie("access_token", res.token, {
        //* Save this token at the cookie
        httpOnly: true,
        // expires: new Date(new Date().getTime() + 5 * 60 * 1000), //* 5 minute
      })
      .status(200)
      .json(res.dataUser); //* gửi thông tin trừ password của user về browser
  } catch (error: any) {
    // return Response.status(500).json(error.message);
    return next(error);
  }
};

export const loginGoogle = async (
  request: Request,
  response: Response,
  next: any
) => {
  const validError = validationResult(request.body);
  if (!validError.isEmpty()) {
    next(validError.array());
  }
  try {
    const res = await LoginService.googleUser(request.body);
    return response
      .cookie("access_token", res.token, {
        httpOnly: true,
        // expires: new Date(new Date().getTime() + 5 * 60 * 1000), //* 5 minute
      })
      .status(200)
      .json(res.userInfo);
  } catch (error) {
    next(error);
  }
};
