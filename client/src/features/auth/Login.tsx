import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "./authSlice";
import { authService } from "../../services/authService";
import AuthForm from "../../components/common/AuthForm";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (formData: Record<string, string>) => {
    console.log("Login: Starting login process");
    const loginResponse = await authService.login({
      email: formData.email,
      password: formData.password,
    });
    console.log("Login: Login response", loginResponse);

    if (loginResponse.success && loginResponse.data) {
      console.log("Login: Login successful, getting user data");
      const userResponse = await authService.getCurrentUser();
      console.log("Login: User response", userResponse);

      if (userResponse.success && userResponse.data) {
        console.log("Login: Setting credentials");
        dispatch(
          setCredentials({
            user: userResponse.data,
            accessToken: loginResponse.data.accessToken,
            refreshToken: loginResponse.data.refreshToken,
          })
        );
        console.log("Login: Navigating to home");
        toast.success("Login successful! Welcome back!");
        navigate("/");
      } else {
        throw new Error(
          userResponse.error ||
            `Login failed with status ${userResponse.status}`
        );
      }
    } else {
      throw new Error(
        loginResponse.error ||
          `Login failed with status ${loginResponse.status}`
      );
    }
  };

  return (
    <AuthForm
      title="Login"
      fields={[
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      onSubmit={handleSubmit}
    />
  );
};

export default Login;
