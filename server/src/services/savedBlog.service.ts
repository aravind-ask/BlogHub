import { Types } from "mongoose";
import { SavedBlogRepository } from "../repositories/savedBlogs.repository";
import { BlogRepository } from "../repositories/blog.repository";
import { UserRepository } from "../repositories/user.repository";
import { ISavedBlog } from "../interfaces/savedBlog.interface";
import { IBlog } from "../interfaces/blog.interface";
import { ResponseHandler } from "../utils/response.handler";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { IResponse } from "../interfaces/response.interface";

export class SavedBlogService {
  private savedBlogRepository: SavedBlogRepository;
  private blogRepository: BlogRepository;
  private userRepository: UserRepository;

  constructor(
    savedBlogRepository: SavedBlogRepository = new SavedBlogRepository(),
    blogRepository: BlogRepository = new BlogRepository(),
    userRepository: UserRepository = new UserRepository()
  ) {
    this.savedBlogRepository = savedBlogRepository;
    this.blogRepository = blogRepository;
    this.userRepository = userRepository;
  }

  async saveBlog(
    userId: string,
    blogId: string
  ): Promise<IResponse<ISavedBlog>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "User not found",
          HttpStatus.NOT_FOUND
        );
      }
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }
      const existingSave = await this.savedBlogRepository.findByUserAndBlog(
        userId,
        blogId
      );
      if (existingSave) {
        // Blog is already saved, return success instead of error
        return ResponseHandler.success(
          existingSave,
          "Blog already saved",
          HttpStatus.OK
        );
      }
      const savedBlog = await this.savedBlogRepository.create({
        user: new Types.ObjectId(userId),
        blog: new Types.ObjectId(blogId),
      });
      return ResponseHandler.success(
        savedBlog,
        "Blog saved successfully",
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

  async unsaveBlog(userId: string, blogId: string): Promise<IResponse<null>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "User not found",
          HttpStatus.NOT_FOUND
        );
      }
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }
      const existingSave = await this.savedBlogRepository.findByUserAndBlog(
        userId,
        blogId
      );
      if (!existingSave) {
        // Blog is not saved, return success instead of error
        return ResponseHandler.success(null, "Blog not saved", HttpStatus.OK);
      }
      await this.savedBlogRepository.delete(existingSave._id.toString());
      return ResponseHandler.success(
        null,
        "Blog unsaved successfully",
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
    userId: string,
    page: number,
    limit: number
  ): Promise<IResponse<IBlog[]>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "User not found",
          HttpStatus.NOT_FOUND
        );
      }
      const savedBlogs = await this.savedBlogRepository.findByUserPaginated(
        userId,
        page,
        limit
      );
      const blogs = savedBlogs
        .filter(
          (savedBlog) =>
            savedBlog.blog &&
            typeof savedBlog.blog === "object" &&
            savedBlog.blog !== null
        )
        .map((savedBlog) => savedBlog.blog as unknown as IBlog);
      const totalSavedBlogs = await this.savedBlogRepository.countByBlog(
        userId
      );
      const hasMore = page * limit < totalSavedBlogs;
      return ResponseHandler.success(
        blogs,
        "Saved blogs fetched successfully",
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

  async deleteSavedBlogsByBlog(blogId: string): Promise<IResponse<null>> {
    try {
      await this.savedBlogRepository.deleteByBlog(blogId);
      return ResponseHandler.success(
        null,
        "Saved blogs deleted successfully",
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
