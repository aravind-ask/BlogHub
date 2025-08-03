import { Schema, model, Types } from "mongoose";
import { IBlog } from "../interfaces/blog.interface";

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IBlog>("Blog", blogSchema);
