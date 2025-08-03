import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { authService } from "../../services/authService";
import { logout } from "../../features/auth/authSlice";
import { Button } from "../ui/button";
import AuthDebug from "../common/AuthDebug";
import BlogDebug from "../common/BlogDebug";
import toast from "react-hot-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { refreshToken } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (!response.success) {
        console.error(
          `Logout failed with status ${response.status}: ${response.error}`
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            BlogHub
          </Link>
          <div className="space-x-4">
            {user ? (
              <>
                <Link to="/create-blog">
                  <Button>Create Blog</Button>
                </Link>
                <Link to={`/profile/${user._id}`}>
                  <Button variant="outline">Profile</Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          &copy; 2025 BlogHub. All rights reserved.
        </div>
      </footer>
      <AuthDebug />
      <BlogDebug />
    </div>
  );
};

export default Layout;
