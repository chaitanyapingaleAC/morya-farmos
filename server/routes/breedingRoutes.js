
import { Router } from "express";

import {
    addBreeding,
    getBreedingRecords,
    getBreedingById,
    updateBreeding,
    deleteBreeding
} from "../controllers/breedingController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Only logged-in Farm Owners can access breeding records.
router.use(authenticateToken, authorizeRoles("user"));

router.post("/", addBreeding);
router.get("/", getBreedingRecords);
router.get("/:id", getBreedingById);
router.put("/:id", updateBreeding);
router.delete("/:id", deleteBreeding);

export default router;
