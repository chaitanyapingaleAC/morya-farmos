import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
    const [cows, setCows] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [milkRecords, setMilkRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    // Monthly selector (default: current YYYY-MM, e.g. 2026-11)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = sessionStorage.getItem("authToken");
                const headers = { Authorization: `Bearer ${token}` };

                const [cowRes, expRes, milkRes] = await Promise.all([
                    fetch("http://localhost:5000/api/cows", { headers }),
                    fetch("http://localhost:5000/api/expenses", { headers }),
                    fetch("http://localhost:5000/api/milk", { headers }).catch(() => null)
                ]);

                if (cowRes.ok) {
                    const cowData = await cowRes.json();
                    setCows(Array.isArray(cowData) ? cowData : []);
                }

                if (expRes.ok) {
                    const expData = await expRes.json();
                    setExpenses(expData.data || []);
                }

                if (milkRes && milkRes.ok) {
                    const milkData = await milkRes.json();
                    setMilkRecords(milkData.data || []);
                }
            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // Filter by selected month
    const monthlyMilk = milkRecords.filter((m) =>
        String(m.record_date).startsWith(selectedMonth)
    );
    const monthlyExpenses = expenses.filter((e) =>
        String(e.expense_date).startsWith(selectedMonth)
    );

    // Calculate monthly totals
    const totalMilkLitres = monthlyMilk.reduce((sum, m) => sum + Number(m.quantity || 0), 0);
    const totalMilkIncome = monthlyMilk.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const totalExpenseAmount = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const netProfit = totalMilkIncome - totalExpenseAmount;

    if (loading) return <p style={{ padding: "20px" }}>Loading dashboard...</p>;

    return (
        <div style={{ padding: "25px", maxWidth: "1200px", margin: "auto" }}>
            {/* Header + Month Selector */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                    <h1 style={{ color: "#173d32", margin: 0 }}>Monthly Farm Dashboard</h1>
                    <p style={{ color: "#666", margin: "4px 0 0" }}>Monthly production, income, and expenditure</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", padding: "6px 12px", borderRadius: "8px", border: "1px solid #ccc" }}>
                        <span style={{ fontSize: "13px", fontWeight: "bold" }}>Select Month:</span>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: "bold", color: "#173d32" }}
                        />
                    </div>

                    <Link to="/milk" style={{ background: "#0284c7", color: "#fff", padding: "8px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "bold" }}>
                        + Log Milk
                    </Link>
                    <Link to="/expenses" style={{ background: "#4f46e5", color: "#fff", padding: "8px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "bold" }}>
                        + Add Expense
                    </Link>
                </div>
            </div>

            {/* Monthly KPI Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "25px" }}>
                {/* Total Cows */}
                <div style={{ background: "#ffffff", padding: "18px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderLeft: "5px solid #173d32" }}>
                    <span style={{ color: "#666", fontSize: "13px" }}>Total Cattle</span>
                    <h2 style={{ color: "#173d32", margin: "6px 0 0" }}>{cows.length} Cows</h2>
                </div>

                {/* Monthly Milk Yield */}
                <div style={{ background: "#ffffff", padding: "18px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderLeft: "5px solid #0284c7" }}>
                    <span style={{ color: "#666", fontSize: "13px" }}>Milk Yield ({selectedMonth})</span>
                    <h2 style={{ color: "#0284c7", margin: "6px 0 0" }}>{totalMilkLitres.toFixed(1)} L</h2>
                </div>

                {/* Monthly Milk Income */}
                <div style={{ background: "#ffffff", padding: "18px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderLeft: "5px solid #15803d" }}>
                    <span style={{ color: "#666", fontSize: "13px" }}>Milk Income ({selectedMonth})</span>
                    <h2 style={{ color: "#15803d", margin: "6px 0 0" }}>₹{totalMilkIncome.toLocaleString("en-IN")}</h2>
                </div>

                {/* Monthly Expenditure */}
                <div style={{ background: "#ffffff", padding: "18px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderLeft: "5px solid #b91c1c" }}>
                    <span style={{ color: "#666", fontSize: "13px" }}>Expenditure ({selectedMonth})</span>
                    <h2 style={{ color: "#b91c1c", margin: "6px 0 0" }}>₹{totalExpenseAmount.toLocaleString("en-IN")}</h2>
                </div>
            </div>

            {/* Monthly Profit / Loss Banner */}
            <div style={{
                background: netProfit >= 0 ? "#f0fdf4" : "#fef2f2",
                border: netProfit >= 0 ? "1px solid #86efac" : "1px solid #fca5a5",
                padding: "16px 20px",
                borderRadius: "10px",
                marginBottom: "25px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px"
            }}>
                <div>
                    <strong style={{ color: netProfit >= 0 ? "#166534" : "#991b1b", fontSize: "16px" }}>
                        {netProfit >= 0 ? "✓ Monthly Net Profit" : "⚠ Monthly Net Deficit"} ({selectedMonth})
                    </strong>
                    <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>
                        Milk Income (₹{totalMilkIncome.toLocaleString("en-IN")}) minus Expenditure (₹{totalExpenseAmount.toLocaleString("en-IN")})
                    </p>
                </div>
                <h2 style={{ color: netProfit >= 0 ? "#15803d" : "#b91c1c", margin: 0 }}>
                    {netProfit >= 0 ? "+" : ""}₹{netProfit.toLocaleString("en-IN")}
                </h2>
            </div>

            {/* Side-by-Side Monthly Tables */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                {/* Monthly Milk Records */}
                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    <h3 style={{ color: "#173d32", marginBottom: "12px" }}>
                        Milk Records for {selectedMonth} ({monthlyMilk.length})
                    </h3>
                    {monthlyMilk.length === 0 ? (
                        <p style={{ color: "#777", fontSize: "13px" }}>No milk records for this month.</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                                    <th style={{ padding: "8px" }}>Date</th>
                                    <th style={{ padding: "8px" }}>Session</th>
                                    <th style={{ padding: "8px" }}>Quantity</th>
                                    <th style={{ padding: "8px" }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyMilk.slice(0, 6).map((m) => (
                                    <tr key={m.record_id} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "8px" }}>{String(m.record_date).slice(0, 10)}</td>
                                        <td style={{ padding: "8px" }}>{m.session}</td>
                                        <td style={{ padding: "8px", fontWeight: "bold", color: "#0284c7" }}>
                                            {Number(m.quantity).toFixed(1)} L
                                        </td>
                                        <td style={{ padding: "8px", fontWeight: "bold", color: "#15803d" }}>
                                            ₹{Number(m.amount || 0).toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Monthly Expenses */}
                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    <h3 style={{ color: "#173d32", marginBottom: "12px" }}>
                        Expenses for {selectedMonth} ({monthlyExpenses.length})
                    </h3>
                    {monthlyExpenses.length === 0 ? (
                        <p style={{ color: "#777", fontSize: "13px" }}>No expenses for this month.</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                                    <th style={{ padding: "8px" }}>Date</th>
                                    <th style={{ padding: "8px" }}>Category</th>
                                    <th style={{ padding: "8px" }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyExpenses.slice(0, 6).map((e) => (
                                    <tr key={e.expense_id} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "8px" }}>{String(e.expense_date).slice(0, 10)}</td>
                                        <td style={{ padding: "8px" }}>{e.category}</td>
                                        <td style={{ padding: "8px", fontWeight: "bold", color: "#b91c1c" }}>
                                            ₹{Number(e.amount).toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
