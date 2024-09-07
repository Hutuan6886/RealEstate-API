import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server";
import { FormType } from "@prisma/client";

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
        location: {
          create: {
            latitude: request.body.location.latitude,
            longitude: request.body.location.longitude,
          },
        },
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

export const getListingContent = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.params.listingId) {
    return next({ statusCode: 400, message: "Forbidden!" });
  }
  try {
    const dataListing = await db.listing.findFirst({
      where: {
        id: request.params.listingId,
      },
    });
    return response.status(200).json(dataListing);
  } catch (error) {
    return next(error);
  }
};

export const getInfoLandlordByListingId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.params.listingId) {
    return next({ statusCode: 400, message: "Forbidden!" });
  }
  const existingListing = await db.listing.findFirst({
    where: {
      id: request.params.listingId,
    },
  });
  if (!existingListing) {
    return next({ statusCode: 401, message: "The listing is not exist!" });
  }
  try {
    const dataLandlord = await db.user.findFirst({
      where: {
        id: existingListing.userId,
      },
    });
    if (!dataLandlord) {
      return next({ statusCode: 401, message: "The Landlord is not exist!" });
    }
    return response.status(200).json({
      name: dataLandlord.userName,
      email: dataLandlord.email,
      phone: dataLandlord.phone,
    });
  } catch (error) {
    return next();
  }
};

export const getSearchListing = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const searchTerm: string | undefined = request.query.searchTerm?.toString();
    let isFurnished: boolean | undefined = undefined;
    let isParking: boolean | undefined = undefined;
    let isOffer: boolean | undefined = undefined;
    let beds: number | undefined = undefined;
    let baths: number | undefined = undefined;
    let formType: FormType = "Sell";

    //todo: Convert giá trị price thành rawValue (price gửi từ client là 100,000 -> PC sẽ chỉ hiểu giá trị là 100 -> xoá dấu comma)
    let priceMin: string | undefined = request.query.priceMin
      ?.toString()
      .split(",")
      .join("");
    let priceMax: string | undefined = request.query.priceMax
      ?.toString()
      .split(",")
      .join("");

    let houseTypeList: string[] | undefined = request.query.houseType
      ?.toString()
      .split(",");

    let squarefeetMin: number | undefined = parseFloat(
      request.query.squarefeetMin as string
    );
    let squarefeetMax: number | undefined = parseFloat(
      request.query.squarefeetMax as string
    );

    if (request.query.keywords) {
      const keywords = (request.query.keywords as string).split(",");
      if (keywords.includes("furnished")) {
        isFurnished = true;
      }
      if (keywords.includes("parking")) {
        isParking = true;
      }
      if (keywords.includes("offer")) {
        isOffer = true;
      }
    }
    if (request.query.beds && request.query.beds !== "0") {
      beds = parseInt(request.query.beds as string);
    }
    if (request.query.baths && request.query.baths !== "0") {
      baths = parseInt(request.query.baths as string);
    }
    if (!priceMin || priceMin === "0") {
      priceMin = undefined;
    }
    if (!priceMax || priceMax === "0") {
      priceMax = undefined;
    }
    if (request.query.formType === "Rent") {
      formType = "Rent";
    }
    if (houseTypeList?.length === 1) {
      houseTypeList = undefined;
    }
    if (!squarefeetMin) {
      squarefeetMin = undefined;
    }
    if (!squarefeetMax) {
      squarefeetMax = undefined;
    }

    if (!searchTerm) {
      const listingSearched = await db.listing.findMany({
        where: {
          formType,
          bedrooms: beds,
          bathrooms: baths,
          furnished: isFurnished,
          parking: isParking,
          offer: isOffer,
          regularPrice: {
            gte: priceMin,
            lte: priceMax,
          },
          squaremetre: {
            gte: squarefeetMin,
            lte: squarefeetMax,
          },
          houseType: {
            in: houseTypeList,
          },
        },
        include: {
          location: true,
        },
        orderBy: {
          createAt: "desc",
        },
      });
      return response.status(200).json(listingSearched);
    }

    const listingSearched = await db.listing.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
            },
          },
          {
            address: {
              contains: searchTerm,
            },
          },
        ],
        formType,
        bedrooms: beds,
        bathrooms: baths,
        furnished: isFurnished,
        parking: isParking,
        offer: isOffer,
        regularPrice: {
          gte: priceMin,
          lte: priceMax,
        },
        squaremetre: {
          gte: squarefeetMin,
          lte: squarefeetMax,
        },
        houseType: {
          in: houseTypeList,
        },
      },
      include: {
        location: true,
      },
      orderBy: {
        createAt: "desc",
      },
    });

    return response.status(200).json(listingSearched);
  } catch (error) {
    return next(error);
  }
};

export const getAllListing = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const allListing = await db.listing.findMany({
      include: {
        location: true,
        User: true,
      },
    });
    return response.status(200).json(allListing);
  } catch (error) {
    return next(error);
  }
};

export const getAllListingName = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const allListingName = await db.listing.findMany({
      select: {
        name: true,
      },
    });
    let listingNameData: string[] = allListingName.map((listing) => {
      //* Biến đổi giá trị dầu ra thành string[]
      return listing.name;
    });

    listingNameData = listingNameData.filter(
      //* Lọc các giá trị giống nhau trong mảng
      (item, i) => listingNameData.indexOf(item) === i
    );
    return response.status(200).json(listingNameData);
  } catch (error) {
    return next(error);
  }
};
