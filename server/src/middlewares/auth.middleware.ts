import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { env } from "../config/env.config";

// Define the user payload type
interface JwtPayload {
  id: string;
  role: string;
}

// Extend Express Request interface
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;
  const token = authReq.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: ErrorMessage.UNAUTHORIZED,
      error: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    authReq.user = decoded;
    next();
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: ErrorMessage.UNAUTHORIZED,
      error: error instanceof Error ? error.message : "Invalid token",
    });
  }
};
