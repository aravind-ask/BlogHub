import { Model, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import UserModel from "../models/user.model";
import { IUser } from "../interfaces/user.interface";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async saveBlog(
    userId: string,
    blogId: Types.ObjectId
  ): Promise<IUser | null> {
    return this.model
      .findByIdAndUpdate(
        userId,
        { $addToSet: { savedBlogs: blogId } },
        { new: true }
      )
      .exec();
  }

  async unsaveBlog(
    userId: string,
    blogId: Types.ObjectId
  ): Promise<IUser | null> {
    return this.model
      .findByIdAndUpdate(
        userId,
        { $pull: { savedBlogs: blogId } },
        { new: true }
      )
      .exec();
  }
}
