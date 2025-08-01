import { Request, Response, NextFunction } from "express";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { IResponse } from "../interfaces/response.interface";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ErrorMessage.SERVER_ERROR,
    error: error.message,
  });
};
