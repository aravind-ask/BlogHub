import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CommentService } from "../services/comment.service";
import { HttpStatus } from "../constants/enums";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ResponseHandler } from "../utils/response.handler";
import { Types } from "mongoose";

interface CommentRequestBody {
  content: string;
}

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService = new CommentService()) {
    this.commentService = commentService;
  }

  async createComment(
    req: AuthRequest & { params: { id: string }; body: CommentRequestBody },
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
    const { content } = req.body;
    const response = await this.commentService.createComment(
      id,
      new Types.ObjectId(req.user!.id),
      content
    );
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async getComments(
    req: Request & { params: { id: string } },
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const response = await this.commentService.getComments(id, page, limit);
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async deleteComment(
    req: AuthRequest & { params: { blogId: string; commentId: string } },
    res: Response
  ): Promise<void> {
    const { blogId, commentId } = req.params;
    console.log("Comment Controller: deleteComment called", { blogId, commentId });
    const userId = req.user!.id;
    const response = await this.commentService.deleteComment(
      blogId,
      commentId,
      userId
    );
    res.locals.response = response;
    res.status(response.status).json(response);
  }
}
