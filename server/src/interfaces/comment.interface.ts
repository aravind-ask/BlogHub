import { Types, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  user: Types.ObjectId;
  blog: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
