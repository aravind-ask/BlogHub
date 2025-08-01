import api from "./api";
import {
  BlogResponse,
  CreateBlogFormData,
  UpdateBlogFormData,
} from "../types/blog";

export const blogService = {
  getBlogs: async (page: number, limit: number): Promise<BlogResponse> => {
    const response = await api.get(`/blogs?page=${page}&limit=${limit}`);
    return response.data;
  },
  getBlogById: async (id: string): Promise<BlogResponse> => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },
  createBlog: async (data: CreateBlogFormData): Promise<BlogResponse> => {
    const response = await api.post("/blogs", data);
    return response.data;
  },
  updateBlog: async (
    id: string,
    data: UpdateBlogFormData
  ): Promise<BlogResponse> => {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data;
  },
  likeBlog: async (id: string): Promise<BlogResponse> => {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  },
  commentBlog: async (id: string, content: string): Promise<BlogResponse> => {
    const response = await api.post(`/blogs/${id}/comment`, { content });
    return response.data;
  },
};
