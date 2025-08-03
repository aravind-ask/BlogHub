import { api } from "./api";
import {
  BlogResponse,
  CreateBlogFormData,
  UpdateBlogFormData,
  CommentFormData,
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
  deleteBlog: async (id: string): Promise<BlogResponse> => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
  likeBlog: async (id: string): Promise<BlogResponse> => {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  },
  getLikes: async (id: string): Promise<BlogResponse> => {
    const response = await api.get(`/blogs/${id}/likes`);
    return response.data;
  },
  commentBlog: async (
    id: string,
    data: CommentFormData
  ): Promise<BlogResponse> => {
    const response = await api.post(`/blogs/${id}/comment`, data);
    return response.data;
  },
  getComments: async (
    id: string,
    page: number,
    limit: number
  ): Promise<BlogResponse> => {
    const response = await api.get(
      `/blogs/${id}/comments?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  deleteComment: async (
    blogId: string | undefined,
    commentId: string
  ): Promise<BlogResponse> => {
    const response = await api.delete(`/blogs/delete/${blogId}/comment/${commentId}`);
    return response.data;
  },
};
