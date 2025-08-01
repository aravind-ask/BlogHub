import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { BlogService } from "../services/blog.service";
import { HttpStatus } from "../constants/enums";
import { Types } from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";

interface CreateBlogRequestBody {
  title: string;
  content: string;
}

interface UpdateBlogRequestBody {
  title: string;
  content: string;
}

interface CommentBlogRequestBody {
  content: string;
}

export class BlogController {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  async createBlog(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const { title, content } = req.body as CreateBlogRequestBody;
    const response = await this.blogService.createBlog(
      title,
      content,
      new Types.ObjectId(req.user!.id)
    );
    res
      .status(response.success ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
      .json(response);
  }

  async getBlogs(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const response = await this.blogService.getBlogs(page, limit);
    res
      .status(
        response.success ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json(response);
  }

  async getBlog(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.blogService.getBlog(id);
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND)
      .json(response);
  }

  async updateBlog(
    req: AuthRequest & { params: { id: string }; body: UpdateBlogRequestBody },
    res: Response
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const { id } = req.params;
    const { title, content } = req.body;
    const response = await this.blogService.updateBlog(
      id,
      title,
      content,
      new Types.ObjectId(req.user!.id)
    );
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .json(response);
  }

  async deleteBlog(
    req: AuthRequest & { params: { id: string } },
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const response = await this.blogService.deleteBlog(
      id,
      new Types.ObjectId(req.user!.id)
    );
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .json(response);
  }

  async likeBlog(
    req: AuthRequest & { params: { id: string } },
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const response = await this.blogService.likeBlog(
      id,
      new Types.ObjectId(req.user!.id)
    );
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .json(response);
  }

  async commentBlog(
    req: AuthRequest & { params: { id: string }; body: CommentBlogRequestBody },
    res: Response
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const { id } = req.params;
    const { content } = req.body;
    const response = await this.blogService.commentBlog(
      id,
      new Types.ObjectId(req.user!.id),
      content
    );
    res
      .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .json(response);
  }
}
