
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/cows";

const formatDate = (date) =>
    date ? String(date).slice(0, 10) : "";

function CowList() {
    const [cows, setCows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);

    const getHeaders = () => ({
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
    });

    useEffect(() => {
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
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCows();
    }, []);

    const deleteCow = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this cow?"
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

            setCows((previous) =>
                previous.filter((cow) => cow.cow_id !== id)
            );

            alert("Cow deleted successfully!");
        } catch (error) {
            alert(error.message);
        }
    };

    const editCow = (cow) => {
        setEditData({
            ...cow,
            date_of_birth: formatDate(cow.date_of_birth),
            birth_date_is_estimated:
                Boolean(cow.birth_date_is_estimated)
        });
    };

    const handleEditChange = (event) => {
        const { name, value, type, checked } = event.target;

        setEditData((previous) => ({
            ...previous,
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
                        date_of_birth:
                            editData.date_of_birth || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Update failed");
            }

            setCows((previous) =>
                previous.map((cow) =>
                    cow.cow_id === editData.cow_id
                        ? { ...editData }
                        : cow
                )
            );

            setEditData(null);
            alert("Cow updated successfully!");
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="cow-card">
                <p>Loading cows...</p>
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
            {editData && (
                <section className="cow-card">
                    <h2>Edit Cow</h2>

                    <form onSubmit={updateCow}>
                        <div className="cow-form-grid">

                            <div className="cow-field">
                                <label>Cow ID</label>
                                <input
                                    value={editData.cow_id}
                                    disabled
                                />
                            </div>

                            <div className="cow-field">
                                <label htmlFor="edit_cow_name">
                                    Cow Name *
                                </label>
                                <input
                                    id="edit_cow_name"
                                    name="cow_name"
                                    value={editData.cow_name || ""}
                                    onChange={handleEditChange}
                                    required
                                    maxLength={100}
                                />
                            </div>

                            <div className="cow-field">
                                <label htmlFor="edit_date_of_birth">
                                    Date of Birth
                                </label>
                                <input
                                    id="edit_date_of_birth"
                                    type="date"
                                    name="date_of_birth"
                                    value={editData.date_of_birth || ""}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="cow-field">
                                <label htmlFor="edit_breed">
                                    Breed
                                </label>
                                <input
                                    id="edit_breed"
                                    name="breed"
                                    value={editData.breed || ""}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="cow-field cow-field-full">
                                <label className="cow-checkbox">
                                    <input
                                        type="checkbox"
                                        name="birth_date_is_estimated"
                                        checked={Boolean(
                                            editData.birth_date_is_estimated
                                        )}
                                        onChange={handleEditChange}
                                    />
                                    Birth Date Is Estimated
                                </label>
                            </div>

                            <div className="cow-field cow-field-full">
                                <label htmlFor="edit_description">
                                    Description
                                </label>
                                <textarea
                                    id="edit_description"
                                    name="description"
                                    value={editData.description || ""}
                                    onChange={handleEditChange}
                                />
                            </div>

                        </div>

                        <div className="cow-actions">
                            <button
                                type="submit"
                                className="cow-save-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                className="cow-cancel-btn"
                                onClick={() => setEditData(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="cow-card">
                <h2>Registered Cows ({cows.length})</h2>

                {cows.length === 0 ? (
                    <p>No cows registered yet.</p>
                ) : (
                    <div className="cow-table-wrap">
                        <table className="cow-table">
                            <thead>
                                <tr>
                                    <th>Cow ID</th>
                                    <th>Name</th>
                                    <th>Breed</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cows.map((cow) => (
                                    <tr key={cow.cow_id}>
                                        <td>{cow.cow_id}</td>
                                        <td>{cow.cow_name}</td>
                                        <td>{cow.breed || "-"}</td>
                                        <td>{cow.description || "-"}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="cow-edit-btn"
                                                onClick={() => editCow(cow)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="cow-delete-btn"
                                                onClick={() =>
                                                    deleteCow(cow.cow_id)
                                                }
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
        </>
    );
}

export default CowList;
