import { Schema, model, Types } from "mongoose";
import { ILike } from "../interfaces/like.interface";

const likeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

likeSchema.index({ blog: 1, user: 1 }, { unique: true });
export default model<ILike>("Like", likeSchema);
