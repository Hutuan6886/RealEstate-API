import express from "express";
import * as UserController from "./users.controller";
import { verifiUser } from "../utils/verifyUser";

export const userRouter = express.Router();

userRouter.get("/", UserController.getUsers);
userRouter.post("/update/:id", verifiUser, UserController.UpdateUserInfo);
userRouter.post(
  "/update-oauth/:id",
  verifiUser,
  UserController.UpdateOauthUserInfo
);
userRouter.delete("/delete/:id", verifiUser, UserController.DeleteUser);
