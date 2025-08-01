import { Router } from "express";
import { check } from "express-validator";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 6 }).withMessage("Password too short"),
    check("name").notEmpty().withMessage("Name is required"),
  ],
  authController.register.bind(authController)
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login.bind(authController)
);

export default router;
