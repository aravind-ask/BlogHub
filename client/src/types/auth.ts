export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  savedBlogs: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: string | User; // JWT token or User object
  error?: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: User;
  error?: string;
}
