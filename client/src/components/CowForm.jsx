import { useState } from "react";
import { PlusCircle, X, Check } from "lucide-react";

const initialCowState = {
    cow_id: "",
    cow_name: "",
    date_of_birth: "",
    birth_date_is_estimated: false,
    breed: "",
    description: ""
};

export default function CowForm({ onSuccess, onCancel }) {
    const [cow, setCow] = useState(initialCowState);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCow((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const token = sessionStorage.getItem("authToken");
        if (!token) {
            setError("Session expired. Please log in again.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/cows", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...cow,
                    date_of_birth: cow.date_of_birth || null
                })
            });

            const data = await response.json();

            if (response.ok) {
                const createdCow = {
                    ...cow,
                    date_of_birth: cow.date_of_birth || null
                };
                setCow(initialCowState);

                // Notify listeners
                window.dispatchEvent(new CustomEvent("cow-added", { detail: createdCow }));
                if (onSuccess) onSuccess(createdCow);
            } else {
                setError(data.message || "Cow registration failed.");
            }
        } catch (err) {
            console.error("Cow registration error:", err);
            setError("Unable to connect to server. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="cow-card">
            <div className="card-header-row">
                <h2>Register New Cow</h2>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="modal-close-btn"
                        title="Close Form"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {error && <div className="form-error-banner">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="cow-form-grid">
                    <div className="cow-field">
                        <label htmlFor="cow_id">Cow Tag / ID *</label>
                        <input
                            id="cow_id"
                            name="cow_id"
                            placeholder="e.g. MORYA001"
                            value={cow.cow_id}
                            onChange={handleChange}
                            required
                            maxLength={30}
                        />
                    </div>

                    <div className="cow-field">
                        <label htmlFor="cow_name">Cow Name *</label>
                        <input
                            id="cow_name"
                            name="cow_name"
                            placeholder="e.g. Ganga, Lakshmi"
                            value={cow.cow_name}
                            onChange={handleChange}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="cow-field">
                        <label htmlFor="breed">Breed</label>
                        <input
                            id="breed"
                            name="breed"
                            placeholder="e.g. Gir, Sahiwal, HF, Jersey, Murrah"
                            value={cow.breed}
                            onChange={handleChange}
                            maxLength={100}
                        />
                    </div>

                    <div className="cow-field">
                        <label htmlFor="date_of_birth">Date of Birth</label>
                        <input
                            id="date_of_birth"
                            type="date"
                            name="date_of_birth"
                            value={cow.date_of_birth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="cow-field cow-field-checkbox">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                name="birth_date_is_estimated"
                                checked={cow.birth_date_is_estimated}
                                onChange={handleChange}
                            />
                            <span>Birth date is estimated / approximate</span>
                        </label>
                    </div>

                    <div className="cow-field cow-field-full">
                        <label htmlFor="description">Notes / Markings</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Tag color, horn shape, purchase source, or health notes..."
                            value={cow.description}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                </div>

                <div className="form-action-row">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? "Registering..." : (
                            <>
                                <Check size={16} /> Save Cow
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}
