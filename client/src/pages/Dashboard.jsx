
import { useEffect, useState } from "react";

function Dashboard() {
    // Stores dashboard information fetched from the backend.
    const [cowCount, setCowCount] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [recentExpenses, setRecentExpenses] = useState([]);

    // Handles loading and error messages.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetches cow and expense data when the dashboard opens.
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Both API requests run together to save time.
                const [cowResponse, expenseResponse] =
                    await Promise.all([
                        fetch("http://localhost:5000/api/cows"),
                        fetch("http://localhost:5000/api/expenses")
                    ]);

                if (!cowResponse.ok || !expenseResponse.ok) {
                    throw new Error("Failed to load dashboard data");
                }

                const cows = await cowResponse.json();
                const expenseResult = await expenseResponse.json();

                // Cow API returns an array; expense API returns data inside { success, data }.
                const expenses = expenseResult.data || [];

                // Calculates the total number of cows.
                setCowCount(cows.length);

                // Calculates the total expense amount.
                const total = expenses.reduce(
                    (sum, expense) => sum + Number(expense.amount),
                    0
                );

                setTotalExpenses(total);

                // Displays only the five most recent expenses.
                setRecentExpenses(expenses.slice(0, 5));

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Displays a message while API data is loading.
    if (loading) {
        return <p className="dashboard-message">Loading dashboard...</p>;
    }

    // Displays an error if the API request fails.
    if (error) {
        return <p className="dashboard-message dashboard-error">Error: {error}</p>;
    }

    return (
        <div className="dashboard-page">
            {/* Dashboard heading */}
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome to Morya FarmCare</p>
            </div>

            {/* Summary cards showing actual backend data */}
            <div className="dashboard-summary">
                <div className="dashboard-card">
                    <h3>Total Cows</h3>
                    <p className="dashboard-card-value">{cowCount}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Expenses</h3>
                    <p className="dashboard-card-value">
                        {totalExpenses.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR"
                        })}
                    </p>
                </div>
            </div>

            {/* Recent expense records */}
            <div className="dashboard-recent">
                <h2>Recent Expenses</h2>

                {recentExpenses.length === 0 ? (
                    <p className="dashboard-message">
                        No expenses recorded yet.
                    </p>
                ) : (
                    <div className="dashboard-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Payment Mode</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentExpenses.map((expense) => (
                                    <tr key={expense.expense_id}>
                                        <td>{expense.expense_date}</td>
                                        <td>{expense.category}</td>
                                        <td>₹{expense.amount}</td>
                                        <td>{expense.payment_mode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
