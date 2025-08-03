import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { authService } from "../../services/authService";
import {
  setCredentials,
  setUser,
  setLoading,
  setError,
  logout,
} from "../../features/auth/authSlice";
import Cookies from "js-cookie";

interface AuthProviderProps {
  children: React.ReactNode;
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
      // First try to get current user with existing token
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        dispatch(setUser(response.data));
        console.log("AuthProvider: Session restored with getCurrentUser");
      } else {
        // If that fails, try to refresh the token
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          const refreshResponse = await authService.refreshToken(refreshToken);
          if (refreshResponse.success && refreshResponse.data) {
            // Update tokens in store and cookies
            dispatch(
              setCredentials({
                accessToken: refreshResponse.data.accessToken,
                refreshToken: refreshResponse.data.refreshToken,
              })
            );

            // Get user data with new token
            const userResponse = await authService.getCurrentUser();
            if (userResponse.success && userResponse.data) {
              dispatch(setUser(userResponse.data));
              console.log("AuthProvider: Session restored with refreshToken");
            } else {
              dispatch(setError("Failed to fetch user"));
              dispatch(logout());
            }
          } else {
            dispatch(setError("Session expired. Please log in again."));
            dispatch(logout());
          }
        } else {
          // No refresh token available
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
    // Only run once on mount
    if (isRestored.current) return;
    
    // Check if we have tokens in cookies but no user in state
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    console.log("AuthProvider: Checking tokens", {
      accessToken: accessToken ? "present" : "missing",
      refreshToken: refreshToken ? "present" : "missing",
      user: user ? "present" : "missing",
      isLoading,
      isRestored: isRestored.current
    });

    if (accessToken || refreshToken) {
      console.log("AuthProvider: Starting session restoration");
      restoreSession();
    } else {
      console.log("AuthProvider: No tokens found, user not logged in");
    }
  }, []); // Empty dependency array - only run once on mount

  return <>{children}</>;
};

export default AuthProvider;
