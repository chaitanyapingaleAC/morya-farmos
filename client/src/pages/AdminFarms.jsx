import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Plus, LogOut, Check, Building, RefreshCw } from "lucide-react";
import "./AdminFarms.css";

export default function AdminFarms() {
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const initialFormState = {
    farm_name: "",
    full_name: "",
    email: "",
    password: ""
  };
  const [form, setForm] = useState(initialFormState);

  // Helper for auth headers
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
  });

  // 1. Fetch all registered farms
  const fetchFarms = async () => {
    setLoadingFarms(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/farms", {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFarms(data.farms || []);
      } else {
        setError(data.message || "Failed to load farms");
      }
    } catch (err) {
      setError("Unable to connect to server to load farms.");
    } finally {
      setLoadingFarms(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  // 2. Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. Create a new farm and assign owner credentials
  const handleCreateFarm = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(`Farm "${form.farm_name}" created successfully!`);
        setForm(initialFormState);
        fetchFarms();
      } else {
        setError(data.message || "Failed to create farm.");
      }
    } catch (err) {
      setError("Error creating farm: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Logout admin
  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ maxWidth: 950, margin: "30px auto", padding: "0 20px" }}>
      {/* Admin Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "1px solid #e2e8f0"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: "#1e3a8a",
              color: "#fff",
              width: 38,
              height: 38,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 style={{ color: "#1e3a8a", margin: 0, fontSize: "22px" }}>
              Morya FarmCare — Super Admin
            </h1>
            <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "13px" }}>
              Multi-farm administration and farm owner onboarding
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#fee2e2",
            color: "#b91c1c",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer"
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div
          style={{
            background: "#ecfdf5",
            color: "#065f46",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #a7f3d0",
            marginBottom: 20,
            fontSize: "14px"
          }}
        >
          ✓ {message}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fef2f2",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #fecaca",
            marginBottom: 20,
            fontSize: "14px"
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Create New Farm Card */}
      <section
        style={{
          background: "#ffffff",
          padding: 24,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          marginBottom: 28,
          border: "1px solid #e2e8f0"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Plus size={20} color="#1e3a8a" />
          <h2 style={{ color: "#1e3a8a", margin: 0, fontSize: "18px" }}>Create New Farm</h2>
        </div>
        <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 16px" }}>
          Register a new farm entity and create the owner credentials (minimum 12 characters password).
        </p>

        <form onSubmit={handleCreateFarm}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
              marginBottom: 16
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: 5 }}>
                Farm Name *
              </label>
              <input
                type="text"
                name="farm_name"
                placeholder="e.g. Morya Green Valley"
                value={form.farm_name}
                onChange={handleChange}
                required
                maxLength={100}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: 5 }}>
                Owner Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                placeholder="e.g. Ramesh Patil"
                value={form.full_name}
                onChange={handleChange}
                required
                maxLength={100}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: 5 }}>
                Owner Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. ramesh@farm.com"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: 5 }}>
                Owner Password (min 12 chars) *
              </label>
              <input
                type="password"
                name="password"
                placeholder="e.g. FarmPass1234!"
                value={form.password}
                onChange={handleChange}
                minLength={12}
                required
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#1e3a8a",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "14px",
              cursor: submitting ? "not-allowed" : "pointer"
            }}
          >
            <Check size={16} /> {submitting ? "Creating Farm..." : "Create Farm Account"}
          </button>
        </form>
      </section>

      {/* Existing Farms List */}
      <section
        style={{
          background: "#ffffff",
          padding: 24,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Building size={20} color="#1e3a8a" />
            <h2 style={{ color: "#1e3a8a", margin: 0, fontSize: "18px" }}>
              Registered Farms ({farms.length})
            </h2>
          </div>

          <button
            onClick={fetchFarms}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loadingFarms ? (
          <p style={{ color: "#64748b", fontSize: "14px" }}>Loading farms...</p>
        ) : farms.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "14px" }}>No farms created yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "14px"
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px" }}>Farm ID</th>
                  <th style={{ padding: "10px" }}>Farm Name</th>
                  <th style={{ padding: "10px" }}>Owner Name</th>
                  <th style={{ padding: "10px" }}>Owner Email</th>
                </tr>
              </thead>
              <tbody>
                {farms.map((farm) => (
                  <tr key={farm.farm_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px", fontWeight: "bold", color: "#1e3a8a" }}>
                      #{farm.farm_id}
                    </td>
                    <td style={{ padding: "10px", fontWeight: 500 }}>{farm.farm_name}</td>
                    <td style={{ padding: "10px", color: "#334155" }}>
                      {farm.owner_name || "Unassigned"}
                    </td>
                    <td style={{ padding: "10px", color: "#64748b" }}>
                      {farm.owner_email || "—"}
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
