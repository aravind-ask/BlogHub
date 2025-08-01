import { Router, RequestHandler } from "express";
import { check } from "express-validator";
import { BlogController } from "../controllers/blog.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const blogController = new BlogController();

router.post(
  "/",
  authMiddleware,
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
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("content").notEmpty().withMessage("Content is required"),
  ],
  blogController.updateBlog.bind(blogController) as unknown as RequestHandler
);

router.delete(
  "/:id",
  authMiddleware,
  blogController.deleteBlog.bind(blogController) as unknown as RequestHandler
);

router.post(
  "/:id/like",
  authMiddleware,
  blogController.likeBlog.bind(blogController) as unknown as RequestHandler
);

router.post(
  "/:id/comment",
  authMiddleware,
  [check("content").notEmpty().withMessage("Comment content is required")],
  blogController.commentBlog.bind(blogController) as unknown as RequestHandler
);

export default router;
