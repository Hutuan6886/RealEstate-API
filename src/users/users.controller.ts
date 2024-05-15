import { Request, Response } from "express";

export const getUsers = async (request: Request, Response: Response) => {
  try {
  } catch (error: any) {
    return Response.status(500).json(error.message);
  }
};

export const getUserId = async (request: Request, Response: Response) => {
  try {
  } catch (error: any) {
    return Response.status(500).json(error.message);
  }
};
