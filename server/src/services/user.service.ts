import { UserRepository } from "../repositories/user.repository";
import { BlogRepository } from "../repositories/blog.repository";
import { IResponse } from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import { IBlog } from "../interfaces/blog.interface";
import { Types } from "mongoose";
import { HttpStatus, ErrorMessage } from "../constants/enums";

export class UserService {
  private userRepository: UserRepository;
  private blogRepository: BlogRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.blogRepository = new BlogRepository();
  }

  async getProfile(id: string): Promise<IResponse<IUser>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "User not found",
        };
      }
      return {
        success: true,
        message: "User fetched successfully",
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async getUserBlogs(id: string): Promise<IResponse<IBlog[]>> {
    try {
      const blogs = await this.blogRepository
        .findAll()
        .where("author")
        .equals(id)
        .populate("author", "name email")
        .exec();
      return {
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
      };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async getSavedBlogs(id: string): Promise<IResponse<IBlog[]>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "User not found",
        };
      }
      const blogs = await this.blogRepository
        .findAll()
        .where("_id")
        .in(user.savedBlogs)
        .populate("author", "name email")
        .exec();
      return {
        success: true,
        message: "Saved blogs fetched successfully",
        data: blogs,
      };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async saveBlog(userId: string, blogId: string): Promise<IResponse<IUser>> {
    try {
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "Blog not found",
        };
      }
      const user = await this.userRepository.saveBlog(
        userId,
        new Types.ObjectId(blogId)
      );
      if (!user) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "User not found",
        };
      }
      return { success: true, message: "Blog saved successfully", data: user };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async unsaveBlog(userId: string, blogId: string): Promise<IResponse<IUser>> {
    try {
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "Blog not found",
        };
      }
      const user = await this.userRepository.unsaveBlog(
        userId,
        new Types.ObjectId(blogId)
      );
      if (!user) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "User not found",
        };
      }
      return {
        success: true,
        message: "Blog unsaved successfully",
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }
}
