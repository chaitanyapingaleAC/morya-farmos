import { useEffect, useState, useMemo } from "react";
import {
    Heart,
    Plus,
    X,
    Calendar,
    AlertTriangle,
    Bell,
    Clock,
    Baby,
    CheckCircle2
} from "lucide-react";

const API = "http://localhost:5000/api";

const emptyForm = {
    cow_id: "",
    insemination_date: new Date().toISOString().split("T")[0],
    pregnancy_status: "Pending",
    confirmation_date: "",
    expected_delivery_date: "",
    actual_delivery_date: "",
    description: ""
};

const formatDate = (date) => (date ? String(date).slice(0, 10) : "");

function BreedingPage() {
    const [cows, setCows] = useState([]);
    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({ ...emptyForm });
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

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
            showToast(error.message, "error");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => {
            const updated = { ...prev, [name]: value };

            // Convenience: If insemination date is picked and expected_delivery_date is empty,
            // suggest the bovine gestation period (~283 days)
            if (name === "insemination_date" && value && !updated.expected_delivery_date) {
                const insemDate = new Date(value);
                insemDate.setDate(insemDate.getDate() + 283);
                updated.expected_delivery_date = insemDate.toISOString().split("T")[0];
            }
            return updated;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const url = editingId
                ? `${API}/breeding/${editingId}`
                : `${API}/breeding`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: headers(),
                body: JSON.stringify({
                    ...form,
                    confirmation_date: form.confirmation_date || null,
                    expected_delivery_date: form.expected_delivery_date || null,
                    actual_delivery_date: form.actual_delivery_date || null
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to save breeding record.");
            }

            showToast(
                editingId
                    ? "Breeding record updated successfully!"
                    : "Breeding record added successfully!"
            );

            setForm({ ...emptyForm });
            setEditingId(null);
            setShowForm(false);
            await loadData();
        } catch (error) {
            showToast(error.message, "error");
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
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                throw new Error(result.message || "Unable to delete record.");
            }

            showToast("Breeding record deleted successfully.");
            await loadData();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setShowForm(false);
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

    // Calculate smart upcoming delivery alerts
    const upcomingCalvings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return records
            .filter(
                (r) =>
                    r.pregnancy_status === "Confirmed" &&
                    !r.actual_delivery_date &&
                    r.expected_delivery_date
            )
            .map((r) => {
                const expDate = new Date(r.expected_delivery_date);
                expDate.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                return { ...r, diffDays };
            })
            .sort((a, b) => a.diffDays - b.diffDays);
    }, [records]);

    return (
        <div className="breeding-page">
            {toast && (
                <div className={`toast-notification toast-${toast.type}`}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="toast-close">
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="breeding-header">
                <div>
                    <h1>Breeding & Calving Management</h1>
                    <p>Track artificial inseminations, pregnancy status, and delivery alerts.</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) handleCancel();
                        else setShowForm(true);
                    }}
                    className="btn-primary"
                >
                    {showForm ? (
                        <>
                            <X size={17} /> Close Form
                        </>
                    ) : (
                        <>
                            <Plus size={17} /> Log Insemination / Check
                        </>
                    )}
                </button>
            </div>

            {/* Smart Calving Alerts Banner */}
            {upcomingCalvings.length > 0 && (
                <div className="calving-alerts-container">
                    <div className="calving-alerts-header">
                        <div className="flex-center-gap">
                            <Bell size={18} className="bell-pulse" />
                            <h3>Active Calving & Dry Period Alerts ({upcomingCalvings.length})</h3>
                        </div>
                        <span className="calving-hint">Bovine Gestation: ~283 Days</span>
                    </div>

                    <div className="calving-cards-grid">
                        {upcomingCalvings.map((c) => {
                            let alertType = "alert-normal";
                            let alertLabel = `Calving in ${c.diffDays} days`;

                            if (c.diffDays < 0) {
                                alertType = "alert-overdue";
                                alertLabel = `Overdue by ${Math.abs(c.diffDays)} days!`;
                            } else if (c.diffDays <= 15) {
                                alertType = "alert-imminent";
                                alertLabel = `Calving Imminent (${c.diffDays} days left)`;
                            } else if (c.diffDays <= 60) {
                                alertType = "alert-dry";
                                alertLabel = `Dry Period (${c.diffDays} days to calving)`;
                            }

                            return (
                                <div key={c.record_id} className={`calving-alert-card ${alertType}`}>
                                    <div className="alert-card-top">
                                        <span className="alert-cow-title">
                                            <strong>{c.cow_name || c.cow_id}</strong>
                                            <small> (#{c.cow_id})</small>
                                        </span>
                                        <span className="alert-pill">{alertLabel}</span>
                                    </div>

                                    <div className="alert-card-dates">
                                        <span>
                                            <Calendar size={13} /> Due: {formatDate(c.expected_delivery_date)}
                                        </span>
                                        <span>
                                            Inseminated: {formatDate(c.insemination_date)}
                                        </span>
                                    </div>

                                    <div className="alert-recommendation">
                                        {c.diffDays <= 15 ? (
                                            <>
                                                <Baby size={13} /> Move to maternity pen & monitor labor signs.
                                            </>
                                        ) : c.diffDays <= 60 ? (
                                            <>
                                                <AlertTriangle size={13} /> Stop milking (Dry Cow period) & adjust diet.
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={13} /> Pregnancy confirmed & progressing normally.
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Insemination & Pregnancy Form */}
            {showForm && (
                <section className="breeding-card" style={{ marginBottom: 25 }}>
                    <div className="card-header-row">
                        <h2>{editingId ? "Edit Breeding Record" : "Log Insemination / Pregnancy"}</h2>
                        <button onClick={handleCancel} className="modal-close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="breeding-grid">
                            <div className="breeding-field">
                                <label htmlFor="cow_id">Select Cow *</label>
                                <select
                                    id="cow_id"
                                    name="cow_id"
                                    value={form.cow_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Choose Cow --</option>
                                    {cows.map((cow) => (
                                        <option key={cow.cow_id} value={cow.cow_id}>
                                            {cow.cow_name} ({cow.cow_id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="breeding-field">
                                <label htmlFor="insemination_date">Insemination Date *</label>
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
                                <label htmlFor="pregnancy_status">Pregnancy Status</label>
                                <select
                                    id="pregnancy_status"
                                    name="pregnancy_status"
                                    value={form.pregnancy_status}
                                    onChange={handleChange}
                                >
                                    <option value="Pending">Pending (Awaiting Check)</option>
                                    <option value="Confirmed">Confirmed Pregnant</option>
                                    <option value="Not Pregnant">Not Pregnant (Failed)</option>
                                </select>
                            </div>

                            <div className="breeding-field">
                                <label htmlFor="confirmation_date">Confirmation Date</label>
                                <input
                                    id="confirmation_date"
                                    type="date"
                                    name="confirmation_date"
                                    value={form.confirmation_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="breeding-field">
                                <label htmlFor="expected_delivery_date">
                                    Expected Delivery Date (Auto ~283 Days)
                                </label>
                                <input
                                    id="expected_delivery_date"
                                    type="date"
                                    name="expected_delivery_date"
                                    value={form.expected_delivery_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="breeding-field">
                                <label htmlFor="actual_delivery_date">Actual Delivery Date</label>
                                <input
                                    id="actual_delivery_date"
                                    type="date"
                                    name="actual_delivery_date"
                                    value={form.actual_delivery_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="breeding-field breeding-field-full">
                                <label htmlFor="description">Breeding Notes / Semen Bull ID</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={2}
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Bull straw details, artificial insemination technician, or calf gender..."
                                />
                            </div>
                        </div>

                        <div className="form-action-row" style={{ marginTop: 20 }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Record"
                                    : "Save Breeding Record"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* Breeding Records Table */}
            <section className="breeding-card">
                <h2>All Breeding & Insemination Records ({records.length})</h2>

                {records.length === 0 ? (
                    <p className="empty-message">No breeding records registered yet.</p>
                ) : (
                    <div className="breeding-table-wrap">
                        <table className="breeding-table">
                            <thead>
                                <tr>
                                    <th>Cow</th>
                                    <th>Insemination Date</th>
                                    <th>Status</th>
                                    <th>Expected Delivery</th>
                                    <th>Calving Status</th>
                                    <th>Notes</th>
                                    <th className="th-actions">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {records.map((record) => {
                                    let daysBadge = null;
                                    if (
                                        record.pregnancy_status === "Confirmed" &&
                                        record.expected_delivery_date &&
                                        !record.actual_delivery_date
                                    ) {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const exp = new Date(record.expected_delivery_date);
                                        exp.setHours(0, 0, 0, 0);
                                        const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

                                        if (diff < 0) {
                                            daysBadge = (
                                                <span className="badge-calv badge-overdue">
                                                    Overdue ({Math.abs(diff)}d)
                                                </span>
                                            );
                                        } else if (diff <= 15) {
                                            daysBadge = (
                                                <span className="badge-calv badge-imminent">
                                                    Due in {diff}d
                                                </span>
                                            );
                                        } else {
                                            daysBadge = (
                                                <span className="badge-calv badge-normal">
                                                    {diff}d left
                                                </span>
                                            );
                                        }
                                    }

                                    return (
                                        <tr key={record.record_id}>
                                            <td>
                                                <span className="font-semibold">{record.cow_name}</span>
                                                <div>
                                                    <small className="text-muted">#{record.cow_id}</small>
                                                </div>
                                            </td>

                                            <td>{formatDate(record.insemination_date)}</td>

                                            <td>
                                                <span
                                                    className={`breeding-status ${getStatusClass(
                                                        record.pregnancy_status
                                                    )}`}
                                                >
                                                    {record.pregnancy_status}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(record.expected_delivery_date) || "—"}
                                            </td>

                                            <td>
                                                {record.actual_delivery_date ? (
                                                    <span className="text-green font-medium">
                                                        <CheckCircle2 size={13} style={{ display: "inline" }} /> Calved ({formatDate(record.actual_delivery_date)})
                                                    </span>
                                                ) : (
                                                    daysBadge || "—"
                                                )}
                                            </td>

                                            <td className="notes-col text-muted">
                                                {record.description || "—"}
                                            </td>

                                            <td>
                                                <div className="td-actions">
                                                    <button
                                                        type="button"
                                                        className="action-btn action-edit"
                                                        onClick={() => handleEdit(record)}
                                                        title="Edit"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="action-btn action-delete"
                                                        onClick={() => handleDelete(record.record_id)}
                                                        title="Delete"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default BreedingPage;
