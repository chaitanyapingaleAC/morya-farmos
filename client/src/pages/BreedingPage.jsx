
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function BreedingPage() {
    const [cows, setCows] = useState([]);
    const [records, setRecords] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const emptyForm = {
        cow_id: "",
        insemination_date: "",
        pregnancy_status: "Pending",
        confirmation_date: "",
        expected_delivery_date: "",
        actual_delivery_date: "",
        description: ""
    };

    const [form, setForm] = useState(emptyForm);

    const headers = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
    });

    const loadData = async () => {
        try {
            const [cowRes, breedingRes] = await Promise.all([
                fetch(`${API}/cows`, { headers: headers() }),
                fetch(`${API}/breeding`, { headers: headers() })
            ]);

            if (!cowRes.ok || !breedingRes.ok) {
                throw new Error("Failed to load data");
            }

            const cowData = await cowRes.json();
            const breedingData = await breedingRes.json();

            setCows(cowData);
            setRecords(breedingData.data || []);
        } catch (error) {
            setMessage(error.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const url = editingId
                ? `${API}/breeding/${editingId}`
                : `${API}/breeding`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: headers(),
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to save record");
            }

            setMessage(result.message);
            setForm(emptyForm);
            setEditingId(null);
            loadData();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const formatInputDate = (date) =>
        date ? String(date).slice(0, 10) : "";

    const handleEdit = (record) => {
        setEditingId(record.record_id);

        setForm({
            cow_id: record.cow_id,
            insemination_date: formatInputDate(record.insemination_date),
            pregnancy_status: record.pregnancy_status,
            confirmation_date: formatInputDate(record.confirmation_date),
            expected_delivery_date: formatInputDate(record.expected_delivery_date),
            actual_delivery_date: formatInputDate(record.actual_delivery_date),
            description: record.description || ""
        });

        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this breeding record?")) return;

        try {
            const response = await fetch(`${API}/breeding/${id}`, {
                method: "DELETE",
                headers: headers()
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete record");
            }

            setMessage(result.message);
            loadData();
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="dashboard-page">
            <h1>Breeding Management</h1>
            <p>Manage cow breeding and pregnancy records.</p>

            {message && <p>{message}</p>}

            <h2>{editingId ? "Edit Breeding Record" : "Add Breeding Record"}</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Cow</label>
                    <select
                        name="cow_id"
                        value={form.cow_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Cow</option>
                        {cows.map((cow) => (
                            <option key={cow.cow_id} value={cow.cow_id}>
                                {cow.cow_name} ({cow.cow_id})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Insemination Date</label>
                    <input
                        type="date"
                        name="insemination_date"
                        value={form.insemination_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Pregnancy Status</label>
                    <select
                        name="pregnancy_status"
                        value={form.pregnancy_status}
                        onChange={handleChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Not Pregnant">Not Pregnant</option>
                    </select>
                </div>

                {[
                    ["confirmation_date", "Confirmation Date"],
                    ["expected_delivery_date", "Expected Delivery Date"],
                    ["actual_delivery_date", "Actual Delivery Date"]
                ].map(([name, label]) => (
                    <div key={name}>
                        <label>{label}</label>
                        <input
                            type="date"
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    {editingId ? "Update Record" : "Add Record"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setForm(emptyForm);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <hr />

            <h2>Breeding Records</h2>

            {records.length === 0 ? (
                <p>No breeding records found.</p>
            ) : (
                <div className="dashboard-table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Cow</th>
                                <th>Insemination</th>
                                <th>Status</th>
                                <th>Expected Delivery</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.map((record) => (
                                <tr key={record.record_id}>
                                    <td>{record.cow_name}</td>
                                    <td>{formatInputDate(record.insemination_date)}</td>
                                    <td>{record.pregnancy_status}</td>
                                    <td>{formatInputDate(record.expected_delivery_date) || "-"}</td>
                                    <td>
                                        <button onClick={() => handleEdit(record)}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(record.record_id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BreedingPage;

