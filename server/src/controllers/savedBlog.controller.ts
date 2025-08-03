import { Request, Response } from "express";
import { SavedBlogService } from "../services/savedBlog.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { HttpStatus } from "../constants/enums";
import { ResponseHandler } from "../utils/response.handler";

export class SavedBlogController {
  private savedBlogService: SavedBlogService;

  constructor(savedBlogService: SavedBlogService = new SavedBlogService()) {
    this.savedBlogService = savedBlogService;
  }

  async saveBlog(
    req: AuthRequest & { params: { blogId: string } },
    res: Response
  ): Promise<void> {
    const { blogId } = req.params;
    const response = await this.savedBlogService.saveBlog(req.user!.id, blogId);
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async unsaveBlog(
    req: AuthRequest & { params: { blogId: string } },
    res: Response
  ): Promise<void> {
    const { blogId } = req.params;
    const response = await this.savedBlogService.unsaveBlog(
      req.user!.id,
      blogId
    );
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async getSavedBlogs(
    req: AuthRequest & { params: { id: string } },
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const response = await this.savedBlogService.getSavedBlogs(id, page, limit);
    res.locals.response = response;
    res.status(response.status).json(response);
  }
}
