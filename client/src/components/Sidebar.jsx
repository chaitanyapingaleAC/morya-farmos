import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    List,
    Milk,
    Heart,
    Wallet,
    Info,
    Mail,
    ShieldPlus,
    FileText,
    Settings
} from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            {/* Application brand */}
            <div className="sidebar-brand">
                <h2>Morya</h2>
                <p>FarmCare Dairy OS</p>
            </div>

            {/* Main Navigation Links */}
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className="sidebar-link">
                    <LayoutDashboard size={19} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/cows" className="sidebar-link">
                    <List size={19} />
                    <span>Cow Management</span>
                </NavLink>

                <NavLink to="/milk" className="sidebar-link">
                    <Milk size={19} />
                    <span>Milk Production</span>
                </NavLink>

                <NavLink to="/breeding" className="sidebar-link">
                    <Heart size={19} />
                    <span>Breeding Records</span>
                </NavLink>

                <NavLink to="/expenses" className="sidebar-link">
                    <Wallet size={19} />
                    <span>Expense Tracker</span>
                </NavLink>

                <NavLink to="/about" className="sidebar-link">
                    <Info size={19} />
                    <span>About Us</span>
                </NavLink>

                <NavLink to="/contact" className="sidebar-link">
                    <Mail size={19} />
                    <span>Contact Us</span>
                </NavLink>

                {/* Coming Soon Section */}
                <div className="sidebar-section-title">
                    COMING SOON
                </div>

                <div className="sidebar-link sidebar-disabled">
                    <ShieldPlus size={19} />
                    <span>Health & Vaccine</span>
                    <small>Soon</small>
                </div>

                <div className="sidebar-link sidebar-disabled">
                    <FileText size={19} />
                    <span>Reports & PDF</span>
                    <small>Soon</small>
                </div>

                <div className="sidebar-link sidebar-disabled">
                    <Settings size={19} />
                    <span>Settings</span>
                    <small>Soon</small>
                </div>
            </nav>
        </aside>
    );
}
