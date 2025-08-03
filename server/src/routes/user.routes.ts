import { RequestHandler, Router } from "express";
import rateLimit from "express-rate-limit";
import { UserController } from "../controllers/user.controller";
import { SavedBlogController } from "../controllers/savedBlog.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { HttpStatus } from "../constants/enums";

const router = Router();
const userController = new UserController();
const savedBlogController = new SavedBlogController();

const saveBlogLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many save/unsave operations, please try again later.",
    error: "Rate limit exceeded",
    status: HttpStatus.TOO_MANY_REQUESTS,
  },
});

router.get(
  "/:id",
  authMiddleware,
  userController.getProfile.bind(userController) as RequestHandler
);

router.get(
  "/:id/blogs",
  authMiddleware,
  userController.getUserBlogs.bind(userController) as RequestHandler
);

router.get(
  "/:id/saved-blogs",
  authMiddleware,
  userController.getSavedBlogs.bind(userController) as RequestHandler
);

router.post(
  "/save-blog/:blogId",
  authMiddleware,
  saveBlogLimiter,
  savedBlogController.saveBlog.bind(savedBlogController) as unknown as RequestHandler
);

router.post(
  "/unsave-blog/:blogId",
  authMiddleware,
  saveBlogLimiter,
  savedBlogController.unsaveBlog.bind(savedBlogController) as unknown as RequestHandler
);

export default router;
