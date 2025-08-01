import { Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { HttpStatus } from "../constants/enums";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.userService.getProfile(id);
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND)
      .json(response);
  }

  async getUserBlogs(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.userService.getUserBlogs(id);
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND)
      .json(response);
  }

  async getSavedBlogs(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.userService.getSavedBlogs(id);
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND)
      .json(response);
  }

  async saveBlog(req: AuthRequest, res: Response): Promise<void> {
    const { blogId } = req.params;
    const response = await this.userService.saveBlog(req.user!.id, blogId);
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .json(response);
  }

  async unsaveBlog(req: AuthRequest, res: Response): Promise<void> {
    const { blogId } = req.params;
    const response = await this.userService.unsaveBlog(req.user!.id, blogId);
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .json(response);
  }
}
