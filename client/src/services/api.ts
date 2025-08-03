import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";
import { store } from "../store";
import { logout, setCredentials } from "../features/auth/authSlice";
import { IResponse, AuthTokens } from "../types/auth";

const createApiInstance = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Allow cookies to be sent
  });

  api.interceptors.request.use(
    (config) => {
      // Try to get token from cookies first, then from Redux store
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("API Request: Added Authorization header for", config.url);
      } else {
        console.log("API Request: No access token found for", config.url);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<IResponse<unknown>>) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 429) {
        return Promise.reject({
          message: "Too many requests, please try again later.",
          error: "Rate limit exceeded",
          status: 429,
        });
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log("API Response: 401 error, attempting refresh token");
        originalRequest._retry = true;
        const refreshToken = Cookies.get("refreshToken");

        if (refreshToken) {
          try {
            const { authService } = await import("../services/authService");
            const response = await authService.refreshToken(refreshToken);
            if (response.success && response.data) {
              store.dispatch(
                setCredentials({
                  accessToken: response.data.accessToken,
                  refreshToken: response.data.refreshToken,
                })
              );
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            store.dispatch(logout());
            return Promise.reject(refreshError);
          }
        } else {
          store.dispatch(logout());
        }
      }

      return Promise.reject({
        message: error.response?.data?.message || "An error occurred",
        error: error.response?.data?.error || "Unknown error",
        status: error.response?.status || 500,
      });
    }
  );

  return api;
};

export const api = createApiInstance(
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
);
