import express from "express";
import * as LoginController from "./login.controller";
import { body } from "express-validator";

export const loginRouter = express.Router();

loginRouter.post(
  "/login",
  body("email").isString(),
  body("password").isString(),
  LoginController.loginUser
);

loginRouter.post(
  "/google",
  body("userName").isString(),
  body("email").isString(),
  body("imgUrl").isString(),
  LoginController.loginGoogle
);
