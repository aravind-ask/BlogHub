import { ReactNode, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCredentials,
  setLoading,
  setError,
  logout,
} from "../../features/auth/authSlice";
import { authService } from "../../services/authService";
import Cookies from "js-cookie";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const isRestored = useRef(false); // Track session restoration

  const restoreSession = async () => {
    if (isRestored.current) return;
    isRestored.current = true;

    console.log("AuthProvider: Attempting to restore session");
    dispatch(setLoading(true));
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        dispatch(
          setCredentials({
            user: response.data,
          })
        );
        console.log("AuthProvider: Session restored with getCurrentUser");
      } else {
        const refreshResponse = await authService.refreshToken();
        if (refreshResponse.success && refreshResponse.data) {
          const userResponse = await authService.getCurrentUser();
          if (userResponse.success && userResponse.data) {
            dispatch(
              setCredentials({
                user: userResponse.data,
              })
            );
            console.log("AuthProvider: Session restored with refreshToken");
          } else {
            dispatch(setError("Failed to fetch user"));
            dispatch(logout());
          }
        } else {
          dispatch(setError("Session expired. Please log in again."));
          dispatch(logout());
        }
      }
    } catch (err: any) {
      console.log("AuthProvider: Session restoration failed", err);
      dispatch(setError(err.message || "Failed to restore session"));
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (!user && !isLoading && !isRestored.current) {
      restoreSession();
    }
  }, [user, isLoading]);

  return <>{children}</>;
};

export default AuthProvider;
