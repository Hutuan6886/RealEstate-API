import { NextFunction, Request, Response } from "express";
import { db } from "../utils/db.server";

export const savedHomes = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const existingUser = await db.user.findFirst({
    where: {
      id: request.params.userId,
    },
  });
  if (!existingUser) {
    return next({ statusCode: 401, message: "The user is available!" });
  }
  if (!request.body.id) {
    return next({ statusCode: 401, message: "The body is required!" });
  }
  try {
    if (existingUser.savedHomes.includes(request.body.id)) {
      await db.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          savedHomes: existingUser.savedHomes.filter(
            (item) => item !== request.body.id
          ),
        },
      });
    } else {
      await db.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          savedHomes: [...existingUser.savedHomes, request.body.id],
        },
      });
    }
    return response.status(200).json(request.body.id);
  } catch (error) {
    return next(error);
  }
};
