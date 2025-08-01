import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Layout from "./components/layout/Layout";
import Home from "./features/blog/Home";
import BlogDetail from "./features/blog/BlogDetail";
import CreateBlog from "./features/blog/CreateBlog";
import Profile from "./features/user/Profile";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
