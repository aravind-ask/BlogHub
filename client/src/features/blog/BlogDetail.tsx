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
import sanitizeHtml from "sanitize-html";
import InfiniteScroll from "react-infinite-scroll-component";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentBlog, isLoading, error } = useAppSelector(
    (state) => state.blog
  );
  const { user } = useAppSelector((state) => state.auth);
  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const getErrorMessage = (error: string | null, status?: number) => {
    if (!error) return "An error occurred";
    switch (status) {
      case 400:
        return "Invalid input. Please check your details.";
      case 401:
        return "Please log in to perform this action.";
      case 403:
        return "You are not authorized to perform this action.";
      case 429:
        return "Too many requests. Please try again later.";
      default:
        return error;
    }
  };

  const fetchBlog = async () => {
    if (!id) return;
    dispatch(setLoading(true));
    try {
      const response = await blogService.getBlogById(id);
      if (response.success && response.data) {
        dispatch(setCurrentBlog(response.data as any));
      } else {
        dispatch(setError(getErrorMessage(response.error, response.status)));
      }
    } catch (err: any) {
      dispatch(setError(getErrorMessage(err.error || err.message, err.status)));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchComments = async () => {
    if (!id || !hasMoreComments) return;
    try {
      const response = await blogService.getComments(id, commentPage, 10);
      if (response.success && response.data) {
        setComments((prev) => [...prev, ...(response.data as any)]);
        setHasMoreComments(response.hasMore ?? false);
        setCommentPage((prev) => prev + 1);
      } else {
        dispatch(setError(getErrorMessage(response.error, response.status)));
      }
    } catch (err: any) {
      dispatch(setError(getErrorMessage(err.error || err.message, err.status)));
    }
  };

  const fetchLikes = async () => {
    if (!id) return;
    try {
      const response = await blogService.getLikes(id);
      if (response.success && response.data) {
        setLikes(response.data as any);
      } else {
        dispatch(setError(getErrorMessage(response.error, response.status)));
      }
    } catch (err: any) {
      dispatch(setError(getErrorMessage(err.error || err.message, err.status)));
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchComments();
    fetchLikes();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await blogService.likeBlog(id!);
      if (response.success) {
        await fetchLikes(); // Refresh likes
      } else {
        dispatch(setError(getErrorMessage(response.error, response.status)));
      }
    } catch (err: any) {
      dispatch(setError(getErrorMessage(err.error || err.message, err.status)));
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await blogService.commentBlog(id!, { content: comment });
      if (response.success) {
        setComments((prev) => [...(response.data as any), ...prev]);
        setComment("");
      } else {
        dispatch(setError(getErrorMessage(response.error, response.status)));
      }
    } catch (err: any) {
      dispatch(setError(getErrorMessage(err.error || err.message, err.status)));
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
        dispatch(setError(getErrorMessage(response.error, response.status)));
      }
    } catch (err: any) {
      dispatch(setError(getErrorMessage(err.error || err.message, err.status)));
    }
  };

  if (isLoading) return <Skeleton className="w-full h-96" />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!currentBlog) return null;

  const sanitizedContent = sanitizeHtml(currentBlog.content, {
    allowedTags: ["b", "i", "em", "strong", "p", "div", "ul", "ol", "li"],
    allowedAttributes: {},
  });

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{currentBlog.title}</CardTitle>
          <p className="text-sm text-gray-500">
            By{" "}
            {typeof currentBlog.author === "string"
              ? "Unknown Author"
              : currentBlog.author.name}{" "}
            on {new Date(currentBlog.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart className="w-4 h-4 mr-2" />
              {likes.length} Likes
            </Button>
            {user?._id ===
              (typeof currentBlog.author === "string"
                ? currentBlog.author
                : currentBlog.author._id) && (
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
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              <InfiniteScroll
                dataLength={comments.length}
                next={fetchComments}
                hasMore={hasMoreComments}
                loader={<Skeleton className="w-full h-20 mb-4" />}
                scrollThreshold={0.8}
              >
                {comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          typeof comment.user === "string"
                            ? ""
                            : comment.user.avatar
                        }
                      />
                      <AvatarFallback>
                        {typeof comment.user === "string"
                          ? "U"
                          : comment.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {typeof comment.user === "string"
                          ? "Unknown User"
                          : comment.user.name}
                      </p>
                      <p className="text-gray-700">{comment.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetail;
