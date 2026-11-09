import { useState } from "react";

const categories = [
  "Feed",
  "Medicines",
  "Labour",
  "Electricity",
  "Transportation",
  "Equipment",
  "Maintenance",
  "Other"
];

const paymentModes = ["Cash", "UPI", "Bank Transfer", "Cheque"];

export default function AddExpenseForm({ onSave, onCancel, editingExpense }) {
  const isEditing = Boolean(editingExpense);
  const today = new Date().toLocaleDateString("en-CA");

  const [formData, setFormData] = useState({
    expense_date: editingExpense ? String(editingExpense.expense_date).slice(0, 10) : today,
    category: editingExpense?.category || "",
    amount: editingExpense?.amount || "",
    payment_mode: editingExpense?.payment_mode || "",
    description: editingExpense?.description || ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.expense_date || !formData.category || !formData.payment_mode) {
      setError("Please complete all required fields.");
      return;
    }

    const numAmount = Number(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    try {
      await onSave({ ...formData, amount: numAmount });
    } catch (err) {
      setError(err.message || "Failed to save expense.");
    }
  };

  return (
    <div className="expense-form-overlay">
      <div className="expense-form">
        <div className="form-header">
          <h2>{isEditing ? "Edit Expense" : "Add New Expense"}</h2>
          <button type="button" className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Expense Date *</label>
            <input
              type="date"
              name="expense_date"
              value={formData.expense_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              placeholder="e.g. 1500"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Mode *</label>
            <select
              name="payment_mode"
              value={formData.payment_mode}
              onChange={handleChange}
              required
            >
              <option value="">Select Payment Mode</option>
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter details or vendor name..."
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {isEditing ? "Update Expense" : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
