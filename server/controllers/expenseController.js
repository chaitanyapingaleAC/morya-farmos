
const db = require("../config/db");

// Add a new expense
exports.addExpense = (req, res) => {
  const { expense_date, category, amount, payment_mode, description } = req.body;

  if (!expense_date || !category || amount === undefined || !payment_mode) {
    return res.status(400).json({
      success: false,
      message: "Please provide expense date, category, amount and payment mode.",
    });
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a number greater than zero.",
    });
  }

  const sql = `
    INSERT INTO expenses
    (expense_date, category, amount, payment_mode, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [expense_date, category, numericAmount, payment_mode, description || null],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to add expense.",
          error: error.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Expense added successfully!",
        expense_id: result.insertId,
      });
    }
  );
};

// Get all expenses
exports.getExpenses = (req, res) => {
  const sql = "SELECT * FROM expenses ORDER BY expense_date DESC, expense_id DESC";

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch expenses.",
        error: error.message,
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
};

// Get expense by ID
exports.getExpenseById = (req, res) => {
  const sql = "SELECT * FROM expenses WHERE expense_id = ?";

  db.query(sql, [req.params.id], (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch expense.",
        error: error.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    res.json({
      success: true,
      data: results[0],
    });
  });
};

// Update expense
exports.updateExpense = (req, res) => {
  const { expense_date, category, amount, payment_mode, description } = req.body;

  if (!expense_date || !category || amount === undefined || !payment_mode) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required expense details.",
    });
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a number greater than zero.",
    });
  }

  const sql = `
    UPDATE expenses
    SET expense_date = ?, category = ?, amount = ?, payment_mode = ?, description = ?
    WHERE expense_id = ?
  `;

  db.query(
    sql,
    [expense_date, category, numericAmount, payment_mode, description || null, req.params.id],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to update expense.",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Expense not found.",
        });
      }

      res.json({
        success: true,
        message: "Expense updated successfully!",
      });
    }
  );
};

// Delete expense
exports.deleteExpense = (req, res) => {
  const sql = "DELETE FROM expenses WHERE expense_id = ?";

  db.query(sql, [req.params.id], (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete expense.",
        error: error.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully!",
    });
  });
};
