import { useAppSelector } from "../../store/hooks";

const BlogDebug = () => {
  const { blogs, hasMore, page, isLoading, error } = useAppSelector(
    (state) => state.blog
  );
  const { user, savedBlogs } = useAppSelector((state) => state.user);
  const { isLoading: authLoading } = useAppSelector((state) => state.auth);

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-md text-xs">
      <h3 className="font-bold mb-2">Blog Debug Info</h3>
      <div className="space-y-1">
        <div>
          <strong>Blogs Count:</strong> {blogs.length}
        </div>
        <div>
          <strong>Page:</strong> {page}
        </div>
        <div>
          <strong>Has More:</strong> {hasMore ? "Yes" : "No"}
        </div>
        <div>
          <strong>Blog Loading:</strong> {isLoading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Auth Loading:</strong> {authLoading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Error:</strong> {error || "None"}
        </div>
        <div>
          <strong>User:</strong> {user ? "Logged in" : "Not logged in"}
        </div>
        <div>
          <strong>Saved Blogs:</strong> {savedBlogs.length}
        </div>
        <div>
          <strong>First Blog ID:</strong> {blogs[0]?._id || "N/A"}
        </div>
        <div>
          <strong>First Blog Title:</strong> {blogs[0]?.title || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default BlogDebug;
