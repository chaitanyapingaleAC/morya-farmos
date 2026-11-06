
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function verifyAuthentication() {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setStatus("unauthorized");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem("authToken");
          }
          throw new Error("Authentication failed");
        }

        const data = await response.json();

        if (!data.success || !data.user) {
          throw new Error("Invalid authentication response");
        }

        setUser(data.user);
        setStatus("authenticated");
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatus("unauthorized");
        }
      }
    }

    verifyAuthentication();

    return () => controller.abort();
  }, []);

  if (status === "checking") {
    return <p>Checking authentication...</p>;
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <p>403 - Access denied. Insufficient permissions.</p>;
  }

  return children;
}
