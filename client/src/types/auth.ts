export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}


export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  status: number;
  hasMore?: boolean;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: User | null;
  error?: string;
  status: number;
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
