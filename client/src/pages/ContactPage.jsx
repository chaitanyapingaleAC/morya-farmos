import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div style={{ padding: "30px 20px", maxWidth: "700px", margin: "auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <span style={{ background: "#e8f5e9", color: "#166534", padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>
                    Get in Touch
                </span>
                <h1 style={{ color: "#173d32", fontSize: "28px", marginTop: "12px", marginBottom: "6px" }}>
                    Contact Morya FarmCare
                </h1>
                <p style={{ color: "#666", fontSize: "15px" }}>
                    Have questions about dairy management? We are here to help.
                </p>
            </div>

            {/* Contact Details Card */}
            <div style={{ background: "#ffffff", padding: "28px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}>
                <h2 style={{ color: "#173d32", fontSize: "20px", marginBottom: "20px" }}>Contact Details</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Phone */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Phone size={18} />
                        </div>
                        <div>
                            <strong style={{ color: "#1f2937", fontSize: "14px", display: "block" }}>Phone & WhatsApp</strong>
                            <span style={{ color: "#6b7280", fontSize: "14px" }}>+91 8530047419</span>
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Mail size={18} />
                        </div>
                        <div>
                            <strong style={{ color: "#1f2937", fontSize: "14px", display: "block" }}>Email Support</strong>
                            <span style={{ color: "#6b7280", fontSize: "14px" }}>chaitanya.pingale.cmaug26@gmail.com</span>
                        </div>
                    </div>

                    {/* Location */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#dcfce7", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <MapPin size={18} />
                        </div>
                        <div>
                            <strong style={{ color: "#1f2937", fontSize: "14px", display: "block" }}>Location</strong>
                            <span style={{ color: "#6b7280", fontSize: "14px" }}>Mory Dairy Farm Alephata, Pune, Maharashtra 412411</span>
                        </div>
                    </div>
                </div>

                {/* Support Hours */}
                <div style={{ marginTop: "25px", padding: "14px", background: "#f9fafb", borderRadius: "8px", borderLeft: "4px solid #173d32", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Clock size={16} style={{ color: "#173d32", flexShrink: 0 }} />
                    <div>
                        <strong style={{ fontSize: "13px", color: "#173d32", display: "block" }}>Support Hours</strong>
                        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>
                            Monday &ndash; Saturday: 7:00 AM &ndash; 8:00 PM IST
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
