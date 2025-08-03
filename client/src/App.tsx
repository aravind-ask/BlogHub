import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Layout from "./components/layout/Layout";
import AuthProvider from "./components/auth/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import ToastProvider from "./components/common/ToastProvider";
import Home from "./features/blog/Home";
import BlogDetail from "./features/blog/BlogDetail";
import CreateBlog from "./features/blog/CreateBlog";
import Profile from "./features/user/Profile";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
// import AuthCallback from "./features/auth/AuthCallback";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Home />
                  </ErrorBoundary>
                }
              />{" "}
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/create-blog" element={<CreateBlog />} />
              <Route path="/edit-blog/:id" element={<CreateBlog />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/auth-callback" element={<AuthCallback />} /> */}
            </Routes>
          </Layout>
          <ToastProvider />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
