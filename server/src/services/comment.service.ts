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

      let comment = await this.commentRepository.create({
        content,
        user: userId,
        blog: new Types.ObjectId(blogId),
      });

      // Populate user field with name and avatar
      comment = await comment.populate("user", "name avatar");

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

  async deleteComment(
    blogId: string,
    commentId: string,
    userId: string
  ): Promise<IResponse<null>> {
    try {
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        return ResponseHandler.error(
          "Comment not found",
          "Comment not found",
          HttpStatus.NOT_FOUND
        );
      }
      if (comment.blog.toString() !== blogId) {
        return ResponseHandler.error(
          "Invalid blog ID",
          "Comment does not belong to this blog",
          HttpStatus.BAD_REQUEST
        );
      }
      if (comment.user.toString() !== userId) {
        return ResponseHandler.error(
          "Unauthorized",
          "You are not authorized to delete this comment",
          HttpStatus.UNAUTHORIZED
        );
      }
      await this.commentRepository.deleteById(commentId);
      return ResponseHandler.success(
        null,
        "Comment deleted successfully",
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
