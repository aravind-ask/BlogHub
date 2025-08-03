import { useEffect, useCallback, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setProfile,
  setSavedBlogs,
  appendSavedBlogs,
  resetSavedBlogs,
  setSavedBlogsHasMore,
  setLoading,
  setError,
} from "./userSlice";
import toast from "react-hot-toast";
import { userService } from "../../services/userService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import InfiniteScroll from "react-infinite-scroll-component";
import BlogCard from "../../components/common/BlogCard";
import { Blog } from "../../types/blog";
import {
  User,
  BookOpen,
  Bookmark,
  Calendar,
  Mail,
  Shield,
  Edit3,
  Plus,
} from "lucide-react";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    profile,
    savedBlogs,
    savedBlogsPage,
    savedBlogsHasMore,
    isLoading,
    error,
  } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState<"blogs" | "saved">("blogs");

  const getErrorMessage = (error: string | null, status?: number) => {
    if (!error) return "An error occurred";
    switch (status) {
      case 400:
        return "Invalid request. Please try again.";
      case 401:
        return "Please log in to perform this action.";
      case 403:
        return "You are not authorized to view this profile.";
      case 404:
        return "Profile not found.";
      case 429:
        return "Too many requests. Please try again later.";
      default:
        return error;
    }
  };

  const fetchProfileData = useCallback(async () => {
    if (!id) return;
    dispatch(setLoading(true));
    try {
      const profileResponse = await userService.getProfile(id);
      if (profileResponse.success && profileResponse.data) {
        dispatch(setProfile(profileResponse.data));
      } else {
        const errorMessage = getErrorMessage(
          profileResponse.error,
          profileResponse.status
        );
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      }

      const blogsResponse = await userService.getUserBlogs(id);
      if (blogsResponse.success && blogsResponse.data) {
        setUserBlogs(blogsResponse.data as Blog[]);
      } else {
        const errorMessage = getErrorMessage(
          blogsResponse.error,
          blogsResponse.status
        );
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      }

      dispatch(resetSavedBlogs());
      const savedBlogsResponse = await userService.getSavedBlogs(id, 1, 10);
      if (savedBlogsResponse.success && savedBlogsResponse.data) {
        dispatch(setSavedBlogs(savedBlogsResponse.data as Blog[]));
        dispatch(setSavedBlogsHasMore(savedBlogsResponse.hasMore ?? false));
      } else {
        const errorMessage = getErrorMessage(
          savedBlogsResponse.error,
          savedBlogsResponse.status
        );
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
    } finally {
      dispatch(setLoading(false));
    }
  }, [id, dispatch]);

  const fetchMoreSavedBlogs = useCallback(async () => {
    if (!id || isLoading || !savedBlogsHasMore) return;
    dispatch(setLoading(true));
    try {
      const response = await userService.getSavedBlogs(id, savedBlogsPage, 10);
      if (response.success && response.data) {
        dispatch(appendSavedBlogs(response.data as Blog[]));
        dispatch(setSavedBlogsHasMore(response.hasMore ?? false));
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
    } finally {
      dispatch(setLoading(false));
    }
  }, [id, dispatch, savedBlogsPage, isLoading, savedBlogsHasMore]);

  const handleToggleSaveBlog = useCallback(
    (blogId: string) => {
      // Check if the blog is currently saved
      const isCurrentlySaved = savedBlogs.some((blog) => blog._id === blogId);

      if (isCurrentlySaved) {
        // Remove from saved blogs immediately for responsive UI
        dispatch(
          setSavedBlogs(savedBlogs.filter((blog) => blog._id !== blogId))
        );
      }

      // Also refresh from server to ensure consistency
      if (id) {
        const refreshSavedBlogs = async () => {
          try {
            const response = await userService.getSavedBlogs(id, 1, 100);
            if (response.success && response.data) {
              dispatch(setSavedBlogs(response.data as Blog[]));
            }
          } catch (err) {
            console.error("Error refreshing saved blogs:", err);
          }
        };
        refreshSavedBlogs();
      }
    },
    [dispatch, savedBlogs, id]
  );

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (isLoading && savedBlogs.length === 0 && userBlogs.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="w-full h-64 mb-8" />
          <Skeleton className="w-full h-8 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-full h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!profile) return null;

  const isOwnProfile = user && user._id === id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {profile.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {profile.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm capitalize">
                            {profile.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm">
                            {userBlogs.length} blogs
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4" />
                          <span className="text-sm">
                            {savedBlogs.length} saved
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isOwnProfile && (
                      <div className="flex gap-3">
                        <Button asChild variant="outline" className="gap-2">
                          <Link to="/create-blog">
                            <Plus className="w-4 h-4" />
                            New Blog
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Link to={`/profile/${id}/edit`}>
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("blogs")}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === "blogs"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                My Blogs ({userBlogs.length})
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === "saved"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Saved Blogs ({savedBlogs.length})
              </button>
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === "blogs" && (
            <div>
              {userBlogs.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No blogs yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {isOwnProfile
                        ? "Start sharing your thoughts with the world by creating your first blog post."
                        : `${profile.name} hasn't created any blogs yet.`}
                    </p>
                    {isOwnProfile && (
                      <Button asChild className="gap-2">
                        <Link to="/create-blog">
                          <Plus className="w-4 h-4" />
                          Create Your First Blog
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBlogs.map((blog) => (
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
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div>
              {savedBlogs.length === 0 && !isLoading ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No saved blogs
                    </h3>
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "Blogs you save will appear here for easy access."
                        : `${profile.name} hasn't saved any blogs yet.`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <InfiniteScroll
                  dataLength={savedBlogs.length}
                  next={fetchMoreSavedBlogs}
                  hasMore={savedBlogsHasMore}
                  loader={
                    <div className="flex justify-center py-8">
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        Loading more blogs...
                      </div>
                    </div>
                  }
                  scrollThreshold={0.8}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedBlogs.map((blog) => (
                      <BlogCard
                        key={blog._id}
                        blog={blog}
                        isSaved={true}
                        onToggleSave={handleToggleSaveBlog}
                      />
                    ))}
                  </div>
                </InfiniteScroll>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
