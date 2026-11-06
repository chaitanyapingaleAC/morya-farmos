import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Milk, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    if (event) event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      sessionStorage.setItem("authToken", data.token);
      window.dispatchEvent(new Event("auth-changed"));

      if (data.user?.role === "admin") {
        navigate("/admin/farms", { replace: true });
      } else if (data.user?.role === "user") {
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Unknown account role.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail("owner@morya.com");
    setPassword("Password1234!");
    setError("");
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card-container">
        {/* Brand header */}
        <div className="login-header">
          <div className="login-logo-circle">
            <Milk size={30} />
          </div>
          <h1>Morya FarmCare</h1>
          <p>Dairy Farm Operating System</p>
        </div>

        {/* Demo Quick-Fill Pill */}
        <div className="demo-helper-box">
          <div className="demo-helper-text">
            <Sparkles size={14} className="sparkle-icon" />
            <span>Need sample credentials?</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="demo-fill-btn"
          >
            Fill Demo Account
          </button>
        </div>

        {error && (
          <div className="login-error-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group-login">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={17} className="input-icon" />
              <input
                id="login-email"
                type="email"
                placeholder="e.g. owner@morya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group-login">
            <label htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <Lock size={17} className="input-icon" />
              <input
                id="login-password"
                type="password"
                placeholder="Enter account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                <span>Sign In to Farm</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="security-note">
            <ShieldCheck size={14} />
            <span>Protected with JWT & Role-Based Farm Isolation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
