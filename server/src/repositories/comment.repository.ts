import { Model, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import CommentModel from "../models/comment.model";
import { IComment } from "../interfaces/comment.interface";

export class CommentRepository extends BaseRepository<IComment> {
  constructor(model: Model<IComment> = CommentModel) {
    super(model);
  }

  async findByBlogPaginated(
    blogId: string,
    page: number,
    limit: number
  ): Promise<IComment[]> {
    return this.model
      .find({ blog: blogId })
      .populate("user", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteByBlog(blogId: string): Promise<void> {
    await this.model.deleteMany({ blog: blogId }).exec();
  }

  public async countByBlog(blogId: string): Promise<number> {
    return this.model.countDocuments({ blog: blogId });
  }
}
