import { Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { HttpStatus } from "../constants/enums";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.userService.getProfile(id);
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async getUserBlogs(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.userService.getUserBlogs(id);
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async getSavedBlogs(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const response = await this.userService.getSavedBlogs(id, page, limit);
    res.locals.response = response;
    res.status(response.status).json(response);
  }
}
