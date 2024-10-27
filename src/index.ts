import express, { NextFunction, Response, Request } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRouter } from "./auth/auth.route";
import { userRouter } from "./users/users.route";
import { listingRouter } from "./listing/listing.route";
import { tokenRouter } from "./token/token.router";
import { saveRouter } from "./save/save.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1); //* Check PORT
}

const PORT = process.env.PORT;

//todo:CONFIG APP
const app = express();

//todo: CONFIG LIBS
app.use(
  cors({
    origin: process.env.CLIENT_ROUTE,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders:['Content-Type','Authorization']
  })
);
app.use(express.json());
app.use(cookieParser());

//todo: READY
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

//todo: ROUTES API
app.use("/api/auth", authRouter); //todo: User's auth
app.use("/api/user", userRouter); //todo: User's info
app.use("/api/listing", listingRouter); //todo: User's listing
app.use("/api/token", tokenRouter); //todo: User's token
app.use("/api/save", saveRouter); //todo: User's save

//todo: MIDDLEWARE
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //* Sử dụng để handle error, hiển thị một vài thông tin error trước khi return error về browser
  //* middleware error-handler: in order to block route if the request API is error (Nếu có error trong quá trình call api, thì tại controller sẽ return server error hoặc các custom error -> vì vậy tại controller có thể import giá trị next vào, sử dụng next là middleware tại đó để return server error hoặc bất kì error nào)
  //* this middleware is goin to be call every time with every the api method
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
