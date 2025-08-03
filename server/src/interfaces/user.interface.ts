import { Types, Document } from "mongoose";
import { Role } from "../constants/enums";

export interface IUser extends Document {
  _id?: Types.ObjectId;
  email: string;
  password?: string;
  name: string;
  role: Role;
  refreshTokens: string[];
}
