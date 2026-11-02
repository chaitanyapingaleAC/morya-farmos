
import { useState } from "react";

// Available expense categories for Morya Dairy Farm
const categories = [
  "Feed",
  "Medicines",
  "Labour",
  "Electricity",
  "Transportation",
  "Equipment",
  "Maintenance",
  "Other",
];

// Available payment methods
const paymentModes = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
];

// Reusable form for both adding and editing expenses
function AddExpenseForm({ onSave, onCancel, editingExpense }) {

  // Check whether we are editing an existing record
  const isEditing = Boolean(editingExpense);

  // Prepare today's date in YYYY-MM-DD format for the date input
  const today = new Date().toLocaleDateString("en-CA");

  // Store form values.
  // If editing, fill the form with existing expense details.
  // Otherwise, start with empty values.
  const [formData, setFormData] = useState(() => ({
    expense_date: editingExpense
      ? String(editingExpense.expense_date).slice(0, 10)
      : today,

    category: editingExpense?.category || "",
    amount: editingExpense?.amount || "",
    payment_mode: editingExpense?.payment_mode || "",
    description: editingExpense?.description || "",
  }));

  // Store validation or API error messages
  const [error, setError] = useState("");

  // Update the relevant form field whenever the user types
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Validate and submit the expense form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check that required fields are filled
    if (!formData.expense_date || !formData.category || !formData.payment_mode) {
      setError("Please complete all required fields.");
      return;
    }

    // Amount must be a valid positive number
    if (!formData.amount || !Number.isFinite(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    try {
      // Send form details to the parent page
      await onSave({
        ...formData,
        amount: Number(formData.amount),
      });
    } catch (err) {
      setError(err.message || "Failed to save expense.");
    }
  };

  return (
    // Dark background behind the popup form
    <div className="expense-form-overlay">

      {/* Main form container */}
      <div className="expense-form">

        {/* Form heading changes according to the operation */}
        <div className="form-header">
          <h2>{isEditing ? "Edit Expense" : "Add New Expense"}</h2>

          <button
            type="button"
            className="close-btn"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        {/* Expense entry form */}
        <form onSubmit={handleSubmit}>

          {/* Expense date */}
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

          {/* Expense category dropdown */}
          <div className="form-group">
            <label>Category *</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Expense amount */}
          <div className="form-group">
            <label>Amount (₹) *</label>

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Payment method dropdown */}
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

          {/* Optional expense description */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter expense details"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Display validation or API errors */}
          {error && (
            <p className="error-message">{error}</p>
          )}

          {/* Cancel and submit buttons */}
          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
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

export default AddExpenseForm;
