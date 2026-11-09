import { Navigate } from "react-router-dom";

// ProtectedRoute: Verifies authentication token and user role.
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = sessionStorage.getItem("authToken");
  const userRole = sessionStorage.getItem("userRole");

  // 1. Not logged in -> Redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check role authorization if restricted to specific roles
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If admin tries to access farm user pages, send to admin panel
    if (userRole === "admin") {
      return <Navigate to="/admin/farms" replace />;
    }
    // If regular user tries to access admin pages, send to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
