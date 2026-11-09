import { Shield, Wallet, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ padding: "30px 20px", maxWidth: "900px", margin: "auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <span
          style={{
            background: "#e8f5e9",
            color: "#166534",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold"
          }}
        >
          About Morya FarmCare
        </span>
        <h1 style={{ color: "#173d32", fontSize: "30px", marginTop: "12px", marginBottom: "8px" }}>
          Modern Dairy Farm Management
        </h1>
        <p style={{ color: "#666", fontSize: "15px", maxWidth: "600px", margin: "auto" }}>
          A simple, streamlined web platform designed to help dairy farmers track cattle records and monitor operational expenses.
        </p>
      </div>

      {/* Mission Card */}
      <div
        style={{
          background: "#ffffff",
          padding: "26px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          borderLeft: "5px solid #173d32",
          marginBottom: "30px"
        }}
      >
        <h2 style={{ color: "#173d32", fontSize: "20px", marginBottom: "10px" }}>Project Purpose</h2>
        <p style={{ color: "#4b5563", lineHeight: "1.7", fontSize: "15px" }}>
          Morya FarmCare replaces paper registers with a modern digital system.
          It provides a central location to record cattle details (such as tag numbers, names, breeds, and birth dates)
          along with comprehensive expense tracking for feed, medicines, and labor.
        </p>
      </div>

      {/* Key Features Grid */}
      <h2 style={{ color: "#173d32", fontSize: "20px", marginBottom: "16px" }}>Core Modules</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "35px"
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "#fef3c7",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px"
            }}
          >
            <Shield size={22} />
          </div>
          <h3 style={{ color: "#173d32", fontSize: "17px", marginBottom: "6px" }}>Cattle Management</h3>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
            Register cows with unique tag IDs, names, breeds, dates of birth, and notes. Update and search records at any time.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "#ecfdf5",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px"
            }}
          >
            <Wallet size={22} />
          </div>
          <h3 style={{ color: "#173d32", fontSize: "17px", marginBottom: "6px" }}>Expense Tracking</h3>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
            Log and categorize farm expenses such as cattle feed, veterinary bills, wages, and maintenance with multiple payment modes.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "#e0f2fe",
              color: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px"
            }}
          >
            <Sparkles size={22} />
          </div>
          <h3 style={{ color: "#173d32", fontSize: "17px", marginBottom: "6px" }}>Overview Dashboard</h3>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
            Instant high-level metrics for quick review, displaying current herd size, cumulative expenses, and recent activities.
          </p>
        </div>
      </div>
    </div>
  );
}
