import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

function MainLayout() {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-wrapper">
                <TopBar />
                <main className="main-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default MainLayout;
