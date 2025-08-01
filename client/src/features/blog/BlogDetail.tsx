import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentBlog, updateBlog, setLoading, setError } from "./blogSlice";
import { blogService } from "../../services/blogService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";
import { Heart, Trash2 } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentBlog, isLoading, error } = useAppSelector(
    (state) => state.blog
  );
  const { user } = useAppSelector((state) => state.auth);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      dispatch(setLoading(true));
      try {
        const response = await blogService.getBlogById(id);
        if (response.success && response.data) {
          dispatch(setCurrentBlog(response.data as any));
        } else {
          dispatch(setError(response.error || "Failed to fetch blog"));
        }
      } catch (err) {
        dispatch(setError("An error occurred"));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchBlog();
  }, [id, dispatch]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await blogService.likeBlog(id!);
      if (response.success && response.data) {
        dispatch(updateBlog(response.data as any));
      }
    } catch (err) {
      dispatch(setError("Failed to like blog"));
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await blogService.commentBlog(id!, comment);
      if (response.success && response.data) {
        dispatch(updateBlog(response.data as any));
        setComment("");
      }
    } catch (err) {
      dispatch(setError("Failed to add comment"));
    }
  };

  const handleDelete = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await blogService.deleteBlog(id!);
      if (response.success) {
        navigate("/");
      } else {
        dispatch(setError(response.error || "Failed to delete blog"));
      }
    } catch (err) {
      dispatch(setError("An error occurred"));
    }
  };

  if (isLoading) return <Skeleton className="w-full h-96" />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!currentBlog) return null;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{currentBlog.title}</CardTitle>
          <p className="text-sm text-gray-500">
            By {currentBlog.author.name} on{" "}
            {new Date(currentBlog.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{currentBlog.content}</p>
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart className="w-4 h-4 mr-2" />
              {currentBlog.likes.length} Likes
            </Button>
            {user?._id === currentBlog.author._id && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/edit-blog/${currentBlog._id}`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
          <form onSubmit={handleComment} className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !comment}>
              Post Comment
            </Button>
          </form>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {currentBlog.comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              currentBlog.comments.map((comment) => (
                <div key={comment.createdAt} className="flex space-x-4 mb-4">
                  <Avatar>
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{comment.user.name}</p>
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetail;
