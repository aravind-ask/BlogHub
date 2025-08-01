import { Types, Document } from "mongoose";

export interface IBlog extends Document {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  likes: Types.ObjectId[];
  comments: {
    user: Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
}
