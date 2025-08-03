import { useAppSelector } from "../../store/hooks";
import Cookies from "js-cookie";

const AuthDebug = () => {
  const { user, token, refreshToken, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const cookieAccessToken = Cookies.get("accessToken");
  const cookieRefreshToken = Cookies.get("refreshToken");

  const handleTestCookies = () => {
    console.log("All cookies:", document.cookie);
    console.log("Access token cookie:", cookieAccessToken);
    console.log("Refresh token cookie:", cookieRefreshToken);
    console.log("Redux state:", {
      user,
      token,
      refreshToken,
      isLoading,
      error,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-md text-xs">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>
          <strong>User:</strong> {user ? "Logged in" : "Not logged in"}
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Error:</strong> {error || "None"}
        </div>
        <div>
          <strong>Redux Token:</strong> {token ? "Present" : "Missing"}
        </div>
        <div>
          <strong>Redux Refresh:</strong> {refreshToken ? "Present" : "Missing"}
        </div>
        <div>
          <strong>Cookie Access:</strong>{" "}
          {cookieAccessToken ? "Present" : "Missing"}
        </div>
        <div>
          <strong>Cookie Refresh:</strong>{" "}
          {cookieRefreshToken ? "Present" : "Missing"}
        </div>
        <div>
          <strong>User ID:</strong> {user?._id || "N/A"}
        </div>
        <div>
          <strong>User Email:</strong> {user?.email || "N/A"}
        </div>
        <button 
          onClick={handleTestCookies}
          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Test Cookies
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
