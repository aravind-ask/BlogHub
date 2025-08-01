import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import BlogModel  from "../models/blog.model";
import { Types } from "mongoose";
import { IBlog } from "../interfaces/blog.interface";

export class BlogRepository extends BaseRepository<IBlog> {
  constructor() {
    super(BlogModel);
  }

  async findAllPaginated(page: number, limit: number): Promise<IBlog[]> {
    return this.model
      .find()
      .populate("author", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async addLike(blogId: string, userId: Types.ObjectId): Promise<IBlog | null> {
    return this.model
      .findByIdAndUpdate(
        blogId,
        { $addToSet: { likes: userId } },
        { new: true }
      )
      .exec();
  }

  async addComment(
    blogId: string,
    userId: Types.ObjectId,
    content: string
  ): Promise<IBlog | null> {
    return this.model
      .findByIdAndUpdate(
        blogId,
        {
          $push: {
            comments: { user: userId, content, createdAt: new Date() },
          },
        },
        { new: true }
      )
      .exec();
  }
}
