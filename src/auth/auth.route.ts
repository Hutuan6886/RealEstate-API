import express from "express";
import { body } from "express-validator";
import * as AuthController from "./auth.controller";

export const authRouter = express.Router();

authRouter.post(
  "/login",
  body("email").isString(),
  body("password").isString(),
  AuthController.loginUser
);

authRouter.post(
  "/google",
  body("userName").isString(),
  body("email").isString(),
  body("imgUrl").isString(),
  body("emailVerified").isString(),
  AuthController.loginGoogle
);

authRouter.post(
  "/register",
  body("userName").isString(),
  body("email").isString(),
  body("password").isString(),
  body("rePassword").isString(),
  AuthController.registerUser
);

authRouter.post("/logout", AuthController.logoutUser);
