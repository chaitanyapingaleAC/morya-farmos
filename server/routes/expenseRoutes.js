
import { Router } from "express";

import {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../controllers/expenseController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// All expense routes require a logged-in Farm Owner.
router.use(authenticateToken, authorizeRoles("user"));

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
