import { Types, Document } from "mongoose";

export interface ISavedBlog extends Document {
  user: Types.ObjectId;
  blog: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
