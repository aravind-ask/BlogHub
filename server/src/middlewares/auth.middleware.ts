import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { env } from "../config/env.config";
import { ResponseHandler } from "../utils/response.handler";

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;

  // Try to get token from Authorization header first, then from cookies
  let token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    // Try to get from cookies
    token = req.cookies?.accessToken;
  }

  console.log("Auth Middleware Debug:", {
    authorizationHeader: req.headers.authorization,
    cookieToken: req.cookies?.accessToken ? "present" : "missing",
    finalToken: token ? "present" : "missing",
    url: req.url,
    method: req.method,
  });

  if (!token) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(
        ResponseHandler.error(
          ErrorMessage.UNAUTHORIZED,
          "No token provided",
          HttpStatus.UNAUTHORIZED
        )
      );
  }

  try {
    console.log("Auth Middleware: Attempting to verify token");
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET || "fallback-secret"
    ) as JwtPayload;
    console.log("Auth Middleware: Token verified successfully", {
      userId: decoded.id,
      role: decoded.role,
    });
    authReq.user = decoded;
    next();
  } catch (error) {
    console.log("Auth Middleware: Token verification failed", error);
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(
        ResponseHandler.error(
          ErrorMessage.UNAUTHORIZED,
          error instanceof Error ? error.message : "Invalid token",
          HttpStatus.UNAUTHORIZED
        )
      );
  }
};
