import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/auth";
import { Blog } from "../../types/blog";

interface UserState {
  profile: User | null;
  savedBlogs: Blog[];
  savedBlogsPage: number;
  savedBlogsHasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  savedBlogs: [],
  savedBlogsPage: 1,
  savedBlogsHasMore: true,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    setSavedBlogs: (state, action: PayloadAction<Blog[]>) => {
      // Replace saved blogs instead of appending
      state.savedBlogs = action.payload;
      if (action.payload.length > 0) {
        state.savedBlogsPage = 2; // Set to 2 since we already loaded page 1
      } else {
        state.savedBlogsPage = 1;
      }
    },
    appendSavedBlogs: (state, action: PayloadAction<Blog[]>) => {
      // Append saved blogs for pagination
      state.savedBlogs = [...state.savedBlogs, ...action.payload];
      if (action.payload.length > 0) {
        state.savedBlogsPage += 1;
      }
    },
    resetSavedBlogs: (state) => {
      state.savedBlogs = [];
      state.savedBlogsPage = 1;
      state.savedBlogsHasMore = true;
    },
    setSavedBlogsHasMore: (state, action: PayloadAction<boolean>) => {
      state.savedBlogsHasMore = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProfile,
  setSavedBlogs,
  appendSavedBlogs,
  resetSavedBlogs,
  setSavedBlogsHasMore,
  setLoading,
  setError,
} = userSlice.actions;
export default userSlice.reducer;
