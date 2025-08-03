import { Schema, model } from "mongoose";
import { ISavedBlog } from "../interfaces/savedBlog.interface";


const savedBlogSchema = new Schema<ISavedBlog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

savedBlogSchema.index({ user: 1, blog: 1 }, { unique: true });

export default model<ISavedBlog>("SavedBlog", savedBlogSchema);
