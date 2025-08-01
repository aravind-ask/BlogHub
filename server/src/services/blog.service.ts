import { Types } from "mongoose";
import { BlogRepository } from "../repositories/blog.repository";
import { IBlog } from "../interfaces/blog.interface";
import { IResponse } from "../interfaces/response.interface";
import { HttpStatus, ErrorMessage } from "../constants/enums";

export class BlogService {
  private blogRepository: BlogRepository;

  constructor() {
    this.blogRepository = new BlogRepository();
  }

  async createBlog(
    title: string,
    content: string,
    author: Types.ObjectId
  ): Promise<IResponse<IBlog>> {
    try {
      const blog = await this.blogRepository.create({ title, content, author });
      return {
        success: true,
        message: "Blog created successfully",
        data: blog,
      };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async getBlogs(page: number, limit: number): Promise<IResponse<IBlog[]>> {
    try {
      const blogs = await this.blogRepository.findAllPaginated(page, limit);
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

  async getBlog(id: string): Promise<IResponse<IBlog>> {
    try {
      const blog = await this.blogRepository.findById(id);
      if (!blog) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "Blog not found",
        };
      }
      return {
        success: true,
        message: "Blog fetched successfully",
        data: blog,
      };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async updateBlog(
    id: string,
    title: string,
    content: string,
    userId: Types.ObjectId
  ): Promise<IResponse<IBlog>> {
    try {
      const blog = await this.blogRepository.findById(id);
      if (!blog) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "Blog not found",
        };
      }
      if (blog.author.toString() !== userId.toString()) {
        return {
          success: false,
          message: ErrorMessage.FORBIDDEN,
          error: "Not authorized to update this blog",
        };
      }
      const updatedBlog = await this.blogRepository.update(id, {
        title,
        content,
      });
      return {
        success: true,
        message: "Blog updated successfully",
        data: updatedBlog!,
      };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async deleteBlog(
    id: string,
    userId: Types.ObjectId
  ): Promise<IResponse<null>> {
    try {
      const blog = await this.blogRepository.findById(id);
      if (!blog) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "Blog not found",
        };
      }
      if (blog.author.toString() !== userId.toString()) {
        return {
          success: false,
          message: ErrorMessage.FORBIDDEN,
          error: "Not authorized to delete this blog",
        };
      }
      await this.blogRepository.delete(id);
      return { success: true, message: "Blog deleted successfully" };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async likeBlog(
    id: string,
    userId: Types.ObjectId
  ): Promise<IResponse<IBlog>> {
    try {
      const blog = await this.blogRepository.addLike(id, userId);
      if (!blog) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "Blog not found",
        };
      }
      return { success: true, message: "Blog liked successfully", data: blog };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async commentBlog(
    id: string,
    userId: Types.ObjectId,
    content: string
  ): Promise<IResponse<IBlog>> {
    try {
      const blog = await this.blogRepository.addComment(id, userId, content);
      if (!blog) {
        return {
          success: false,
          message: ErrorMessage.NOT_FOUND,
          error: "Blog not found",
        };
      }
      return {
        success: true,
        message: "Comment added successfully",
        data: blog,
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
