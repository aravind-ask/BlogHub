import { Schema, model, Types } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { Role } from "../constants/enums";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: Role, default: Role.USER },
    savedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
