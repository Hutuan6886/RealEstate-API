import express from "express";
import * as ListingController from "./listing.controller";
import { verifiUser } from "../utils/verifyUser";
import { reNewToken } from "../utils/reNewToken";

export const listingRouter = express.Router();

//todo: Private route listing API
listingRouter.post(
  "/create",
  reNewToken,
  verifiUser,
  ListingController.createListing
); //* Check existing access_token mới được tạo listing

listingRouter.delete(
  "/delete-listing-item/:listingId",
  reNewToken,
  verifiUser,
  ListingController.deleteListingUser
);

listingRouter.get(
  "/get-listing-item/:listingId",
  reNewToken,
  verifiUser,
  ListingController.getListingItem
);

listingRouter.put(
  "/update-listing-item/:listingId",
  reNewToken,
  verifiUser,
  ListingController.updateListingItem
);

listingRouter.put(
  "/delete-image/:listingId",
  reNewToken,
  verifiUser,
  ListingController.deleteListingImage
);

//todo: Public route listing API
listingRouter.get(
  "/get-listing-content/:listingId",
  ListingController.getListingContent
);

listingRouter.get(
  "/get-listing-landlord/:listingId",
  ListingController.getInfoLandlordByListingId
);

listingRouter.get("/search", ListingController.getSearchListing);

listingRouter.get("/get-all-listing", ListingController.getAllListing);

listingRouter.get("/get-newly-listing", ListingController.getNewlyListing);

listingRouter.get("/get-hcm-listing", ListingController.getHcmListing);

listingRouter.get("/get-all-listing-name", ListingController.getAllListingName);
