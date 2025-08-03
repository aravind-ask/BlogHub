import { api } from "./api";
import {
  User,
  AuthTokens,
  IResponse,
  RegisterFormData,
  LoginFormData,
} from "../types/auth";

export const authService = {
  async register(data: RegisterFormData): Promise<IResponse<User>> {
    const response = await api.post<IResponse<User>>("/auth/register", data);
    return response.data;
  },

  async login(data: LoginFormData): Promise<IResponse<AuthTokens>> {
    const response = await api.post<IResponse<AuthTokens>>("/auth/login", data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<IResponse<AuthTokens>> {
    const response = await api.post<IResponse<AuthTokens>>(
      "/auth/refresh-token",
      {
        refreshToken,
      }
    );
    return response.data;
  },

  async logout(): Promise<IResponse<null>> {
    const response = await api.post<IResponse<null>>("/auth/logout");
    return response.data;
  },

  async getCurrentUser(): Promise<IResponse<User>> {
    const response = await api.get<IResponse<User>>("/auth/me");
    return response.data;
  },
};
