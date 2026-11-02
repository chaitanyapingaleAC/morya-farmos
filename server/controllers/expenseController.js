
import db from "../config/db.js";

// Add a new expense
export const addExpense = async (req, res) => {
    const {
        expense_date,
        category,
        amount,
        payment_mode,
        description
    } = req.body;

    if (!expense_date || !category || amount === undefined || !payment_mode) {
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
            (expense_date, category, amount, payment_mode, description)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
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


// Get all expenses
export const getExpenses = async (req, res) => {
    try {
        const sql = `
            SELECT * FROM expenses
            ORDER BY expense_date DESC, expense_id DESC
        `;

        const [results] = await db.query(sql);

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
    try {
        const sql = "SELECT * FROM expenses WHERE expense_id = ?";

        const [results] = await db.query(sql, [req.params.id]);

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
    const {
        expense_date,
        category,
        amount,
        payment_mode,
        description
    } = req.body;

    if (!expense_date || !category || amount === undefined || !payment_mode) {
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
            WHERE expense_id = ?
        `;

        const [result] = await db.query(sql, [
            expense_date,
            category,
            numericAmount,
            payment_mode,
            description || null,
            req.params.id
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
    try {
        const sql = "DELETE FROM expenses WHERE expense_id = ?";

        const [result] = await db.query(sql, [req.params.id]);

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
