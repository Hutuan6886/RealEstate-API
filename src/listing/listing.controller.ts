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
