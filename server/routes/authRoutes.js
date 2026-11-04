
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Limit repeated login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

// Public login route with rate limiting
router.post("/login", loginLimiter, loginUser);

// Only administrators can register new farms and owners
router.post(
  "/register",
  authenticateToken,
  authorizeRoles("admin"),
  registerUser
);

// Retrieve authenticated user
router.get("/me", authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
