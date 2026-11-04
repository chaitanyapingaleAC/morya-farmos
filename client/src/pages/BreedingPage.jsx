
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

const emptyForm = {
    cow_id: "",
    insemination_date: "",
    pregnancy_status: "Pending",
    confirmation_date: "",
    expected_delivery_date: "",
    actual_delivery_date: "",
    description: ""
};

const formatDate = (date) =>
    date ? String(date).slice(0, 10) : "";

function BreedingPage() {
    const [cows, setCows] = useState([]);
    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({ ...emptyForm });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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
                throw new Error("Failed to load breeding data");
            }

            const cowData = await cowRes.json();
            const breedingData = await breedingRes.json();

            setCows(Array.isArray(cowData) ? cowData : []);
            setRecords(breedingData.data || []);
        } catch (error) {
            setMessage(error.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);

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
                throw new Error(result.message || "Unable to save record");
            }

            setMessage(
                editingId
                    ? "Breeding record updated successfully."
                    : "Breeding record added successfully."
            );

            setForm({ ...emptyForm });
            setEditingId(null);

            await loadData();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingId(record.record_id);

        setForm({
            cow_id: record.cow_id,
            insemination_date: formatDate(record.insemination_date),
            pregnancy_status: record.pregnancy_status,
            confirmation_date: formatDate(record.confirmation_date),
            expected_delivery_date: formatDate(record.expected_delivery_date),
            actual_delivery_date: formatDate(record.actual_delivery_date),
            description: record.description || ""
        });

        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this breeding record?")) {
            return;
        }

        try {
            const response = await fetch(`${API}/breeding/${id}`, {
                method: "DELETE",
                headers: headers()
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to delete record");
            }

            setMessage("Breeding record deleted successfully.");
            await loadData();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setMessage("");
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Confirmed":
                return "breeding-status-confirmed";
            case "Not Pregnant":
                return "breeding-status-not-pregnant";
            default:
                return "breeding-status-pending";
        }
    };

    return (
        <div className="breeding-page">

            <div className="breeding-header">
                <h1>Breeding Management</h1>
                <p>
                    Manage cow insemination, pregnancy status,
                    and delivery records.
                </p>
            </div>

            {message && (
                <div className="breeding-message">
                    {message}
                </div>
            )}

            <section className="breeding-card">
                <h2>
                    {editingId
                        ? "Edit Breeding Record"
                        : "Add Breeding Record"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="breeding-form-grid">

                        <div className="breeding-field">
                            <label htmlFor="cow_id">Select Cow *</label>
                            <select
                                id="cow_id"
                                name="cow_id"
                                value={form.cow_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Cow</option>
                                {cows.map((cow) => (
                                    <option
                                        key={cow.cow_id}
                                        value={cow.cow_id}
                                    >
                                        {cow.cow_name} ({cow.cow_id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="breeding-field">
                            <label htmlFor="insemination_date">
                                Insemination Date *
                            </label>
                            <input
                                id="insemination_date"
                                type="date"
                                name="insemination_date"
                                value={form.insemination_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="breeding-field">
                            <label htmlFor="pregnancy_status">
                                Pregnancy Status
                            </label>
                            <select
                                id="pregnancy_status"
                                name="pregnancy_status"
                                value={form.pregnancy_status}
                                onChange={handleChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Not Pregnant">
                                    Not Pregnant
                                </option>
                            </select>
                        </div>

                        {[
                            ["confirmation_date", "Confirmation Date"],
                            ["expected_delivery_date", "Expected Delivery Date"],
                            ["actual_delivery_date", "Actual Delivery Date"]
                        ].map(([name, label]) => (
                            <div className="breeding-field" key={name}>
                                <label htmlFor={name}>{label}</label>
                                <input
                                    id={name}
                                    type="date"
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}

                        <div className="breeding-field breeding-field-full">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter breeding notes..."
                            />
                        </div>

                    </div>

                    <div className="breeding-actions">
                        <button
                            type="submit"
                            className="breeding-save-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : editingId
                                    ? "Update Record"
                                    : "Add Record"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="breeding-cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="breeding-card">
                <h2>Breeding Records</h2>

                {records.length === 0 ? (
                    <p>No breeding records found.</p>
                ) : (
                    <div className="breeding-table-wrap">
                        <table className="breeding-table">
                            <thead>
                                <tr>
                                    <th>Cow</th>
                                    <th>Insemination Date</th>
                                    <th>Pregnancy Status</th>
                                    <th>Expected Delivery</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.record_id}>
                                        <td>
                                            {record.cow_name}
                                            <div>
                                                <small>{record.cow_id}</small>
                                            </div>
                                        </td>

                                        <td>
                                            {formatDate(record.insemination_date)}
                                        </td>

                                        <td>
                                            <span
                                                className={`breeding-status ${getStatusClass(record.pregnancy_status)}`}
                                            >
                                                {record.pregnancy_status}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(record.expected_delivery_date) || "-"}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="breeding-edit-btn"
                                                onClick={() => handleEdit(record)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="breeding-delete-btn"
                                                onClick={() => handleDelete(record.record_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
}

export default BreedingPage;
