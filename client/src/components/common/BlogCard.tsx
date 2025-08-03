import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setError } from "../../features/user/userSlice";
import { userService } from "../../services/userService";
import sanitizeHtml from "sanitize-html";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Bookmark } from "lucide-react";
import { Blog } from "../../types/blog";

interface BlogCardProps {
  blog: Blog;
  isSaved?: boolean;
  onToggleSave?: (blogId: string, blogData?: Blog) => void;
}

const BlogCard = ({ blog, isSaved = false, onToggleSave }: BlogCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const sanitizedContent = sanitizeHtml(blog.content, {
    allowedTags: ["b", "i", "em", "strong", "p", "div"],
    allowedAttributes: {},
  });

  // Check if the current user is the author of this blog
  const isOwnBlog =
    user &&
    blog.author &&
    (typeof blog.author === "string"
      ? blog.author === user._id
      : blog.author._id === user._id);

  const handleToggleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Prevent users from saving their own blogs
    if (isOwnBlog) {
      toast.error("You cannot save your own blog!");
      return;
    }

    try {
      const response = isSaved
        ? await userService.unsaveBlog(blog._id)
        : await userService.saveBlog(blog._id);

      if (response.success) {
        // Pass blog data when saving, just blogId when unsaving
        onToggleSave?.(blog._id, isSaved ? undefined : blog);
        toast.success(
          isSaved ? "Blog removed from saved!" : "Blog saved successfully!"
        );
      } else {
        const errorMessage = getErrorMessage(response.error, response.status);
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(
        err.error || err.message,
        err.status
      );
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    }
  };

  const getErrorMessage = (error: string | null, status?: number) => {
    if (!error) return "An error occurred";
    switch (status) {
      case 400:
        return "Invalid request. Please try again.";
      case 401:
        return "Please log in to perform this action.";
      case 403:
        return "You are not authorized to perform this action.";
      case 404:
        return "Blog or user not found.";
      case 429:
        return "Too many requests. Please try again later.";
      default:
        return error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link to={`/blog/${blog._id}`} className="hover:underline">
            {blog.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{
            __html: sanitizedContent.slice(0, 100) + "...",
          }}
        />
        <p className="text-sm text-gray-500 mt-2">
          By{" "}
          {typeof blog.author === "string"
            ? "Unknown Author"
            : blog.author?.name || "Unknown Author"}{" "}
          on {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        {user && !isOwnBlog && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleToggleSave}
          >
            <Bookmark
              className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`}
            />
            {isSaved ? "Unsave" : "Save"}
          </Button>
        )}
        {user && isOwnBlog && (
          <div className="mt-2 text-sm text-gray-500 italic">Your own blog</div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogCard;
