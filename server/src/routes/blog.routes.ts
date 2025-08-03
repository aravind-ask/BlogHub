import { Router, RequestHandler } from "express";
import { check } from "express-validator";
import rateLimit from "express-rate-limit";
import { BlogController } from "../controllers/blog.controller";
import { CommentController } from "../controllers/comment.controller";
import { LikeController } from "../controllers/like.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { HttpStatus } from "../constants/enums";

const router = Router();
const blogController = new BlogController();
const commentController = new CommentController();
const likeController = new LikeController();

// Rate limiter for blog creation and updates
const blogLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many blog operations, please try again later.",
    error: "Rate limit exceeded",
    status: HttpStatus.TOO_MANY_REQUESTS,
  },
});

// Rate limiter for comments
const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 comments per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many comments, please try again later.",
    error: "Rate limit exceeded",
    status: HttpStatus.TOO_MANY_REQUESTS,
  },
});

// Rate limiter for likes
const likeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 likes per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many likes, please try again later.",
    error: "Rate limit exceeded",
    status: HttpStatus.TOO_MANY_REQUESTS,
  },
});

router.post(
  "/",
  authMiddleware,
  blogLimiter,
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("content").notEmpty().withMessage("Content is required"),
  ],
  blogController.createBlog.bind(blogController) as RequestHandler
);

router.get("/", blogController.getBlogs.bind(blogController));

router.get("/:id", blogController.getBlog.bind(blogController));

router.put(
  "/:id",
  authMiddleware,
  blogLimiter,
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("content").notEmpty().withMessage("Content is required"),
  ],
  blogController.updateBlog.bind(blogController) as unknown as RequestHandler
);

router.delete(
  "/:id",
  authMiddleware,
  blogLimiter,
  blogController.deleteBlog.bind(blogController) as unknown as RequestHandler
);

router.post(
  "/:id/comment",
  authMiddleware,
  commentLimiter,
  [check("content").notEmpty().withMessage("Comment content is required")],
  commentController.createComment.bind(commentController) as unknown as RequestHandler
);

router.get(
  "/:id/comments",
  commentController.getComments.bind(commentController) as unknown as RequestHandler
);

router.post(
  "/:id/like",
  authMiddleware,
  likeLimiter,
  likeController.toggleLike.bind(likeController) as unknown as RequestHandler
);

router.get(
  "/:id/likes",
  likeController.getLikes.bind(likeController) as unknown as RequestHandler
);

export default router;
