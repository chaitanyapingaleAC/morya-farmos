import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CowPage from "./pages/CowPage.jsx";
import ExpensePage from "./pages/ExpensePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AdminFarms from "./pages/AdminFarms.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Super Admin Route (Only accessible by 'admin' role) */}
      <Route
        path="/admin/farms"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminFarms />
          </ProtectedRoute>
        }
      />

      {/* Farm Owner Application Pages (Only accessible by 'user' role) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cows" element={<CowPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
