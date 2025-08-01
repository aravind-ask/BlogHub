import api from "./api";
import { AuthResponse, RegisterFormData, LoginFormData } from "../types/auth";

export const authService = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
};
