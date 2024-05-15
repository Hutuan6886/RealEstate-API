import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createUser } from "./register.service";

export const registerUser = async (request: Request, Response: Response) => {
  const validError = validationResult(request);
  if (validError.isEmpty()) {
    return Response.status(400).json(validError.array());
  }
  try {
    const userCreated = await createUser(request.body);
    return Response.status(200).json(userCreated);
  } catch (error: any) {
    return Response.status(500).json(error.message);
  }
};
