import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server";

export const createListing = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const validError = validationResult(request.body);
  if (!validError.isEmpty()) {
    return next(validError.array());
  }

  //todo: Check xem token chứa request.body.user.id của verifiUser có tồn tại hay không (tồn tại đồng nghĩa với việc user đang được log in)
  if (!request.body.user.id) {
    return next({
      statusCode: 400,
      message: "The access_token is not existing!",
    });
  }

  //todo: Check userId from req and userId from jwt
  if (request.body.user.id !== request.body.userId) {
    return next({ stausCode: 401, message: "User is not available!" });
  }

  try {
    const listingCreated = await db.listing.create({
      data: {
        name: request.body.name,
        description: request.body.description,
        address: request.body.address,
        imgUrl: request.body.imgUrl,
        bedrooms: parseInt(request.body.bedrooms),
        bathrooms: parseInt(request.body.bathrooms),
        squaremetre: parseFloat(request.body.squaremetre),
        furnished: request.body.furnished,
        parking: request.body.parking,
        offer: request.body.offer,
        formType: request.body.formType,
        houseType: request.body.houseType,
        regularPrice: parseFloat(request.body.regularPrice),
        discountPrice: parseFloat(request.body.discountPrice),
        userId: request.body.userId,
      },
    });
    return response.status(200).json(listingCreated);
  } catch (error) {
    return next(error);
  }
};

export const getListingUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //todo: Check access_token and params userId
  if (!request.params.userId) {
    return next({
      statusCode: 400,
      message: "The params is not a vailable!",
    });
  }
  if (!request.body.user.id) {
    return next({
      statusCode: 400,
      message: "The access_token is not existing!",
    });
  }
  if (request.params.userId !== request.body.user.id) {
    return next({ statusCode: 400, message: "The access_token is invalid!" });
  }
  try {
    const listingList = await db.listing.findMany({
      where: {
        userId: request.body.user.id,
      },
    });
    return response.status(200).json(listingList);
  } catch (error) {
    return next(error);
  }
};

export const deleteListingUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.params.listingId) {
    return next({
      statusCode: 400,
      message: "The params is not a vailable!",
    });
  }
  if (!request.body.user.id) {
    return next({
      statusCode: 400,
      message: "The access_token is not existing!",
    });
  }
  try {
    const listingDeleted = await db.listing.delete({
      where: {
        id: request.params.listingId,
        userId: request.body.user.id,
      },
    });
    return response.status(200).json(listingDeleted);
  } catch (error) {
    return next(error);
  }
};

export const getListingItem = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.params.listingId) {
    return next({ statusCode: 400, message: "The params is unavailable!" });
  }
  if (!request.body.user.id) {
    return next({
      statusCode: 400,
      message: "The access_token is not existing!",
    });
  }
  try {
    const listingItem = await db.listing.findFirst({
      where: {
        id: request.params.listingId,
        userId: request.body.id,
      },
    });
    return response.status(200).json(listingItem);
  } catch (error) {
    return next(error);
  }
};

export const updateListingItem = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const validError = validationResult(request.body);
  if (!validError.isEmpty()) {
    return next(validError.array());
  }
  if (!request.params.listingId) {
    return next({ statusCode: 400, message: "The params is unavailable!" });
  }
  if (request.params.listingId !== request.body.id) {
    return next({ statusCode: 401, message: "The listing is invalid!" });
  }
  if (!request.body.user.id) {
    return next({
      statusCode: 400,
      message: "The access_token is not existing!",
    });
  }
  const existingListing = await db.listing.findFirst({
    where: {
      id: request.params.listingId,
      userId: request.body.user.id,
    },
  });
  if (!existingListing) {
    return next({ statusCode: 401, message: "Listing item is not existing!" });
  }
  try {
    const listingUpdated = await db.listing.update({
      where: {
        id: existingListing.id,
        userId: existingListing?.userId,
      },
      data: {
        name: request.body.name,
        address: request.body.address,
        description: request.body.description,
        imgUrl: request.body.imgUrl,
        bedrooms: request.body.bedrooms,
        bathrooms: request.body.bathrooms,
        formType: request.body.formType,
        houseType: request.body.houseType,
        furnished: request.body.furnished,
        parking: request.body.parking,
        offer: request.body.offer,
        squaremetre: request.body.squaremetre,
        regularPrice: request.body.regularPrice,
        discountPrice: request.body.discountPrice,
      },
    });
    return response.status(200).json(listingUpdated);
  } catch (error) {
    return next(error);
  }
};

export const deleteListingImage = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const validError = validationResult(request.body);
  if (!validError.isEmpty()) {
    return next(validError.array());
  }
  if (!request.body.user.id) {
    return next({
      statusCode: 400,
      message: "The access_token is not existing!",
    });
  }
  const existingListing = await db.listing.findFirst({
    where: {
      id: request.params.listingId,
      userId: request.body.user.id,
    },
  });
  if (!existingListing) {
    return next({ statusCode: 401, message: "Listing item is not existing!" });
  }
  const imgUrl = existingListing.imgUrl.filter(
    (img) => img !== request.body.imgUrl
  );
  try {
    const listingItem = await db.listing.update({
      where: {
        id: existingListing.id,
        userId: existingListing?.userId,
      },
      data: {
        imgUrl: [...imgUrl],
      },
    });
    return response.status(200).json(listingItem);
  } catch (error) {
    return next(error);
  }
};
