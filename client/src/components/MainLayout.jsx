
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function MainLayout() {
    return (
        <div className="main-layout">

            {/* Sidebar navigation stays visible on every page */}
            <Sidebar />

            {/* The selected route's page appears here */}
            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}

export default MainLayout;

