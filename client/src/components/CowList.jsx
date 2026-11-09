import { useEffect, useState, useMemo } from "react";
import { Search, Edit2, Trash2, X, AlertCircle } from "lucide-react";

const API_URL = "http://localhost:5000/api/cows";

export default function CowList() {
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  // Helper for auth headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
  });

  // Fetch all cows from backend
  const fetchCows = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch cows from server.");
      const data = await res.json();
      setCows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCows();

    // Listen for cow-added event from CowForm
    const handleCowAdded = () => fetchCows();
    window.addEventListener("cow-added", handleCowAdded);
    return () => window.removeEventListener("cow-added", handleCowAdded);
  }, []);

  // Delete a cow
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete cow #${id}?`)) return;

    try {
      const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Delete failed");
      setCows((prev) => prev.filter((cow) => cow.cow_id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Open edit modal
  const openEdit = (cow) => {
    setEditData({
      ...cow,
      date_of_birth: cow.date_of_birth ? String(cow.date_of_birth).slice(0, 10) : "",
      birth_date_is_estimated: Boolean(cow.birth_date_is_estimated)
    });
  };

  // Handle edit input change
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Save updated cow details
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/${encodeURIComponent(editData.cow_id)}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          ...editData,
          date_of_birth: editData.date_of_birth || null
        })
      });

      if (!res.ok) throw new Error("Failed to update cow details.");

      setCows((prev) =>
        prev.map((c) => (c.cow_id === editData.cow_id ? { ...editData } : c))
      );
      setEditData(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Filter cows based on search input
  const filteredCows = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return cows;
    return cows.filter(
      (c) =>
        (c.cow_id || "").toLowerCase().includes(q) ||
        (c.cow_name || "").toLowerCase().includes(q) ||
        (c.breed || "").toLowerCase().includes(q)
    );
  }, [cows, searchQuery]);

  if (loading) return <div className="cow-card"><p>Loading cattle herd...</p></div>;
  if (error) return <div className="cow-card"><p className="error-message">{error}</p></div>;

  return (
    <>
      {/* Edit Cow Modal */}
      {editData && (
        <div className="modal-backdrop" onClick={() => setEditData(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Cow #{editData.cow_id}</h2>
              <button onClick={() => setEditData(null)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="form-row-2">
                <div className="form-field">
                  <label>Tag / ID</label>
                  <input value={editData.cow_id} disabled />
                </div>
                <div className="form-field">
                  <label>Cow Name *</label>
                  <input
                    name="cow_name"
                    value={editData.cow_name || ""}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Breed</label>
                  <input
                    name="breed"
                    value={editData.breed || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-field">
                  <label>Date of Birth</label>
                  <input
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
                <label>Notes / Markings</label>
                <textarea
                  name="description"
                  rows={2}
                  value={editData.description || ""}
                  onChange={handleEditChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditData(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Herd Table Card */}
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
            {searchQuery ? "No cows match your search." : "No cattle registered yet."}
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
                    <td className="font-semibold text-green">#{cow.cow_id}</td>
                    <td className="font-medium">{cow.cow_name}</td>
                    <td>{cow.breed || "—"}</td>
                    <td>
                      {cow.date_of_birth ? String(cow.date_of_birth).slice(0, 10) : "—"}
                      {Boolean(cow.birth_date_is_estimated) && (
                        <small className="estimated-tag"> (Est.)</small>
                      )}
                    </td>
                    <td className="notes-col text-muted">{cow.description || "—"}</td>
                    <td>
                      <div className="td-actions">
                        <button
                          type="button"
                          className="action-btn action-edit"
                          onClick={() => openEdit(cow)}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="action-btn action-delete"
                          onClick={() => handleDelete(cow.cow_id)}
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
