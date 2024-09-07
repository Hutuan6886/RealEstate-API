import express from "express";
import * as SaveController from "./save.controller";

export const saveRouter = express.Router();

saveRouter.put("/homes/:userId", SaveController.savedHomes);
