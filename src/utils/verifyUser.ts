import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

//todo: Middleware

export const verifiUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const existingToken = request.cookies.access_token; //* access_token là token name đã tạo
  if (!process.env.JWT_SECRET) {
    return next({ status: 401, message: "JWT_SECRET is required!" });
  }
  console.log("access_token", existingToken);

  jwt.verify(existingToken, process.env.JWT_SECRET, (error: any, user: any) => {
    if (error) {

      return next({ status: 403, message: "Forbidden!" });
    }
    request.body.user = user; //* req.body sẽ được passing on userController
    //! request.body.user là giá trị user tạo thành jwt token (trong dự án này sử dụng userId và JWT_SECRET nên request.body.user={id:'....',...})
    //! request.body là các giá trị user gửi request từ client
    next(); //* Next để tiếp tục qua function tiếp theo là useRouter, bởi vì route: app.use("/api/user", verifiUser, userRouter);
  });
};
