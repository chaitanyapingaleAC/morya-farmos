import { useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, Sparkles } from "lucide-react";

export default function TopBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            sessionStorage.removeItem("authToken");
            window.dispatchEvent(new Event("auth-changed"));
            navigate("/login", { replace: true });
        }
    };

    const todayDate = new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    return (
        <header className="topbar">
            <div className="topbar-left">
                <span className="topbar-badge">
                    <Sparkles size={14} /> Dairy Operations
                </span>
                <span className="topbar-date">
                    <Calendar size={15} /> {todayDate}
                </span>
            </div>

            <div className="topbar-right">
                <div className="user-profile-badge">
                    <div className="user-avatar">
                        <User size={16} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">Farm Manager</span>
                        <span className="user-role">Owner Account</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="logout-button"
                    title="Log out of Morya FarmCare"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}
