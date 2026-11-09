import { useState, useEffect } from "react";
import { Plus, X, Edit2, Trash2, Search, Check } from "lucide-react";

export default function CowPage() {
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  const initialFormState = {
    cow_id: "",
    cow_name: "",
    breed: "",
    date_of_birth: "",
    description: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // Helper for authentication header
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
  });

  // 1. Fetch all cows from server
  const loadCows = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/cows", {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setCows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading cows:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCows();
  }, []);

  // 2. Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Save Cow (handles both Register New and Update Existing)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEditing
        ? `http://localhost:5000/api/cows/${encodeURIComponent(formData.cow_id)}`
        : "http://localhost:5000/api/cows";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save cow");
        return;
      }

      // Reset form and reload cows
      setFormData(initialFormState);
      setIsEditing(false);
      setShowForm(false);
      loadCows();
    } catch (err) {
      alert("Error saving cow: " + err.message);
    }
  };

  // 4. Open form to Edit a cow
  const handleEdit = (cow) => {
    setFormData({
      cow_id: cow.cow_id,
      cow_name: cow.cow_name,
      breed: cow.breed || "",
      date_of_birth: cow.date_of_birth ? String(cow.date_of_birth).slice(0, 10) : "",
      description: cow.description || ""
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // 5. Delete a cow
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete cow #${id}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cows/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (res.ok) {
        loadCows();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete cow");
      }
    } catch (err) {
      alert("Error deleting cow: " + err.message);
    }
  };

  // 6. Cancel form
  const handleCancel = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setShowForm(false);
  };

  // Filter cows by search term (ID, Name, or Breed)
  const filteredCows = cows.filter((cow) => {
    const query = search.toLowerCase();
    return (
      cow.cow_id.toLowerCase().includes(query) ||
      cow.cow_name.toLowerCase().includes(query) ||
      (cow.breed || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="cow-page">
      {/* Top Header */}
      <div className="cow-header">
        <div>
          <h1>Cow Management</h1>
          <p>Register, view, update, and manage your dairy cattle.</p>
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
              <Plus size={17} /> Register New Cow
            </>
          )}
        </button>
      </div>

      {/* Add / Edit Form Card */}
      {showForm && (
        <section className="cow-card" style={{ marginBottom: "24px" }}>
          <div className="card-header-row">
            <h2>{isEditing ? `Edit Cow #${formData.cow_id}` : "Register New Cow"}</h2>
            <button onClick={handleCancel} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="cow-form-grid">
              <div className="cow-field">
                <label>Tag / ID *</label>
                <input
                  name="cow_id"
                  placeholder="e.g. M001"
                  value={formData.cow_id}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                />
              </div>

              <div className="cow-field">
                <label>Cow Name *</label>
                <input
                  name="cow_name"
                  placeholder="e.g. Ganga"
                  value={formData.cow_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cow-field">
                <label>Breed</label>
                <input
                  name="breed"
                  placeholder="e.g. Gir, Sahiwal, Jersey"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </div>

              <div className="cow-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div className="cow-field cow-field-full">
                <label>Notes / Markings</label>
                <textarea
                  name="description"
                  placeholder="Any details or health notes..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>

            <div className="form-action-row" style={{ marginTop: "16px" }}>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Check size={16} /> {isEditing ? "Save Changes" : "Save Cow"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Cows Table Card */}
      <section className="cow-card">
        <div className="cow-table-toolbar">
          <h2>Registered Herd ({cows.length} Cows)</h2>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by tag, name, breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p style={{ padding: "20px", color: "#666" }}>Loading cattle...</p>
        ) : filteredCows.length === 0 ? (
          <p className="empty-message">
            {search ? "No cows match your search." : "No cows registered yet."}
          </p>
        ) : (
          <div className="cow-table-wrap">
            <table className="cow-table">
              <thead>
                <tr>
                  <th>Tag / ID</th>
                  <th>Name</th>
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
                    <td>{cow.date_of_birth ? String(cow.date_of_birth).slice(0, 10) : "—"}</td>
                    <td className="notes-col text-muted">{cow.description || "—"}</td>
                    <td>
                      <div className="td-actions">
                        <button
                          type="button"
                          className="action-btn action-edit"
                          onClick={() => handleEdit(cow)}
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
    </div>
  );
}
