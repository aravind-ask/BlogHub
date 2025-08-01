import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

router.get(
  "/:id",
  authMiddleware,
  userController.getProfile.bind(userController)
);
router.get(
  "/:id/blogs",
  authMiddleware,
  userController.getUserBlogs.bind(userController)
);
router.get(
  "/:id/saved-blogs",
  authMiddleware,
  userController.getSavedBlogs.bind(userController)
);
router.post(
  "/save-blog/:blogId",
  authMiddleware,
  userController.saveBlog.bind(userController)
);
router.post(
  "/unsave-blog/:blogId",
  authMiddleware,
  userController.unsaveBlog.bind(userController)
);

export default router;
