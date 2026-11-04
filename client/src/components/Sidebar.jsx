
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    List,
    Wallet,
    Milk,
    Heart,
    FileText,
    Settings
} from "lucide-react";
import CowForm from "./CowForm";

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* Application logo and name */}
            <div className="sidebar-brand">
                <h2>Morya</h2>
                <p>FarmCare</p>
            </div>

            {/* Main navigation links */}
            <nav className="sidebar-nav">

                <NavLink to="/dashboard" className="sidebar-link">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/cows" className="sidebar-link">
                    <List size={20} />
                    <span>Cow Management</span>
                </NavLink>

                <NavLink to="/expenses" className="sidebar-link">
                    <Wallet size={20} />
                    <span>Expense Management</span>
                </NavLink>

                

                {/* Features planned for future development */}
                <div className="sidebar-section-title">
                    MORE FEATURES
                </div>

                <div className="sidebar-link sidebar-disabled">
                    <Milk size={20} />
                    <span>Milk Production</span>
                    <small>Soon</small>
                </div>

                <NavLink to="/breeding" className="sidebar-link">
    <Heart size={20} />
    <span>Breeding Management</span>
</NavLink>

                <div className="sidebar-link sidebar-disabled">
                    <FileText size={20} />
                    <span>Reports</span>
                    <small>Soon</small>
                </div>

                <div className="sidebar-link sidebar-disabled">
                    <Settings size={20} />
                    <span>Settings</span>
                    <small>Soon</small>
                </div>

            </nav>
        </aside>
    );
}

export default Sidebar;
