import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthTokens } from "../../types/auth";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// Initialize state from cookies
const getInitialState = (): AuthState => {
  // Only try to get cookies if we're in a browser environment
  let accessToken = null;
  let refreshToken = null;
  
  try {
    accessToken = Cookies.get("accessToken");
    refreshToken = Cookies.get("refreshToken");
  } catch (error) {
    console.log("Could not read cookies during initialization:", error);
  }
  
  return {
    user: null,
    token: accessToken || null,
    refreshToken: refreshToken || null,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user || state.user;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null; // Clear error on successful credential set

      // Set cookies for tokens
      if (action.payload.accessToken) {
        Cookies.set("accessToken", action.payload.accessToken, {
          expires: 1 / 96, // 15 minutes
          sameSite: "strict",
          secure: import.meta.env.MODE === "production",
          path: "/",
        });
      }
      if (action.payload.refreshToken) {
        Cookies.set("refreshToken", action.payload.refreshToken, {
          expires: 7, // 7 days
          sameSite: "strict",
          secure: import.meta.env.MODE === "production",
          path: "/",
        });
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;

      // Clear cookies
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, setUser, logout, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;
