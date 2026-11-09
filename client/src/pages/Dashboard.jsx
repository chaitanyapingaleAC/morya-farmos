import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, Wallet, Plus, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [cows, setCows] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [cowRes, expRes] = await Promise.all([
          fetch("http://localhost:5000/api/cows", { headers }),
          fetch("http://localhost:5000/api/expenses", { headers })
        ]);

        if (cowRes.ok) {
          const cowData = await cowRes.json();
          setCows(Array.isArray(cowData) ? cowData : []);
        }

        if (expRes.ok) {
          const expData = await expRes.json();
          setExpenses(expData.data || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate total expense amount
  const totalExpenseAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  if (loading) {
    return <p style={{ padding: "30px", color: "#666" }}>Loading farm overview...</p>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      {/* Header and Quick Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div>
          <h1 style={{ color: "#173d32", margin: 0, fontSize: "26px" }}>Farm Overview Dashboard</h1>
          <p style={{ color: "#666", margin: "4px 0 0", fontSize: "14px" }}>
            Summary of your cattle herd and farm expenses
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            to="/cows"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#173d32",
              color: "#fff",
              padding: "9px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "600"
            }}
          >
            <Plus size={16} /> Manage Cattle
          </Link>
          <Link
            to="/expenses"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#4f46e5",
              color: "#fff",
              padding: "9px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "600"
            }}
          >
            <Plus size={16} /> Manage Expenses
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
          marginBottom: "28px"
        }}
      >
        {/* Total Cattle Card */}
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            borderLeft: "5px solid #173d32"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>Total Cattle</span>
            <List size={22} color="#173d32" />
          </div>
          <h2 style={{ color: "#173d32", margin: "10px 0 0", fontSize: "28px" }}>
            {cows.length} <span style={{ fontSize: "16px", fontWeight: "normal", color: "#666" }}>Cows</span>
          </h2>
        </div>

        {/* Total Expenses Card */}
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            borderLeft: "5px solid #b91c1c"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>Total Expenses</span>
            <Wallet size={22} color="#b91c1c" />
          </div>
          <h2 style={{ color: "#b91c1c", margin: "10px 0 0", fontSize: "28px" }}>
            ₹{totalExpenseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Total Expense Records Card */}
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            borderLeft: "5px solid #4f46e5"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>Expense Entries</span>
            <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "3px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
              Active
            </span>
          </div>
          <h2 style={{ color: "#4f46e5", margin: "10px 0 0", fontSize: "28px" }}>
            {expenses.length} <span style={{ fontSize: "16px", fontWeight: "normal", color: "#666" }}>Records</span>
          </h2>
        </div>
      </div>

      {/* Side-by-Side Recent Records Tables */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px"
        }}
      >
        {/* Recent Cows */}
        <div
          style={{
            background: "#ffffff",
            padding: "22px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}
          >
            <h3 style={{ color: "#173d32", margin: 0, fontSize: "17px" }}>Registered Cattle ({cows.length})</h3>
            <Link
              to="/cows"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#173d32",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {cows.length === 0 ? (
            <p style={{ color: "#777", fontSize: "14px" }}>No cattle registered yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", textAlign: "left", color: "#555" }}>
                  <th style={{ padding: "9px" }}>Tag / ID</th>
                  <th style={{ padding: "9px" }}>Name</th>
                  <th style={{ padding: "9px" }}>Breed</th>
                  <th style={{ padding: "9px" }}>Birth Date</th>
                </tr>
              </thead>
              <tbody>
                {cows.slice(0, 5).map((cow) => (
                  <tr key={cow.cow_id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "9px", fontWeight: "bold", color: "#173d32" }}>
                      #{cow.cow_id}
                    </td>
                    <td style={{ padding: "9px" }}>{cow.cow_name}</td>
                    <td style={{ padding: "9px", color: "#666" }}>{cow.breed || "—"}</td>
                    <td style={{ padding: "9px", color: "#666" }}>
                      {cow.date_of_birth ? String(cow.date_of_birth).slice(0, 10) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Expenses */}
        <div
          style={{
            background: "#ffffff",
            padding: "22px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}
          >
            <h3 style={{ color: "#173d32", margin: 0, fontSize: "17px" }}>Recent Expenses ({expenses.length})</h3>
            <Link
              to="/expenses"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#4f46e5",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {expenses.length === 0 ? (
            <p style={{ color: "#777", fontSize: "14px" }}>No expenses recorded yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", textAlign: "left", color: "#555" }}>
                  <th style={{ padding: "9px" }}>Date</th>
                  <th style={{ padding: "9px" }}>Category</th>
                  <th style={{ padding: "9px" }}>Payment</th>
                  <th style={{ padding: "9px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 5).map((exp) => (
                  <tr key={exp.expense_id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "9px" }}>
                      {String(exp.expense_date).slice(0, 10)}
                    </td>
                    <td style={{ padding: "9px" }}>{exp.category}</td>
                    <td style={{ padding: "9px", color: "#666" }}>{exp.payment_mode}</td>
                    <td style={{ padding: "9px", fontWeight: "bold", color: "#b91c1c" }}>
                      ₹{Number(exp.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
