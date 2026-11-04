
import { Router } from "express";
import {
  addCow,
  getAllCow,
  getCowById,
  updateCow,
  deleteCow
} from "../controllers/cowController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Only authenticated farm owners can access Cow APIs
router.use(authenticateToken, authorizeRoles("user"));

router.post("/", addCow);
router.get("/", getAllCow);
router.get("/:id", getCowById);
router.put("/:id", updateCow);
router.delete("/:id", deleteCow);

export default router;
