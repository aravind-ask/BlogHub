import { User } from "./auth";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: User | string;
  blog: string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  user: User | string;
  blog: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse<T = Blog | Blog[] | Comment[] | Like[] | null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  status: number;
  hasMore?: boolean;
}

export interface CreateBlogFormData {
  title: string;
  content: string;
}

export interface UpdateBlogFormData {
  title: string;
  content: string;
}

export interface CommentFormData {
  content: string;
}
