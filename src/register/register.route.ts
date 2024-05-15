import express from "express";
import * as RegisterController from "./register.controller";
import { body } from "express-validator";

const registerRouter = express.Router();

registerRouter.post(
  "/",
  body("email").isString(),
  body("password").isString(),
  RegisterController.registerUser
);
