import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles, UserCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form submit handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save token and user role in session storage
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("userRole", data.user?.role || "user");
        sessionStorage.setItem("userName", data.user?.full_name || "User");

        // Route by role: admin goes to AdminFarms, farm user goes to Dashboard
        if (data.user?.role === "admin") {
          navigate("/admin/farms", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to fill Admin credentials
  const fillAdminAccount = () => {
    setEmail("admin@morya.com");
    setPassword("Password1234!");
    setError("");
  };

  // Helper to fill Farm Owner credentials
  const fillOwnerAccount = () => {
    setEmail("owner@morya.com");
    setPassword("Password1234!");
    setError("");
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-circle">
            <ShieldCheck size={30} />
          </div>
          <h1>Morya FarmCare</h1>
          <p>Dairy Farm Management System</p>
        </div>

        {/* Demo Credentials Helpers */}
        <div className="demo-helper-box">
          <div className="demo-helper-text">
            <Sparkles size={14} className="sparkle-icon" />
            <span>Quick Demo Credentials:</span>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <button
              type="button"
              onClick={fillOwnerAccount}
              className="demo-fill-btn"
              title="Login as Farm Owner"
            >
              Farm Owner
            </button>
            <button
              type="button"
              onClick={fillAdminAccount}
              className="demo-fill-btn"
              style={{ background: "#1e3a8a", borderColor: "#1e3a8a" }}
              title="Login as Super Admin"
            >
              Super Admin
            </button>
          </div>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group-login">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={17} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="e.g. admin@morya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group-login">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={17} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            <span>{loading ? "Signing in..." : "Sign In to FarmCare"}</span>
            <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
