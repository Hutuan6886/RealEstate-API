import express from "express";
import * as ListingController from "./listing.controller";
import { verifiUser } from "../utils/verifyUser";
import { reNewToken } from "../utils/reNewToken";

export const listingRouter = express.Router();

//todo: Private route listing
listingRouter.post(
  "/create",
  reNewToken,
  verifiUser,
  ListingController.createListing
); //* Check existing access_token mới được tạo listing
listingRouter.get(
  "/get-listing-list/:userId",
  reNewToken,
  verifiUser,
  ListingController.getListingUser
);
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

//todo: Public route listing
listingRouter.get(
  "/get-listing-content/:listingId",
  ListingController.getListingContent
);
listingRouter.get(
  "/get-listing-landlord/:listingId",
  ListingController.getInfoLandlordByListingId
);
