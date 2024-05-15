import { Request, Response } from "express";

export const loginController = async (request: Request, Response: Response) => {
  try {
  } catch (error: any) {
    return Response.status(500).json(error.message);
  }
};
