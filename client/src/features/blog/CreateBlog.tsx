import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentBlog, updateBlog, setLoading, setError } from "./blogSlice";
import { blogService } from "../../services/blogService";
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
            dispatch(setError(response.error || "Failed to fetch blog"));
          }
        } catch (err) {
          dispatch(setError("An error occurred"));
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
        navigate(`/blog/${(response.data as any)._id}`);
      } else {
        dispatch(setError(response.error || "Failed to save blog"));
      }
    } catch (err) {
      dispatch(setError("An error occurred"));
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
