import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createUser } from "./register.service";
import { db } from "../utils/db.server";

export const registerUser = async (
  request: Request,
  Response: Response,
  next: any
) => {
  const validError = validationResult(request);
  if (!validError.isEmpty()) {
    return Response.status(400).json(validError.array());
  }
  const { email, password, rePassword } = request.body;
  //todo: Check existingUser
  const existingUser = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    // return Response.status(400).json({ error: "This email is existing!" });
    next({
      statusCode: 401,
      message: "This email is existing!",
    });
  }
  //todo: Check password === rePassword
  if (rePassword !== password) {
    // return Response.status(400).json({
    //   error: "This password and re-password are not match!",
    // });
    next({
      statusCode: 401,
      message: "This password and re-password are not match!",
    });
  }
  try {
    const userCreated = await createUser(request.body);
    return Response.status(200).json(userCreated);
  } catch (error: any) {
    // return Response.status(500).json(error.message);
    next(error);
  }
};
