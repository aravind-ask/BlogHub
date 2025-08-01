import mongoose from "mongoose";
import { env } from "./env.config";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
