import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "./authSlice";
import { authService } from "../../services/authService";
import AuthForm from "../../components/common/AuthForm";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (formData: Record<string, string>) => {
    const registerResponse = await authService.register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });
    if (registerResponse.success && registerResponse.data) {
      const loginResponse = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      if (loginResponse.success && loginResponse.data) {
        const userResponse = await authService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          dispatch(
            setCredentials({
              user: userResponse.data,
              accessToken: loginResponse.data.accessToken,
              refreshToken: loginResponse.data.refreshToken,
            })
          );
          toast.success("Registration successful! Welcome to BlogHub!");
          navigate("/");
        } else {
          throw new Error(
            userResponse.error ||
              `Failed to fetch user with status ${userResponse.status}`
          );
        }
      } else {
        throw new Error(
          loginResponse.error ||
            `Login failed with status ${loginResponse.status}`
        );
      }
    } else {
      throw new Error(
        registerResponse.error ||
          `Registration failed with status ${registerResponse.status}`
      );
    }
  };

  return (
    <AuthForm
      title="Register"
      fields={[
        { name: "name", type: "text", placeholder: "Name" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      onSubmit={handleSubmit}
    />
  );
};

export default Register;
