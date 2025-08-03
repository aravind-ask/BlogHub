import { Types } from "mongoose";
import { BlogRepository } from "../repositories/blog.repository";
import { CommentRepository } from "../repositories/comment.repository";
import { LikeRepository } from "../repositories/like.repository";
import { SavedBlogRepository } from "../repositories/savedBlogs.repository";
import { IBlog } from "../interfaces/blog.interface";
import { ResponseHandler } from "../utils/response.handler";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { IResponse } from "../interfaces/response.interface";

export class BlogService {
  private blogRepository: BlogRepository;
  private commentRepository: CommentRepository;
  private likeRepository: LikeRepository;
  private savedBlogRepository: SavedBlogRepository;

  constructor(
    blogRepository: BlogRepository = new BlogRepository(),
    commentRepository: CommentRepository = new CommentRepository(),
    likeRepository: LikeRepository = new LikeRepository(),
    savedBlogRepository: SavedBlogRepository = new SavedBlogRepository()
  ) {
    this.blogRepository = blogRepository;
    this.commentRepository = commentRepository;
    this.likeRepository = likeRepository;
    this.savedBlogRepository = savedBlogRepository;
  }

  async createBlog(
    title: string,
    content: string,
    author: Types.ObjectId
  ): Promise<IResponse<IBlog>> {
    try {
      const blog = await this.blogRepository.create({ title, content, author });
      return ResponseHandler.success(
        blog,
        "Blog created successfully",
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

  async getBlogs(page: number, limit: number): Promise<IResponse<IBlog[]>> {
    try {
      console.log("Blog Service: getBlogs called", { page, limit });
      const blogs = await this.blogRepository.findAllPaginated(page, limit);
      const totalBlogs = await this.blogRepository.countBlogs();
      const hasMore = blogs.length > 0 && page * limit < totalBlogs;
      
      console.log("Blog Service: getBlogs result", { 
        blogsLength: blogs.length, 
        totalBlogs, 
        hasMore,
        page,
        limit 
      });

      return ResponseHandler.success(
        blogs,
        "Blogs fetched successfully",
        HttpStatus.OK,
        hasMore
      );
    } catch (error) {
      console.log("Blog Service: getBlogs error", error);
      return ResponseHandler.error(
        ErrorMessage.SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBlog(id: string): Promise<IResponse<IBlog>> {
    try {
      const blog = await this.blogRepository.findById(id);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }
      return ResponseHandler.success(
        blog,
        "Blog fetched successfully",
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

  async updateBlog(
    id: string,
    title: string,
    content: string,
    userId: Types.ObjectId
  ): Promise<IResponse<IBlog>> {
    try {
      const blog = await this.blogRepository.findById(id);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }
      if (blog.author.toString() !== userId.toString()) {
        return ResponseHandler.error(
          ErrorMessage.FORBIDDEN,
          "Not authorized to update this blog",
          HttpStatus.FORBIDDEN
        );
      }
      const updatedBlog = await this.blogRepository.update(id, {
        title,
        content,
      });
      return ResponseHandler.success(
        updatedBlog!,
        "Blog updated successfully",
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

  async deleteBlog(
    id: string,
    userId: Types.ObjectId
  ): Promise<IResponse<null>> {
    try {
      const blog = await this.blogRepository.findById(id);
      if (!blog) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "Blog not found",
          HttpStatus.NOT_FOUND
        );
      }
      if (blog.author.toString() !== userId.toString()) {
        return ResponseHandler.error(
          ErrorMessage.FORBIDDEN,
          "Not authorized to delete this blog",
          HttpStatus.FORBIDDEN
        );
      }
      await this.blogRepository.delete(id);
      await this.commentRepository.deleteByBlog(id);
      await this.likeRepository.deleteByBlog(id);
      await this.savedBlogRepository.deleteByBlog(id);
      return ResponseHandler.success(
        null,
        "Blog deleted successfully",
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
