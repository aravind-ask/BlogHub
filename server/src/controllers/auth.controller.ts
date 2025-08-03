import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthService, AuthTokens } from "../services/auth.service";
import { HttpStatus } from "../constants/enums";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ResponseHandler } from "../utils/response.handler";
import { env } from "../config/env.config";

interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface RefreshTokenRequestBody {
  refreshToken: string;
}

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  async register(
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ResponseHandler.error(
            errors.array()[0].msg,
            "Validation failed",
            HttpStatus.BAD_REQUEST
          )
        );
      return;
    }

    const { email, password, name } = req.body;
    const response = await this.authService.register(email, password, name);
    res.status(response.status).json(response);
  }

  async login(
    req: Request<{}, {}, LoginRequestBody>,
    res: Response
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ResponseHandler.error(
            errors.array()[0].msg,
            "Validation failed",
            HttpStatus.BAD_REQUEST
          )
        );
      return;
    }

    const { email, password } = req.body;
    const response = await this.authService.login(email, password);
    if (response.success && response.data) {
      res.cookie("accessToken", response.data.accessToken, {
        httpOnly: false,
        secure: false, 
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, 
        path: "/",
      });
      res.cookie("refreshToken", response.data.refreshToken, {
        httpOnly: false,
        secure: false, 
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      response.data = {
        ...response.data,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    }
    res.status(response.status).json(response);
  }

  async refreshToken(
    req: Request<{}, {}, RefreshTokenRequestBody>,
    res: Response
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ResponseHandler.error(
            errors.array()[0].msg,
            "Validation failed",
            HttpStatus.BAD_REQUEST
          )
        );
      return;
    }

    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          ResponseHandler.error(
            "Refresh token missing",
            "Unauthorized",
            HttpStatus.UNAUTHORIZED
          )
        );
      return;
    }

    const response = await this.authService.refreshToken(refreshToken);
    if (response.success && response.data) {
      res.cookie("accessToken", response.data.accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, 
        path: "/",
      });

      response.data = {
        ...response.data,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    }
    res.status(response.status).json(response);
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          ResponseHandler.error(
            errors.array()[0].msg,
            "Validation failed",
            HttpStatus.BAD_REQUEST
          )
        );
      return;
    }

    const userId = req.user!.id;
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    const response = await this.authService.logout(userId, refreshToken);
    if (response.success) {
      res.clearCookie("accessToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/" });
    }
    res.status(response.status).json(response);
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const response = await this.authService.getCurrentUser(userId);
    res.status(response.status).json(response);
  }
}
