import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentBlog, updateBlog, setLoading, setError } from "./blogSlice";
import { blogService } from "../../services/blogService";
import toast from "react-hot-toast";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateBlog = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentBlog, isLoading, error } = useAppSelector(
    (state) => state.blog
  );
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({ title: "", content: "" });

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

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        dispatch(setLoading(true));
        try {
          const response = await blogService.getBlogById(id);
          if (response.success && response.data) {
            dispatch(setCurrentBlog(response.data as any));
            setFormData({
              title: (response.data as any).title,
              content: (response.data as any).content,
            });
          } else {
            dispatch(
              setError(getErrorMessage(response.error, response.status))
            );
          }
        } catch (err: any) {
          dispatch(
            setError(getErrorMessage(err.error || err.message, err.status))
          );
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchBlog();
    }
  }, [id, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(setLoading(true));
    try {
      const response = id
        ? await blogService.updateBlog(id, formData)
        : await blogService.createBlog(formData);
      if (response.success && response.data) {
        dispatch(updateBlog(response.data as any));
        toast.success(id ? "Blog updated successfully!" : "Blog created successfully!");
        navigate(`/blog/${(response.data as any)._id}`);
      } else {
        const errorMessage = getErrorMessage(response.error, response.status);
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.error || err.message, err.status);
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!user)
    return <p className="text-red-500">Please log in to create a blog.</p>;
  if (isLoading)
    return <div className="container mx-auto py-8">Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Blog" : "Create Blog"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic"],
                  ["link"],
                  [{ list: "ordered" }, { list: "bullet" }],
                ],
              }}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : id ? "Update Blog" : "Create Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBlog;
