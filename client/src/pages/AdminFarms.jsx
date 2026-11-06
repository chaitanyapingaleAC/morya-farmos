
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminFarms.css";

export default function AdminFarms() {


    const [form, setForm] = useState({
        farm_name: "",
        full_name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [farms, setFarms] = useState([]);
    const [farmsLoading, setFarmsLoading] = useState(true);
    const [farmsError, setFarmsError] = useState("");



    const fetchFarms = async () => {
        setFarmsLoading(true);
        setFarmsError("");

        try {
            const token = sessionStorage.getItem("authToken");

            const response = await fetch(
                "http://localhost:5000/api/admin/farms",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch farms.");
            }

            setFarms(data.farms);
        } catch (err) {
            setFarmsError(err.message || "Unable to load farms.");
        } finally {
            setFarmsLoading(false);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);



    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreateFarm = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const token = sessionStorage.getItem("authToken");

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to create farm.");
            }

            setMessage(
                `Farm "${form.farm_name}" created successfully!`
            );
            fetchFarms();

            setForm({
                farm_name: "",
                full_name: "",
                email: "",
                password: "",
            });
        } catch (err) {
            setError(err.message || "Unable to create farm.");
        } finally {
            setLoading(false);
        }
    };



    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("authToken");
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/login", { replace: true });
    };

   return (
    <div
        className="admin-page"
        style={{ maxWidth: 900, margin: "40px auto", padding: 20 }} >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Morya FarmOS — Super Admin</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <h2>Farm Management</h2>

            <p>Welcome! Manage farms using Morya FarmOS.</p>

            <div
                style={{
                    background: "#ffffff",
                    padding: 25,
                    borderRadius: 12,
                    marginTop: 25,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <h3>Create New Farm</h3>
                <p>
                    Create a new dairy farm and provide login
                    credentials to its owner.
                </p>


                <form onSubmit={handleCreateFarm}>
                    <input
                        type="text"
                        name="farm_name"
                        placeholder="Farm Name"
                        value={form.farm_name}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />

                    <input
                        type="text"
                        name="full_name"
                        placeholder="Farm Owner Name"
                        value={form.full_name}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Farm Owner Email"
                        value={form.email}
                        onChange={handleChange}
                        maxLength={255}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Owner Password (minimum 12 characters)"
                        value={form.password}
                        onChange={handleChange}
                        minLength={12}
                        autoComplete="new-password"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Farm..." : "Create Farm"}
                    </button>

                    {message && <p style={{ color: "green" }}>{message}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>

            </div>

            <div
                style={{
                    background: "#ffffff",
                    padding: 25,
                    borderRadius: 12,
                    marginTop: 25,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <h3>Existing Farms</h3>

                {farmsLoading ? (
                    <p>Loading registered farms...</p>
                ) : farmsError ? (
                    <p role="alert" style={{ color: "red" }}>
                        {farmsError}
                    </p>
                ) : farms.length === 0 ? (
                    <p>No farms registered yet.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                textAlign: "left",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ padding: 10 }}>Farm ID</th>
                                    <th style={{ padding: 10 }}>Farm Name</th>
                                    <th style={{ padding: 10 }}>Owner</th>
                                    <th style={{ padding: 10 }}>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {farms.map((farm) => (
                                    <tr key={farm.farm_id}>
                                        <td style={{ padding: 10 }}>{farm.farm_id}</td>
                                        <td style={{ padding: 10 }}>{farm.farm_name}</td>
                                        <td style={{ padding: 10 }}>
                                            {farm.owner_name || "Not assigned"}
                                        </td>
                                        <td style={{ padding: 10 }}>
                                            {farm.owner_email || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}
