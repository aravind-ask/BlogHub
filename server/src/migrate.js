import BlogModel from "./models/blog.model";
import CommentModel from "./models/comment.model";
import LikeModel from "./models/like.model";

async function migrateBlogs() {
  const blogs = await BlogModel.find().exec();
  for (const blog of blogs) {
    // Migrate comments
    for (const comment of blog.comments) {
      await CommentModel.create({
        content: comment.content,
        user: comment.user,
        blog: blog._id,
        createdAt: comment.createdAt,
      });
    }
    // Migrate likes
    for (const userId of blog.likes) {
      await LikeModel.create({
        user: userId,
        blog: blog._id,
      });
    }
    // Clear embedded fields
    await BlogModel.updateOne(
      { _id: blog._id },
      { $unset: { comments: "", likes: "" } }
    );
  }
  console.log("Migration completed");
}

migrateBlogs().then(() =>
  console.log("Migration script executed successfully")
);
