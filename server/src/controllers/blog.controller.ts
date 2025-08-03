import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { BlogService } from "../services/blog.service";
import { HttpStatus } from "../constants/enums";
import { Types } from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ResponseHandler } from "../utils/response.handler";

interface CreateBlogRequestBody {
  title: string;
  content: string;
}

interface UpdateBlogRequestBody {
  title: string;
  content: string;
}

export class BlogController {
  private blogService: BlogService;

  constructor(blogService: BlogService = new BlogService()) {
    this.blogService = blogService;
  }

  async createBlog(req: AuthRequest, res: Response): Promise<void> {
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

    const { title, content } = req.body as CreateBlogRequestBody;
    const response = await this.blogService.createBlog(
      title,
      content,
      new Types.ObjectId(req.user!.id)
    );
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async getBlogs(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    console.log("Blog Controller: getBlogs called", { page, limit });
    const response = await this.blogService.getBlogs(page, limit);
    console.log("Blog Controller: getBlogs response", { 
      success: response.success, 
      dataLength: response.data?.length || 0,
      hasMore: response.hasMore,
      status: response.status 
    });
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async getBlog(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.blogService.getBlog(id);
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async updateBlog(
    req: AuthRequest & { params: { id: string }; body: UpdateBlogRequestBody },
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

    const { id } = req.params;
    const { title, content } = req.body;
    const response = await this.blogService.updateBlog(
      id,
      title,
      content,
      new Types.ObjectId(req.user!.id)
    );
    res.locals.response = response;
    res.status(response.status).json(response);
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
    res.locals.response = response;
    res.status(response.status).json(response);
  }
}
