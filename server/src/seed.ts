import mongoose from "mongoose";
import BlogModel from "./models/blog.model";
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/bloghub"
    );
    console.log("Connected to MongoDB");

    // Check if there are any blogs
    const blogCount = await BlogModel.countDocuments();
    console.log(`Found ${blogCount} existing blogs`);

    if (blogCount === 0) {
      console.log("No blogs found, creating test blogs...");

      // Create a test user if none exists
      let testUser = await UserModel.findOne({ email: "test@example.com" });
      if (!testUser) {
        const hashedPassword = await bcrypt.hash("password123", 10);
        testUser = await UserModel.create({
          name: "Test User",
          email: "test@example.com",
          password: hashedPassword,
          role: "USER",
        });
        console.log("Created test user:", testUser._id);
      }

      // Create test blogs
      const testBlogs = [
        {
          title: "Welcome to BlogHub",
          content:
            "This is the first blog post on BlogHub. Welcome to our platform where you can share your thoughts and ideas with the world!",
          author: testUser._id,
          createdAt: new Date(),
        },
        {
          title: "Getting Started with Blogging",
          content:
            "Blogging is a great way to share your knowledge and connect with others. In this post, we'll explore some tips for getting started with blogging.",
          author: testUser._id,
          createdAt: new Date(),
        },
        {
          title: "The Power of Writing",
          content:
            "Writing has the power to change minds, inspire action, and create connections. Whether you're writing for yourself or others, the act of putting thoughts into words is transformative.",
          author: testUser._id,
          createdAt: new Date(),
        },
      ];

      const createdBlogs = await BlogModel.insertMany(testBlogs);
      console.log(`Created ${createdBlogs.length} test blogs`);

      for (const blog of createdBlogs) {
        console.log(`- ${blog.title} (ID: ${blog._id})`);
      }
    } else {
      console.log("Blogs already exist, skipping seed");
    }

    console.log("Seed script completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedDatabase();
