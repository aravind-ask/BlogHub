import api from "./api";
import { UserResponse } from "../types/auth";
import { BlogResponse } from "../types/blog";

export const userService = {
  getProfile: async (id: string): Promise<UserResponse> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  getUserBlogs: async (id: string): Promise<BlogResponse> => {
    const response = await api.get(`/users/${id}/blogs`);
    return response.data;
  },
  getSavedBlogs: async (id: string): Promise<BlogResponse> => {
    const response = await api.get(`/users/${id}/saved-blogs`);
    return response.data;
  },
  saveBlog: async (blogId: string): Promise<UserResponse> => {
    const response = await api.post(`/users/save-blog/${blogId}`);
    return response.data;
  },
  unsaveBlog: async (blogId: string): Promise<UserResponse> => {
    const response = await api.post(`/users/unsave-blog/${blogId}`);
    return response.data;
  },
};
