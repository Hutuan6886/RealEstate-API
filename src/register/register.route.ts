import express from "express";
import * as RegisterController from "./register.controller";
import { body } from "express-validator";

export const registerRouter = express.Router();

registerRouter.post(
  "/",
  body("userName").isString(),
  body("email").isString(),
  body("password").isString(),
  body("rePassword").isString(),
  RegisterController.registerUser
);
