
import { Router } from "express";

import {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../controllers/expenseController.js";

const router = Router();

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
