import express from "express";
import * as UserController from "./users.controller";
import { verifiUser } from "../utils/verifyUser";
import { reNewToken } from "../utils/reNewToken";

export const userRouter = express.Router();

userRouter.get("/", UserController.getUsers);
userRouter.post(
  "/update/:id",
  reNewToken,
  verifiUser,
  UserController.UpdateUserInfo
);
userRouter.post(
  "/update-oauth/:id",
  reNewToken,
  verifiUser,
  UserController.UpdateOauthUserInfo
);
userRouter.delete(
  "/delete/:id",
  reNewToken,
  verifiUser,
  UserController.DeleteUser
);
