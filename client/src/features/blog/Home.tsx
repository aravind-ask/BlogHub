import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  setBlogs,
  setLoading,
  setError,
  resetBlogs,
  setHasMore,
} from "./blogSlice";
import { setSavedBlogs, resetSavedBlogs } from "../user/userSlice";
import { blogService } from "../../services/blogService";
import { userService } from "../../services/userService";
import BlogCard from "../../components/common/BlogCard";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { Blog } from "../../types/blog";

const Home = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { blogs, hasMore, page, isLoading, error } = useAppSelector(
    (state) => state.blog
  );
  const { user, savedBlogs } = useAppSelector((state) => state.user);
  const { isLoading: authLoading, error: authError } = useAppSelector(
    (state) => state.auth
  );
  const isMounted = useRef(false); // Track initial mount

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
        return "Blogs not found.";
      case 429:
        return "Too many requests. Please try again later.";
      default:
        return error;
    }
  };

  const fetchBlogs = useCallback(async () => {
    if (isLoading || !hasMore || authLoading) return;
    console.log("fetchBlogs called", {
      page,
      hasMore,
      isLoading,
      authLoading,
      blogsLength: blogs.length,
    });
    dispatch(setLoading(true));
    try {
      const response = await blogService.getBlogs(page, 10);
      if (response.success) {
        dispatch(setBlogs(response.data as Blog[]));
        dispatch(setHasMore(response.hasMore ?? false));
      } else {
        const errorMessage = getErrorMessage(response.error, response.status);
        dispatch(setError(errorMessage));
        dispatch(setHasMore(false));
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(
        err.error || err.message,
        err.status
      );
      dispatch(setError(errorMessage));
      dispatch(setHasMore(false));
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, page, isLoading, hasMore, authLoading]);

  const fetchSavedBlogs = useCallback(async () => {
    if (!user || authLoading) {
      dispatch(resetSavedBlogs());
      return;
    }
    console.log("fetchSavedBlogs called", { userId: user._id });
    try {
      const response = await userService.getSavedBlogs(user._id, 1, 100);
      if (response.success && response.data) {
        dispatch(setSavedBlogs(response.data as Blog[]));
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
  }, [dispatch, user, authLoading]);

  const handleToggleSaveBlog = useCallback(
    (blogId: string, blogData?: Blog) => {
      // Check if the blog is currently saved
      const isCurrentlySaved = savedBlogs.some((blog) => blog._id === blogId);

      if (isCurrentlySaved) {
        // Remove from saved blogs immediately for responsive UI
        dispatch(
          setSavedBlogs(savedBlogs.filter((blog) => blog._id !== blogId))
        );
      } else if (blogData) {
        // Add to saved blogs immediately for responsive UI
        dispatch(setSavedBlogs([...savedBlogs, blogData]));
      }

      // Also refresh from server to ensure consistency
      if (user) {
        fetchSavedBlogs();
      }
    },
    [dispatch, savedBlogs, user, fetchSavedBlogs]
  );

  useEffect(() => {
    if (!authLoading && location.pathname === "/") {
      console.log("useEffect for fetchBlogs", {
        isMounted: isMounted.current,
        blogsLength: blogs.length,
        hasMore,
        page,
        pathname: location.pathname,
      });

      // Always fetch blogs when on home page
      console.log("Fetching blogs - on home page");
      if (blogs.length === 0) {
        dispatch(resetBlogs());
      }
      fetchBlogs();
      isMounted.current = true;
    }
  }, [dispatch, fetchBlogs, authLoading, location.pathname]);

  useEffect(() => {
    console.log("useEffect for fetchSavedBlogs", {
      userId: user?._id,
      authLoading,
    });
    fetchSavedBlogs();
  }, [fetchSavedBlogs]);

  const handleLoadMore = () => {
    console.log("handleLoadMore called");
    fetchBlogs();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      {(error || authError) && (
        <p className="text-red-500">{error || authError}</p>
      )}
      {blogs.length === 0 && !isLoading && !authLoading ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                isSaved={savedBlogs.some(
                  (savedBlog) => savedBlog._id === blog._id
                )}
                onToggleSave={handleToggleSaveBlog}
              />
            ))}
          </div>
          {hasMore && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading || authLoading}
                variant="outline"
                className="px-6 py-2"
              >
                {isLoading || authLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
          {(isLoading || authLoading) && (
            <Skeleton className="w-full h-40 mt-4" />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
