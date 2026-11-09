import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Plus, X } from "lucide-react";

import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ExpensePage from "./pages/ExpensePage.jsx";
import CowForm from "./components/CowForm.jsx";
import CowList from "./components/CowList.jsx";
import MainLayout from "./components/MainLayout.jsx";
import AdminFarms from "./pages/AdminFarms.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

// Cow Management View: Contains header button, Add Cow form, and Cow Table
function CowPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="cow-page">
      <div className="cow-header">
        <div>
          <h1>Cow Management</h1>
          <p>Register, view, update, and manage your dairy farm herd.</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="btn-primary"
        >
          {showForm ? (
            <>
              <X size={17} /> Close Form
            </>
          ) : (
            <>
              <Plus size={17} /> Register New Cow
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <CowForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <CowList />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Super Admin Route */}
      <Route
        path="/admin/farms"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminFarms />
          </ProtectedRoute>
        }
      />

      {/* Farm Owner Application Routes */}
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

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
