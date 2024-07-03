import express from "express";
import * as TokenController from "./token.controller";
export const tokenRouter = express.Router();

tokenRouter.get("/new-access-token", TokenController.getNewAccessToken);
