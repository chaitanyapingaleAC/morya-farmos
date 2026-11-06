import { Info, CheckCircle, Heart, Milk, Shield, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div style={{ padding: "30px 20px", maxWidth: "1000px", margin: "auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "35px" }}>
                <span style={{ background: "#e8f5e9", color: "#166534", padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>
                    About Morya FarmCare
                </span>
                <h1 style={{ color: "#173d32", fontSize: "32px", marginTop: "12px", marginBottom: "8px" }}>
                     Modern Dairy Farming...
                </h1>
                <p style={{ color: "#666", fontSize: "16px", maxWidth: "600px", margin: "auto" }}>
                    A simple, all-in-one operating platform built to help dairy farmers track herd health, milk production, and farm finances.
                </p>
            </div>

            {/* Mission Card */}
            <div style={{ background: "#ffffff", padding: "28px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: "5px solid #173d32", marginBottom: "30px" }}>
                <h2 style={{ color: "#173d32", fontSize: "20px", marginBottom: "10px" }}>Our Mission</h2>
                <p style={{ color: "#4b5563", lineHeight: "1.7", fontSize: "15px" }}>
                    Morya FarmCare was created to replace traditional paper registers with a clean, easy-to-use digital solution. Our goal is to make daily dairy management effortless — from recording daily morning and evening milk yields to managing cattle records and calculating monthly net profit.
                </p>
            </div>

            {/* Key Features Grid */}
            <h2 style={{ color: "#173d32", fontSize: "22px", marginBottom: "18px" }}>What Morya FarmCare Offers</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "35px" }}>
                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                        <Milk size={22} />
                    </div>
                    <h3 style={{ color: "#173d32", fontSize: "17px", marginBottom: "6px" }}>Milk Production Tracking</h3>
                    <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                        Easily log morning and evening milk yields, track milk sales income, and view monthly production totals.
                    </p>
                </div>

                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                        <Shield size={22} />
                    </div>
                    <h3 style={{ color: "#173d32", fontSize: "17px", marginBottom: "6px" }}>Cattle Herd Records</h3>
                    <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                        Maintain comprehensive profiles for every cow with unique tags, breeds, birth dates, and health history.
                    </p>
                </div>

                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#fce7f3", color: "#db2777", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                        <Heart size={22} />
                    </div>
                    <h3 style={{ color: "#173d32", fontSize: "17px", marginBottom: "6px" }}>Breeding & Calving Alerts</h3>
                    <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                        Track insemination dates, pregnancy confirmation, and automatic countdown alerts for dry periods and calving.
                    </p>
                </div>

                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                        <CheckCircle size={22} />
                    </div>
                    <h3 style={{ color: "#173d32", fontSize: "17px", marginBottom: "6px" }}>Monthly Profit & Loss</h3>
                    <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                        Monitor expenses (feed, medicines, labor) against milk revenue to calculate real monthly farm profits.
                    </p>
                </div>
            </div>

           
        </div>
    );
}
