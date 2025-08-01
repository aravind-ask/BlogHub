import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setProfile, setLoading, setError } from "./userSlice";
import { userService } from "../../services/userService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Blog } from "../../types/blog";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { profile, isLoading, error } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      dispatch(setLoading(true));
      try {
        const profileResponse = await userService.getProfile(id);
        if (profileResponse.success && profileResponse.data) {
          dispatch(setProfile(profileResponse.data));
        } else {
          dispatch(
            setError(profileResponse.error || "Failed to fetch profile")
          );
        }

        const blogsResponse = await userService.getUserBlogs(id);
        if (blogsResponse.success && blogsResponse.data) {
          setUserBlogs(blogsResponse.data as Blog[]);
        }

        const savedBlogsResponse = await userService.getSavedBlogs(id);
        if (savedBlogsResponse.success && savedBlogsResponse.data) {
          setSavedBlogs(savedBlogsResponse.data as Blog[]);
        }
      } catch (err) {
        dispatch(setError("An error occurred"));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProfile();
  }, [id, dispatch]);

  const handleToggleSaveBlog = async (blogId: string) => {
    if (!user) {
      return;
    }
    try {
      const isSaved = profile?.savedBlogs.includes(blogId);
      const response = isSaved
        ? await userService.unsaveBlog(blogId)
        : await userService.saveBlog(blogId);
      if (response.success && response.data) {
        dispatch(setProfile(response.data));
      } else {
        dispatch(setError(response.error || "Failed to toggle save"));
      }
    } catch (err) {
      dispatch(setError("An error occurred"));
    }
  };

  if (isLoading) return <Skeleton className="w-full h-96" />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!profile) return null;

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <p className="text-gray-500">{profile.email}</p>
              <p className="text-gray-500">Role: {profile.role}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
      <h2 className="text-2xl font-bold mb-4">My Blogs</h2>
      {userBlogs.length === 0 ? (
        <p className="text-gray-500">No blogs created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBlogs.map((blog) => (
            <Card key={blog._id}>
              <CardHeader>
                <CardTitle>
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{blog.content.slice(0, 100)}...</p>
                {user?._id === profile._id && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/edit-blog/${blog._id}`}>Edit</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <h2 className="text-2xl font-bold mt-8 mb-4">Saved Blogs</h2>
      {savedBlogs.length === 0 ? (
        <p className="text-gray-500">No saved blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedBlogs.map((blog) => (
            <Card key={blog._id}>
              <CardHeader>
                <CardTitle>
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{blog.content.slice(0, 100)}...</p>
                {user?._id === profile._id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleSaveBlog(blog._id)}
                  >
                    {profile.savedBlogs.includes(blog._id) ? "Unsave" : "Save"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
