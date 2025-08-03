import { Model, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import UserModel from "../models/user.model";
import { IUser } from "../interfaces/user.interface";

export class UserRepository extends BaseRepository<IUser> {
  constructor(model: Model<IUser> = UserModel) {
    super(model);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async getProfile(id: string): Promise<IUser | null> {
    return this.model.findById(id).exec();
  }

  async addRefreshToken(userId: string, token: string): Promise<IUser | null> {
    return this.model
      .findByIdAndUpdate(
        userId,
        { $addToSet: { refreshTokens: token } },
        { new: true }
      )
      .exec();
  }

  async removeRefreshToken(
    userId: string,
    token: string
  ): Promise<IUser | null> {
    return this.model
      .findByIdAndUpdate(
        userId,
        { $pull: { refreshTokens: token } },
        { new: true }
      )
      .exec();
  }

  async findByRefreshToken(token: string): Promise<IUser | null> {
    return this.model.findOne({ refreshTokens: token }).exec();
  }
}
