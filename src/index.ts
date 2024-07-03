import express, { NextFunction, Response, Request } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { authRouter } from "./auth/auth.route";
import { userRouter } from "./users/users.route";
import cookieParser from "cookie-parser";
import { listingRouter } from "./listing/listing.route";
import { tokenRouter } from "./token/token.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1); //* Check PORT
}

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

//todo: ROUTES API
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/token", tokenRouter);

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
