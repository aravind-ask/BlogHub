import { Types } from "mongoose";
import { LikeRepository } from "../repositories/like.repository";
import { BlogRepository } from "../repositories/blog.repository";
import { ILike } from "../interfaces/like.interface";
import { ResponseHandler } from "../utils/response.handler";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { IResponse } from "../interfaces/response.interface";

export class LikeService {
  private likeRepository: LikeRepository;
  private blogRepository: BlogRepository;

  constructor(
    likeRepository: LikeRepository = new LikeRepository(),
    blogRepository: BlogRepository = new BlogRepository()
  ) {
    this.likeRepository = likeRepository;
    this.blogRepository = blogRepository;
  }

  async toggleLike(
    blogId: string,
    userId: Types.ObjectId
  ): Promise<IResponse<ILike | null>> {
    try {
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }

      const existingLike = await this.likeRepository.findByUserAndBlog(
        userId.toString(),
        blogId
      );
      if (existingLike) {
        await this.likeRepository.delete(existingLike._id.toString());
        return ResponseHandler.success(
          null,
          "Like removed successfully",
          HttpStatus.OK
        );
      }

      const like = await this.likeRepository.create({
        user: userId,
        blog: new Types.ObjectId(blogId),
      });

      return ResponseHandler.success(
        like,
        "Blog liked successfully",
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

  async getLikes(blogId: string): Promise<IResponse<ILike[]>> {
    try {
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }

      const likes = await this.likeRepository.findByBlog(blogId);
      return ResponseHandler.success(
        likes,
        "Likes fetched successfully",
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

  async deleteLikesByBlog(blogId: string): Promise<IResponse<null>> {
    try {
      await this.likeRepository.deleteByBlog(blogId);
      return ResponseHandler.success(
        null,
        "Likes deleted successfully",
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
