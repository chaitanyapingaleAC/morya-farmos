import { Router } from "express";
import {
    getMilkRecords,
    addMilkRecord,
    deleteMilkRecord
} from "../controllers/milkController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Only logged in farm users can access milk records
router.use(authenticateToken, authorizeRoles("user"));

router.get("/", getMilkRecords);
router.post("/", addMilkRecord);
router.delete("/:id", deleteMilkRecord);

export default router;
