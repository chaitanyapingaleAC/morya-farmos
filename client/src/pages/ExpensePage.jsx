import { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} from "../services/expenseService";
import AddExpenseForm from "../components/AddExpenseForm";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Load all expenses on page load
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getExpenses();
      if (result.success) {
        setExpenses(result.data || []);
      } else {
        setError("Unable to load expenses.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Add new expense
  const handleAddExpense = async (expenseData) => {
    const result = await addExpense(expenseData);
    if (result.success) {
      setShowForm(false);
      await loadExpenses();
    } else {
      throw new Error(result.message || "Failed to save expense.");
    }
  };

  // Update existing expense
  const handleUpdateExpense = async (expenseData) => {
    const result = await updateExpense(editingExpense.expense_id, expenseData);
    if (result.success) {
      setShowForm(false);
      setEditingExpense(null);
      await loadExpenses();
    } else {
      throw new Error(result.message || "Failed to update expense.");
    }
  };

  // Delete an expense
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const result = await deleteExpense(expenseId);
      if (result.success) {
        await loadExpenses();
      } else {
        alert(result.message || "Failed to delete expense.");
      }
    } catch (err) {
      alert(err.message || "Error deleting expense.");
    }
  };

  // Open edit modal
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  // Calculate cumulative expense total
  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  return (
    <div className="expense-page">
      {/* Page Header */}
      <div className="expense-header">
        <div>
          <h1>Expense Management</h1>
          <p>Manage and track your dairy farm operational expenses.</p>
        </div>
        <button className="add-expense-btn" onClick={() => setShowForm(true)}>
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="expense-summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <h2>
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="summary-card">
          <h3>Total Records</h3>
          <h2>{expenses.length}</h2>
        </div>
      </div>

      {/* Expense Records Table */}
      <div className="expense-table-section">
        <h2>Expense Records</h2>

        {loading && <p>Loading expenses...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && expenses.length === 0 && (
          <p>No expenses found. Click "+ Add Expense" above to add your first expense record.</p>
        )}

        {!loading && !error && expenses.length > 0 && (
          <div className="table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.expense_id}>
                    <td>{String(expense.expense_date).slice(0, 10)}</td>
                    <td>{expense.category}</td>
                    <td>
                      ₹{Number(expense.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td>{expense.payment_mode}</td>
                    <td>{expense.description || "—"}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditClick(expense)}>
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteExpense(expense.expense_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal Form */}
      {showForm && (
        <AddExpenseForm
          onSave={editingExpense ? handleUpdateExpense : handleAddExpense}
          editingExpense={editingExpense}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}
