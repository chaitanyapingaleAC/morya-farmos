
import db from "../config/db.js";

// Add a new expense
export const addExpense = async (req, res) => {
    const farmId = req.user.farm_id;

    const {
        expense_date,
        category,
        amount,
        payment_mode,
        description
    } = req.body;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned to this user."
        });
    }

    if (!expense_date || !category ||
        amount === undefined || !payment_mode) {
        return res.status(400).json({
            success: false,
            message: "Please provide expense date, category, amount and payment mode."
        });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Amount must be a number greater than zero."
        });
    }

    try {
        const sql = `
            INSERT INTO expenses
            (farm_id, expense_date, category, amount, payment_mode, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            farmId,
            expense_date,
            category,
            numericAmount,
            payment_mode,
            description || null
        ]);

        res.status(201).json({
            success: true,
            message: "Expense added successfully!",
            expense_id: result.insertId
        });

    } catch (error) {
        console.error("Add expense error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add expense."
        });
    }
};

// Get all expenses for logged-in farm
export const getExpenses = async (req, res) => {
    const farmId = req.user.farm_id;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned to this user."
        });
    }

    try {
        const sql = `
            SELECT * FROM expenses
            WHERE farm_id = ?
            ORDER BY expense_date DESC, expense_id DESC
        `;

        const [results] = await db.query(sql, [farmId]);

        res.json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error("Get expenses error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch expenses."
        });
    }
};

// Get expense by ID
export const getExpenseById = async (req, res) => {
    const farmId = req.user.farm_id;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned to this user."
        });
    }

    try {
        const sql = `
            SELECT * FROM expenses
            WHERE expense_id = ? AND farm_id = ?
        `;

        const [results] = await db.query(sql, [
            req.params.id,
            farmId
        ]);

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense not found."
            });
        }

        res.json({
            success: true,
            data: results[0]
        });

    } catch (error) {
        console.error("Get expense error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch expense."
        });
    }
};

// Update expense
export const updateExpense = async (req, res) => {
    const farmId = req.user.farm_id;

    const {
        expense_date,
        category,
        amount,
        payment_mode,
        description
    } = req.body;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned to this user."
        });
    }

    if (!expense_date || !category ||
        amount === undefined || !payment_mode) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required expense details."
        });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Amount must be a number greater than zero."
        });
    }

    try {
        const sql = `
            UPDATE expenses
            SET expense_date = ?,
                category = ?,
                amount = ?,
                payment_mode = ?,
                description = ?
            WHERE expense_id = ? AND farm_id = ?
        `;

        const [result] = await db.query(sql, [
            expense_date,
            category,
            numericAmount,
            payment_mode,
            description || null,
            req.params.id,
            farmId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense not found."
            });
        }

        res.json({
            success: true,
            message: "Expense updated successfully!"
        });

    } catch (error) {
        console.error("Update expense error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update expense."
        });
    }
};

// Delete expense
export const deleteExpense = async (req, res) => {
    const farmId = req.user.farm_id;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned to this user."
        });
    }

    try {
        const sql = `
            DELETE FROM expenses
            WHERE expense_id = ? AND farm_id = ?
        `;

        const [result] = await db.query(sql, [
            req.params.id,
            farmId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense not found."
            });
        }

        res.json({
            success: true,
            message: "Expense deleted successfully!"
        });

    } catch (error) {
        console.error("Delete expense error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete expense."
        });
    }
};
