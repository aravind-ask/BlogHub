import { Model, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import LikeModel from "../models/like.model";
import { ILike } from "../interfaces/like.interface";

export class LikeRepository extends BaseRepository<ILike> {
  constructor(model: Model<ILike> = LikeModel) {
    super(model);
  }

  async findByBlog(blogId: string): Promise<ILike[]> {
    return this.model.find({ blog: blogId }).populate("user", "name").exec();
  }

  async findByUserAndBlog(
    userId: string,
    blogId: string
  ): Promise<ILike | null> {
    return this.model.findOne({ user: userId, blog: blogId }).exec();
  }

  async deleteByBlog(blogId: string): Promise<void> {
    await this.model.deleteMany({ blog: blogId }).exec();
  }
}
