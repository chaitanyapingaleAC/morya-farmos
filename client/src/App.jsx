
import { Routes, Route, Navigate } from "react-router-dom";

import CowForm from "./components/CowForm";
import CowList from "./components/CowList";
import ExpensePage from "./pages/ExpensePage";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/MainLayout";

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

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cows" element={<CowPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
      </Route>
    </Routes>
  );
}
