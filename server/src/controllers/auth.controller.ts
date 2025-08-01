import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthService } from "../services/auth.service";
import { HttpStatus } from "../constants/enums";

// Define interfaces for request bodies
interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const { email, password, name } = req.body;
    const response = await this.authService.register(email, password, name);
    res
      .status(response.success ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
      .json(response);
  }

  async login(
    req: Request<{}, {}, LoginRequestBody>,
    res: Response
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const { email, password } = req.body;
    const response = await this.authService.login(email, password);
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
      .json(response);
  }
}
