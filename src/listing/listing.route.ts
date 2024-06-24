import express from "express";
import * as ListingController from "./listing.controller";
import { verifiUser } from "../utils/verifyUser";

export const listingRouter = express.Router();

listingRouter.post("/create", verifiUser, ListingController.createListing); //* Check existing access_token mới được tạo listing

listingRouter.get(
  "/get-listing-list/:userId",
  verifiUser,
  ListingController.getListingUser
);
listingRouter.delete(
  "/delete-listing-item/:listingId",
  verifiUser,
  ListingController.deleteListingUser
);
listingRouter.get(
  "/get-listing-item/:listingId",
  verifiUser,
  ListingController.getListingItem
);
listingRouter.put(
  "/update-listing-item/:listingId",
  verifiUser,
  ListingController.updateListingItem
);
listingRouter.put(
  "/delete-image/:listingId",
  verifiUser,
  ListingController.deleteListingImage
);
