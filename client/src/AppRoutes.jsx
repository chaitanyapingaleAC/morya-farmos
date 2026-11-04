
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ExpensePage from "./pages/ExpensePage.jsx";
import CowForm from "./components/CowForm.jsx";
import CowList from "./components/CowList.jsx";
import MainLayout from "./components/MainLayout.jsx";
import BreedingPage from "./pages/BreedingPage.jsx";

function CowPage() {
  return (
    <div className="dashboard-page">
      <h1>Cow Management</h1>
      <CowForm />
      <hr />
      <CowList />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cows" element={<CowPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/breeding" element={<BreedingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
