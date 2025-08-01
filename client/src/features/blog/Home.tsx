import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setBlogs, setLoading, setError, resetBlogs } from "./blogSlice";
import { blogService } from "../../services/blogService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useAppDispatch();
  const { blogs, hasMore, page, isLoading, error } = useAppSelector(
    (state) => state.blog
  );

  const fetchBlogs = async () => {
    dispatch(setLoading(true));
    try {
      const response = await blogService.getBlogs(page, 10);
      if (response.success && response.data) {
        dispatch(setBlogs(response.data as any[]));
      } else {
        dispatch(setError(response.error || "Failed to fetch blogs"));
      }
    } catch (err) {
      dispatch(setError("An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(resetBlogs());
    fetchBlogs();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="w-full h-40 mb-4" />
        <Skeleton className="w-full h-40 mb-4" />
        <Skeleton className="w-full h-40 mb-4" />
      </div>
    );
  }

  if(blogs.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">No Blogs Available</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      {error && <p className="text-red-500">{error}</p>}
      <InfiniteScroll
        dataLength={blogs.length}
        next={fetchBlogs}
        hasMore={hasMore}
        loader={<Skeleton className="w-full h-40 mb-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog._id}>
              <CardHeader>
                <CardTitle>
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{blog.content.slice(0, 100)}...</p>
                <p className="text-sm text-gray-500 mt-2">
                  By {blog.author.name} on{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Home;
