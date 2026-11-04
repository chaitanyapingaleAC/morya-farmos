
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CowForm from "./components/CowForm";
import CowList from "./components/CowList";
import ExpensePage from "./pages/ExpensePage";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/MainLayout";

// Cow Management page
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

// Main application routing
function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* All main pages share the same sidebar layout */}
                <Route element={<MainLayout />}>

                    {/* Redirect home page to dashboard */}
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Cow Management */}
                    <Route path="/cows" element={<CowPage />} />

                    {/* Expense Management */}
                    <Route path="/expenses" element={<ExpensePage />} />

                </Route>

                {/* Redirect unknown URLs to dashboard */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
