
import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes in this file require Super Admin access
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

// Get all registered farms with their owners
router.get("/farms", async (req, res) => {
  try {
    const [farms] = await db.query(`
      SELECT
        f.farm_id,
        f.farm_name,
        u.full_name AS owner_name,
        u.email AS owner_email
      FROM farms f
      LEFT JOIN users u
        ON f.farm_id = u.farm_id
        AND u.role = 'user'
      ORDER BY f.farm_id DESC
    `);

    return res.status(200).json({
      success: true,
      farms,
    });
  } catch (error) {
    console.error("Failed to fetch farms:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch registered farms.",
    });
  }
});

export default router;
