import { useEffect, useState } from "react";
import { getMilkRecords, addMilkRecord, deleteMilkRecord } from "../services/milkService";

export default function MilkPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Monthly filter: defaults to current YYYY-MM (e.g. 2026-11)
    const currentYearMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);

    // Form state with amount field
    const [formData, setFormData] = useState({
        record_date: new Date().toISOString().split("T")[0],
        session: "Morning",
        quantity: "",
        amount: "",
        notes: ""
    });

    const loadRecords = async () => {
        try {
            setLoading(true);
            const res = await getMilkRecords();
            if (res.success) {
                setRecords(res.data || []);
            }
        } catch (err) {
            setMessage("Failed to load records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await addMilkRecord(formData);
            if (res.success) {
                setMessage("Milk record added successfully!");
                setFormData({
                    record_date: new Date().toISOString().split("T")[0],
                    session: "Morning",
                    quantity: "",
                    amount: "",
                    notes: ""
                });
                loadRecords();
            } else {
                setMessage(res.message || "Failed to add record");
            }
        } catch (err) {
            setMessage(err.message || "Error saving record");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            const res = await deleteMilkRecord(id);
            if (res.success) {
                setMessage("Record deleted successfully.");
                setRecords(records.filter((r) => r.record_id !== id));
            } else {
                setMessage(res.message || "Delete failed");
            }
        } catch (err) {
            setMessage("Error deleting record");
        }
    };

    // Filter records for the selected month
    const monthlyRecords = records.filter((r) =>
        String(r.record_date).startsWith(selectedMonth)
    );

    // Calculate monthly totals
    const monthlyLitres = monthlyRecords.reduce((sum, r) => sum + Number(r.quantity || 0), 0);
    const monthlyAmount = monthlyRecords.reduce((sum, r) => sum + Number(r.amount || 0), 0);

    return (
        <div style={{ padding: "25px", maxWidth: "1000px", margin: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                    <h1 style={{ color: "#173d32", margin: 0 }}>Milk Production</h1>
                    <p style={{ color: "#666", margin: "4px 0 0" }}>Daily milking records and monthly income</p>
                </div>

                {/* Simple Month Selector */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "bold" }}>Filter Month:</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                </div>
            </div>

            {message && (
                <div style={{ padding: "10px 15px", background: "#e8f5e9", color: "#2e7d32", marginBottom: "15px", borderRadius: "6px" }}>
                    {message}
                </div>
            )}

            {/* Monthly Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "25px" }}>
                <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderLeft: "5px solid #0284c7" }}>
                    <span style={{ color: "#666", fontSize: "13px" }}>Monthly Milk ({selectedMonth})</span>
                    <h2 style={{ color: "#173d32", margin: "6px 0 0" }}>
                        {monthlyLitres.toFixed(1)} <span style={{ fontSize: "15px", fontWeight: "normal" }}>Litres</span>
                    </h2>
                </div>

                <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderLeft: "5px solid #15803d" }}>
                    <span style={{ color: "#666", fontSize: "13px" }}>Monthly Milk Income ({selectedMonth})</span>
                    <h2 style={{ color: "#15803d", margin: "6px 0 0" }}>
                        ₹{monthlyAmount.toLocaleString("en-IN")}
                    </h2>
                </div>
            </div>

            {/* Add Record Form */}
            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", marginBottom: "25px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                <h3 style={{ marginBottom: "15px", color: "#173d32" }}>+ Log New Milking</h3>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", alignItems: "end" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px" }}>Date *</label>
                        <input
                            type="date"
                            name="record_date"
                            value={formData.record_date}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px" }}>Session *</label>
                        <select
                            name="session"
                            value={formData.session}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
                        >
                            <option value="Morning">Morning</option>
                            <option value="Evening">Evening</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px" }}>Quantity (Litres) *</label>
                        <input
                            type="number"
                            step="0.1"
                            name="quantity"
                            placeholder="e.g. 15.5"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px" }}>Amount (₹)</label>
                        <input
                            type="number"
                            step="1"
                            name="amount"
                            placeholder="e.g. 620"
                            value={formData.amount}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px" }}>Notes</label>
                        <input
                            type="text"
                            name="notes"
                            placeholder="Optional notes"
                            value={formData.notes}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            style={{ width: "100%", padding: "9px 16px", background: "#173d32", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                        >
                            Save Record
                        </button>
                    </div>
                </form>
            </div>

            {/* Milk Records Table */}
            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                <h3 style={{ marginBottom: "15px", color: "#173d32" }}>
                    Milk Records for {selectedMonth} ({monthlyRecords.length})
                </h3>

                {loading ? (
                    <p>Loading...</p>
                ) : monthlyRecords.length === 0 ? (
                    <p style={{ color: "#777" }}>No milk records found for this month.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8f9fa", textAlign: "left", borderBottom: "2px solid #e9ecef" }}>
                                <th style={{ padding: "10px" }}>Date</th>
                                <th style={{ padding: "10px" }}>Session</th>
                                <th style={{ padding: "10px" }}>Quantity (L)</th>
                                <th style={{ padding: "10px" }}>Amount (₹)</th>
                                <th style={{ padding: "10px" }}>Notes</th>
                                <th style={{ padding: "10px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyRecords.map((r) => (
                                <tr key={r.record_id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "10px" }}>{String(r.record_date).slice(0, 10)}</td>
                                    <td style={{ padding: "10px" }}>
                                        <span style={{
                                            padding: "3px 8px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            background: r.session === "Morning" ? "#fff3cd" : "#e2e3e5",
                                            color: r.session === "Morning" ? "#856404" : "#383d41"
                                        }}>
                                            {r.session}
                                        </span>
                                    </td>
                                    <td style={{ padding: "10px", fontWeight: "bold", color: "#0284c7" }}>
                                        {Number(r.quantity).toFixed(1)} L
                                    </td>
                                    <td style={{ padding: "10px", fontWeight: "bold", color: "#15803d" }}>
                                        {Number(r.amount) > 0 ? `₹${Number(r.amount).toLocaleString("en-IN")}` : "—"}
                                    </td>
                                    <td style={{ padding: "10px", color: "#666" }}>{r.notes || "—"}</td>
                                    <td style={{ padding: "10px" }}>
                                        <button
                                            onClick={() => handleDelete(r.record_id)}
                                            style={{ padding: "4px 10px", background: "#f8d7da", color: "#721c24", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
