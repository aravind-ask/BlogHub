import { User } from "./auth";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  comments: {
    user: User;
    content: string;
    createdAt: string;
  }[];
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data?: Blog | Blog[];
  error?: string;
}

export interface CreateBlogFormData {
  title: string;
  content: string;
}

export interface UpdateBlogFormData {
  title: string;
  content: string;
}
