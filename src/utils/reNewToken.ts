import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const reNewToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const access_token = request.cookies.access_token;
  const refresh_token = request.cookies.refresh_token;

  process.env.JWT_SECRET &&
    jwt.verify(
      refresh_token,
      process.env.JWT_SECRET,
      (error: any, user: any) => {
        if (error) {
          return next({
            statusCode: 400,
            message: "The refresh_token is not exist!",
          });
        }
        if (!access_token) {
          const new_access_token =
            process.env.JWT_SECRET &&
            jwt.sign({ id: user.id }, process.env.JWT_SECRET);

          request.cookies.access_token = new_access_token; //* Gán new_access_token cho request.cookie để check nại nextFunction là verifyUser
        }
        next();
      }
    );
};
