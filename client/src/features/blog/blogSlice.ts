import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Blog } from "../../types/blog";

interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  hasMore: boolean;
  page: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  hasMore: true,
  page: 1,
  isLoading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = [...state.blogs, ...action.payload];
      state.hasMore = action.payload.length > 0;
      state.page += 1;
    },
    setCurrentBlog: (state, action: PayloadAction<Blog>) => {
      state.currentBlog = action.payload;
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs = state.blogs.map((blog) =>
        blog._id === action.payload._id ? action.payload : blog
      );
      if (state.currentBlog?._id === action.payload._id) {
        state.currentBlog = action.payload;
      }
    },
    resetBlogs: (state) => {
      state.blogs = [];
      state.hasMore = true;
      state.page = 1;
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
  setBlogs,
  setCurrentBlog,
  updateBlog,
  resetBlogs,
  setLoading,
  setError,
} = blogSlice.actions;
export default blogSlice.reducer;
