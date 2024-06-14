import express from "express";
import * as ListingController from "./listing.controller";
import { verifiUser } from "../utils/verifyUser";

export const listingRouter = express.Router();

listingRouter.post("/create", verifiUser, ListingController.createListing); //* Check existing access_token mới được tạo listing
