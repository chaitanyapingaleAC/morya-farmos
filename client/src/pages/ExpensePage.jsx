
import { useEffect, useState } from "react";

// Import API functions to communicate with the Express backend
// Import API functions for expense CRUD operations
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

// Import the Add Expense form component
import AddExpenseForm from "../components/AddExpenseForm";

function ExpensePage() {
  // Stores all expense records received from MySQL
  const [expenses, setExpenses] = useState([]);

  // Controls the loading message while fetching records
  const [loading, setLoading] = useState(true);

  // Stores error messages if an API request fails
  const [error, setError] = useState("");

  // Controls whether the Add Expense form is visible
  const [showForm, setShowForm] = useState(false);


    // Stores the expense currently selected for editing.
    // null means we are adding a new expense.
    const [editingExpense, setEditingExpense] = useState(null);





  // Fetch expenses automatically when the page first opens
  useEffect(() => {
    loadExpenses();
  }, []);

  // Function to fetch all expense records from the backend
  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getExpenses();

      // Update the expense list if the API request succeeds
      if (result.success) {
        setExpenses(result.data);
      } else {
        setError("Unable to load expenses.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Function called when the user submits the Add Expense form
  const handleAddExpense = async (expenseData) => {
    try {
      // Send new expense details to the backend
      const result = await addExpense(expenseData);

      if (result.success) {
        // Close the form after successful saving
        setShowForm(false);

        // Fetch the updated list from MySQL
        await loadExpenses();
      } else {
        throw new Error(result.message || "Failed to save expense.");
      }
    } catch (err) {
      // Send the error back to the form so it can display it
      throw err;
    }
  };





    // Update an existing expense in the MySQL database
    const handleUpdateExpense = async (expenseData) => {
    try {
        // Send updated details using the expense ID
        const result = await updateExpense(
        editingExpense.expense_id,
        expenseData
        );

        if (result.success) {
        // Close the form and clear the selected expense
        setShowForm(false);
        setEditingExpense(null);

        // Reload the expense list with updated information
        await loadExpenses();
        } else {
        throw new Error(result.message || "Failed to update expense.");
        }
    } catch (err) {
        throw err;
    }
    };


        // Open the form with the selected expense details
    const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
    };



    // Delete an expense from the MySQL database
    const handleDeleteExpense = async (expenseId) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm(
        "Are you sure you want to delete this expense?"
    );

    // Stop if the user cancels
    if (!confirmed) return;

    try {
        // Send the delete request to the backend
        const result = await deleteExpense(expenseId);

        if (result.success) {
        // Refresh the dashboard after deletion
        await loadExpenses();

        alert("Expense deleted successfully!");
        } else {
        throw new Error(result.message || "Failed to delete expense.");
        }
    } catch (err) {
        alert(err.message || "Something went wrong while deleting.");
    }
    };


  // Calculate the total amount of all expense records
  const totalAmount = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  return (
    <div className="expense-page">

      {/* Page heading and Add Expense button */}
      <div className="expense-header">
        <div>
          <h1>Expense Management</h1>
          <p>Manage and track your dairy farm expenses.</p>
        </div>

        {/* Open the Add Expense form when clicked */}
        <button
          className="add-expense-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Expense
        </button>
      </div>

      {/* Summary cards showing total amount and record count */}
      <div className="expense-summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <h2>
            ₹
            {totalAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="summary-card">
          <h3>Total Records</h3>
          <h2>{expenses.length}</h2>
        </div>
      </div>

      {/* Expense records table */}
      <div className="expense-table-section">
        <h2>Expense Records</h2>

        {/* Show loading message while fetching data */}
        {loading && <p>Loading expenses...</p>}

        {/* Show error if fetching fails */}
        {error && <p className="error-message">{error}</p>}

        {/* Show message if there are no records */}
        {!loading && !error && expenses.length === 0 && (
          <p>No expenses found. Add your first expense!</p>
        )}

        {/* Display all expense records */}
        {!loading && !error && expenses.length > 0 && (
          <div className="table-container">
            <table className="expense-table">
             

             
                {/* Table headings for expense information and available actions */}
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
                    <td>
                      {String(expense.expense_date).slice(0, 10)}
                    </td>
                    <td>{expense.category}</td>
                    <td>
                      ₹
                      {Number(expense.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{expense.payment_mode}</td>
                    <td>{expense.description || "-"}</td>
                    
                    {/* Actions available for this particular expense */}
                  
                      {/* Edit and Delete buttons for each expense */}
                        <td>
                        {/* Edit button */}
                        <button
                            className="edit-btn"
                            onClick={() => handleEditClick(expense)}
                        >
                            Edit
                        </button>

                        {/* Delete button */}
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

     
            {/* Show the same form for both adding and editing expenses */}
        {showForm && (
        <AddExpenseForm
            // Use update function when editing, otherwise use add function
            onSave={editingExpense ? handleUpdateExpense : handleAddExpense}

            // Send selected expense details to the form for editing
            editingExpense={editingExpense}

            // Close the form and clear the selected expense when cancelled
            onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
            }}
        />
        )}

    </div>
  );
}

export default ExpensePage;
