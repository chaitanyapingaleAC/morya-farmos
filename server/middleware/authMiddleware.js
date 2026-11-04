
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !/^Bearer\s+\S+$/i.test(authHeader)
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });
    }

    const token = authHeader.split(/\s+/)[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || jwtSecret.length < 32) {
      console.error("JWT_SECRET is missing or too short.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    // Verify signature and expiration
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ["HS256"],
    });

    if (!Number.isSafeInteger(decoded.user_id) ||
        decoded.user_id <= 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // Confirm the user still exists and retrieve their current role
    const [users] = await db.query(
  `SELECT user_id, full_name, email, role, farm_id
   FROM users
   WHERE user_id = ?
   LIMIT 1`,
  [decoded.user_id]
);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
    }

    console.error("Authentication middleware failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
    });
  }
};
