import { Schema, model, Types } from "mongoose";
import { IComment } from "../interfaces/comment.interface";

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

commentSchema.index({ blog: 1, createdAt: -1 });
export default model<IComment>("Comment", commentSchema);
