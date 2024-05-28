import express, { NextFunction, Response, Request } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { registerRouter } from "./register/register.route";
import { loginRouter } from "./login/login.route";
import { userRouter } from "./users/users.route";
import cookieParser from "cookie-parser";
import { verifiUser } from "./utils/verifyUser";

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
app.use("/api/auth", registerRouter);
app.use("/api/auth", loginRouter);
app.use("/api/user", verifiUser, userRouter);

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
