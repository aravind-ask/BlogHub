import { Types } from "mongoose";
import { CommentRepository } from "../repositories/comment.repository";
import { BlogRepository } from "../repositories/blog.repository";
import { IComment } from "../interfaces/comment.interface";
import { ResponseHandler } from "../utils/response.handler";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { IResponse } from "../interfaces/response.interface";

export class CommentService {
  private commentRepository: CommentRepository;
  private blogRepository: BlogRepository;

  constructor(
    commentRepository: CommentRepository = new CommentRepository(),
    blogRepository: BlogRepository = new BlogRepository()
  ) {
    this.commentRepository = commentRepository;
    this.blogRepository = blogRepository;
  }

  async createComment(
    blogId: string,
    userId: Types.ObjectId,
    content: string
  ): Promise<IResponse<IComment>> {
    try {
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }

      const comment = await this.commentRepository.create({
        content,
        user: userId,
        blog: new Types.ObjectId(blogId),
      });

      return ResponseHandler.success(
        comment,
        "Comment added successfully",
        HttpStatus.CREATED
      );
    } catch (error) {
      return ResponseHandler.error(
        ErrorMessage.SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getComments(
    blogId: string,
    page: number,
    limit: number
  ): Promise<IResponse<IComment[]>> {
    try {
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }

      const comments = await this.commentRepository.findByBlogPaginated(
        blogId,
        page,
        limit
      );
      const totalComments = await this.commentRepository.countByBlog(blogId);
      const hasMore = page * limit < totalComments;

      return ResponseHandler.success(
        comments,
        "Comments fetched successfully",
        HttpStatus.OK,
        hasMore
      );
    } catch (error) {
      return ResponseHandler.error(
        ErrorMessage.SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteCommentsByBlog(blogId: string): Promise<IResponse<null>> {
    try {
      await this.commentRepository.deleteByBlog(blogId);
      return ResponseHandler.success(
        null,
        "Comments deleted successfully",
        HttpStatus.OK
      );
    } catch (error) {
      return ResponseHandler.error(
        ErrorMessage.SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
