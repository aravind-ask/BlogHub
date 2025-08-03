import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import BlogModel from "../models/blog.model";
import { IBlog } from "../interfaces/blog.interface";

export class BlogRepository extends BaseRepository<IBlog> {
  constructor(model: Model<IBlog> = BlogModel) {
    super(model);
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

  async getUserBlogs(id: string): Promise<IBlog[]> {
    return this.model
      .find({ author: id })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .exec();
  }

  public async countBlogs(): Promise<number> {
    return this.model.countDocuments().exec();
  }

  async findById(id: string): Promise<IBlog | null> {
    return this.model.findById(id).populate("author", "name").exec();
  }
}
