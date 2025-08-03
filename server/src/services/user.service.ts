import { UserRepository } from "../repositories/user.repository";
import { BlogRepository } from "../repositories/blog.repository";
import { IResponse } from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import { IBlog } from "../interfaces/blog.interface";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { ResponseHandler } from "../utils/response.handler";
import { SavedBlogService } from "./savedBlog.service";

export class UserService {
  private userRepository: UserRepository;
  private blogRepository: BlogRepository;

  constructor(
    userRepository: UserRepository = new UserRepository(),
    blogRepository: BlogRepository = new BlogRepository()
  ) {
    this.userRepository = userRepository;
    this.blogRepository = blogRepository;
  }

  async getProfile(id: string): Promise<IResponse<IUser>> {
    try {
      const user = await this.userRepository.getProfile(id);
      if (!user) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "User not found",
          HttpStatus.NOT_FOUND
        );
      }
      return ResponseHandler.success(
        user,
        "User fetched successfully",
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

  async getUserBlogs(id: string): Promise<IResponse<IBlog[]>> {
    try {
      const blogs = await this.blogRepository.getUserBlogs(id);
      return ResponseHandler.success(
        blogs,
        "Blogs fetched successfully",
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

  async getSavedBlogs(
    id: string,
    page: number,
    limit: number
  ): Promise<IResponse<IBlog[]>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "User not found",
          HttpStatus.NOT_FOUND
        );
      }
      const savedBlogService = new SavedBlogService();
      return await savedBlogService.getSavedBlogs(id, page, limit);
    } catch (error) {
      return ResponseHandler.error(
        ErrorMessage.SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
