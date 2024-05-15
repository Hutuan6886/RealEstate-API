import express from "express";
import * as UserController from "./users.controller";

const userRouter = express.Router();

userRouter.get("/", UserController.getUsers);

userRouter.get("/:id", UserController.getUserId);