import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const getNewAccessToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { refresh_token } = request.cookies;
    if (!refresh_token) {
      return next({
        statusCode: 401,
        message: "The refresh_token is not existing!",
      });
    }

    if (!process.env.JWT_SECRET) {
      return next({
        statusCode: 401,
        message: "The JWT_SECRET is not existing!",
      });
    }

    jwt.verify(
      refresh_token,
      process.env.JWT_SECRET,
      (error: any, user: any) => {
        if (error) {
          return next({
            statusCode: 403,
            message: "Verify refresh_token is not successfully",
          });
        }

        const access_token =
          process.env.JWT_SECRET &&
          jwt.sign({ id: user.id }, process.env.JWT_SECRET); //* new access_token

        return response.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          expires: new Date(new Date().getTime() + 5 * 60 * 1000),
        });
      }
    );
    return response
      .status(200)
      .json({ message: "New access_token is created successfully" });
  } catch (error) {
    return next(error);
  }
};
