import { Model, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import SavedBlogModel from "../models/savedBlog.model";
import { ISavedBlog } from "../interfaces/savedBlog.interface";

export class SavedBlogRepository extends BaseRepository<ISavedBlog> {
  constructor(model: Model<ISavedBlog> = SavedBlogModel) {
    super(model);
  }

  async findByUserAndBlog(
    userId: string,
    blogId: string
  ): Promise<ISavedBlog | null> {
    return this.model.findOne({ user: userId, blog: blogId }).exec();
  }

  async findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<ISavedBlog[]> {
    return this.model
      .find({ user: userId })
      .populate({
        path: "blog",
        populate: { path: "author", select: "name" },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteByBlog(blogId: string): Promise<void> {
    await this.model.deleteMany({ blog: blogId }).exec();
  }

  public async countByBlog(userId: string): Promise<number> {
    return this.model.countDocuments(userId ? { user: userId } : {});
  }
}
