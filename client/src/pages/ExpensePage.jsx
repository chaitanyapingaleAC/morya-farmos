import { useState, useEffect } from "react";
import { Plus, X, Edit2, Trash2, Search, Check, Wallet } from "lucide-react";

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

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  const today = new Date().toLocaleDateString("en-CA");
  const initialFormState = {
    expense_id: null,
    expense_date: today,
    category: "",
    amount: "",
    payment_mode: "Cash",
    description: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // Helper for auth headers
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
  });

  // 1. Fetch all expenses from server
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/expenses", {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setExpenses(data.success && Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error loading expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // 2. Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Save Expense (handles both Add New and Update Existing)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEditing
        ? `http://localhost:5000/api/expenses/${formData.expense_id}`
        : "http://localhost:5000/api/expenses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save expense");
        return;
      }

      // Reset form and reload
      setFormData(initialFormState);
      setIsEditing(false);
      setShowForm(false);
      loadExpenses();
    } catch (err) {
      alert("Error saving expense: " + err.message);
    }
  };

  // 4. Open form to Edit an expense
  const handleEdit = (expense) => {
    setFormData({
      expense_id: expense.expense_id,
      expense_date: String(expense.expense_date).slice(0, 10),
      category: expense.category,
      amount: expense.amount,
      payment_mode: expense.payment_mode,
      description: expense.description || ""
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // 5. Delete an expense
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (res.ok) {
        loadExpenses();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete expense");
      }
    } catch (err) {
      alert("Error deleting expense: " + err.message);
    }
  };

  // 6. Cancel form
  const handleCancel = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setShowForm(false);
  };

  // Calculate cumulative total expenses
  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  // Filter expenses by search query (category or description)
  const filteredExpenses = expenses.filter((exp) => {
    const q = search.toLowerCase();
    return (
      exp.category.toLowerCase().includes(q) ||
      (exp.payment_mode || "").toLowerCase().includes(q) ||
      (exp.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="expense-page">
      {/* Page Header */}
      <div className="expense-header">
        <div>
          <h1>Expense Management</h1>
          <p>Track feed, medicines, and daily dairy farm expenditures.</p>
        </div>
        <button
          onClick={() => {
            if (showForm) handleCancel();
            else setShowForm(true);
          }}
          className="btn-primary"
        >
          {showForm ? (
            <>
              <X size={17} /> Close Form
            </>
          ) : (
            <>
              <Plus size={17} /> Add Expense
            </>
          )}
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="expense-summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <h2>
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="summary-card">
          <h3>Total Records</h3>
          <h2>{expenses.length} Entries</h2>
        </div>
      </div>

      {/* Add / Edit Form Card */}
      {showForm && (
        <section className="cow-card" style={{ marginBottom: "24px" }}>
          <div className="card-header-row">
            <h2>{isEditing ? "Edit Expense Entry" : "Add New Expense"}</h2>
            <button onClick={handleCancel} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="cow-form-grid">
              <div className="cow-field">
                <label>Expense Date *</label>
                <input
                  type="date"
                  name="expense_date"
                  value={formData.expense_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cow-field">
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

              <div className="cow-field">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="e.g. 1200"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cow-field">
                <label>Payment Mode *</label>
                <select
                  name="payment_mode"
                  value={formData.payment_mode}
                  onChange={handleChange}
                  required
                >
                  {paymentModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cow-field cow-field-full">
                <label>Description / Notes</label>
                <textarea
                  name="description"
                  placeholder="Vendor name or expense purpose..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>

            <div className="form-action-row" style={{ marginTop: "16px" }}>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Check size={16} /> {isEditing ? "Save Changes" : "Save Expense"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Expense Records Table */}
      <section className="cow-card">
        <div className="cow-table-toolbar">
          <h2>Recorded Expenses ({expenses.length})</h2>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search category, payment, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p style={{ padding: "20px", color: "#666" }}>Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="empty-message">
            {search ? "No expenses match your search." : "No expenses recorded yet."}
          </p>
        ) : (
          <div className="cow-table-wrap">
            <table className="cow-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Notes</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.expense_id}>
                    <td>{String(exp.expense_date).slice(0, 10)}</td>
                    <td className="font-medium">{exp.category}</td>
                    <td className="font-semibold text-green">
                      ₹{Number(exp.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td>{exp.payment_mode}</td>
                    <td className="notes-col text-muted">{exp.description || "—"}</td>
                    <td>
                      <div className="td-actions">
                        <button
                          type="button"
                          className="action-btn action-edit"
                          onClick={() => handleEdit(exp)}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="action-btn action-delete"
                          onClick={() => handleDelete(exp.expense_id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
