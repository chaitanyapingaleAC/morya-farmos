import { useEffect, useState, useMemo } from "react";
import { Search, Edit2, Trash2, X, AlertCircle, CheckCircle } from "lucide-react";

const API_URL = "http://localhost:5000/api/cows";

const formatDate = (date) => (date ? String(date).slice(0, 10) : "");

function CowList() {
    const [cows, setCows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const getHeaders = () => ({
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
    });

    const fetchCows = async () => {
        try {
            const response = await fetch(API_URL, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Failed to fetch cows.");
            }

            const data = await response.json();
            setCows(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCows();

        // Listen for new cows added from CowForm
        const handleCowAdded = () => {
            fetchCows();
            showToast("New cow registered successfully!");
        };

        window.addEventListener("cow-added", handleCowAdded);
        return () => window.removeEventListener("cow-added", handleCowAdded);
    }, []);

    const deleteCow = async (id) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete cow #${id}?`
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API_URL}/${encodeURIComponent(id)}`,
                {
                    method: "DELETE",
                    headers: getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            setCows((prev) => prev.filter((cow) => cow.cow_id !== id));
            showToast(`Cow #${id} deleted successfully.`);
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const editCow = (cow) => {
        setEditData({
            ...cow,
            date_of_birth: formatDate(cow.date_of_birth),
            birth_date_is_estimated: Boolean(cow.birth_date_is_estimated)
        });
    };

    const handleEditChange = (event) => {
        const { name, value, type, checked } = event.target;
        setEditData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const updateCow = async (event) => {
        event.preventDefault();
        if (!editData) return;

        setSaving(true);

        try {
            const response = await fetch(
                `${API_URL}/${encodeURIComponent(editData.cow_id)}`,
                {
                    method: "PUT",
                    headers: {
                        ...getHeaders(),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...editData,
                        date_of_birth: editData.date_of_birth || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Update failed");
            }

            setCows((prev) =>
                prev.map((cow) =>
                    cow.cow_id === editData.cow_id ? { ...editData } : cow
                )
            );

            setEditData(null);
            showToast(`Cow #${editData.cow_id} updated successfully!`);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const filteredCows = useMemo(() => {
        if (!searchQuery.trim()) return cows;
        const q = searchQuery.toLowerCase();
        return cows.filter(
            (c) =>
                (c.cow_id || "").toLowerCase().includes(q) ||
                (c.cow_name || "").toLowerCase().includes(q) ||
                (c.breed || "").toLowerCase().includes(q) ||
                (c.description || "").toLowerCase().includes(q)
        );
    }, [cows, searchQuery]);

    if (loading) {
        return (
            <section className="cow-card">
                <p>Loading cattle herd...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="cow-card">
                <p className="error-message">Error: {error}</p>
            </section>
        );
    }

    return (
        <>
            {/* Notification Toast */}
            {toast && (
                <div className={`toast-notification toast-${toast.type}`}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="toast-close">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* In-place Edit Form Modal */}
            {editData && (
                <div className="modal-backdrop" onClick={() => setEditData(null)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Edit Cow #{editData.cow_id}</h2>
                            <button
                                onClick={() => setEditData(null)}
                                className="modal-close-btn"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={updateCow} className="modal-form">
                            <div className="form-row-2">
                                <div className="form-field">
                                    <label>Cow Tag / ID</label>
                                    <input value={editData.cow_id} disabled />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="edit_cow_name">Cow Name *</label>
                                    <input
                                        id="edit_cow_name"
                                        name="cow_name"
                                        value={editData.cow_name || ""}
                                        onChange={handleEditChange}
                                        required
                                        maxLength={100}
                                    />
                                </div>
                            </div>

                            <div className="form-row-2">
                                <div className="form-field">
                                    <label htmlFor="edit_breed">Breed</label>
                                    <input
                                        id="edit_breed"
                                        name="breed"
                                        value={editData.breed || ""}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="edit_date_of_birth">Date of Birth</label>
                                    <input
                                        id="edit_date_of_birth"
                                        type="date"
                                        name="date_of_birth"
                                        value={editData.date_of_birth || ""}
                                        onChange={handleEditChange}
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        name="birth_date_is_estimated"
                                        checked={Boolean(editData.birth_date_is_estimated)}
                                        onChange={handleEditChange}
                                    />
                                    <span>Birth date is estimated</span>
                                </label>
                            </div>

                            <div className="form-field">
                                <label htmlFor="edit_description">Description / Notes</label>
                                <textarea
                                    id="edit_description"
                                    name="description"
                                    rows={2}
                                    value={editData.description || ""}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setEditData(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cows Table Section */}
            <section className="cow-card">
                <div className="cow-table-toolbar">
                    <h2>Registered Herd ({cows.length} Cows)</h2>

                    <div className="search-box">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by tag, name, breed..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {filteredCows.length === 0 ? (
                    <p className="empty-message">
                        {searchQuery ? "No cows match your search." : "No cows registered yet."}
                    </p>
                ) : (
                    <div className="cow-table-wrap">
                        <table className="cow-table">
                            <thead>
                                <tr>
                                    <th>Tag / ID</th>
                                    <th>Cow Name</th>
                                    <th>Breed</th>
                                    <th>Date of Birth</th>
                                    <th>Notes</th>
                                    <th className="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCows.map((cow) => (
                                    <tr key={cow.cow_id}>
                                        <td className="font-semibold text-green">
                                            #{cow.cow_id}
                                        </td>
                                        <td className="font-medium">{cow.cow_name}</td>
                                        <td>{cow.breed || "—"}</td>
                                        <td>
                                            {cow.date_of_birth
                                                ? formatDate(cow.date_of_birth)
                                                : "—"}
                                            {Boolean(cow.birth_date_is_estimated) && (
                                                <small className="estimated-tag"> (Est.)</small>
                                            )}
                                        </td>
                                        <td className="notes-col text-muted">
                                            {cow.description || "—"}
                                        </td>
                                        <td>
                                            <div className="td-actions">
                                                <button
                                                    type="button"
                                                    className="action-btn action-edit"
                                                    onClick={() => editCow(cow)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-btn action-delete"
                                                    onClick={() => deleteCow(cow.cow_id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}

export default CowList;
