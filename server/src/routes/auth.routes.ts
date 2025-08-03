import { RequestHandler, Router } from "express";
import { check } from "express-validator";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.config";

const router = Router();
const authController = new AuthController();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
    error: "Rate limit exceeded",
    status: 429,
  },
});

router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 6 }).withMessage("Password too short"),
    check("name").notEmpty().withMessage("Name is required"),
  ],
  authLimiter,
  authController.register.bind(authController)
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  authLimiter,
  authController.login.bind(authController)
);

router.post(
  "/refresh-token",
  [check("refreshToken").notEmpty().withMessage("Refresh token is required")],
  authController.refreshToken.bind(authController)
);

router.post(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController) as RequestHandler
);

router.get(
  "/me",
  authMiddleware,
  authController.getCurrentUser.bind(authController) as RequestHandler
);

export default router;
