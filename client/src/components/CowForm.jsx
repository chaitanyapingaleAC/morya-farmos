
import { useState } from "react";

function CowForm() {
    const [cow, setCow] = useState({
        cow_id: "",
        cow_name: "",
        date_of_birth: "",
        birth_date_is_estimated: false,
        breed: "",
        description: ""
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setCow((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("authToken");

        if (!token) {
            alert("Session expired. Please log in again.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/cows",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...cow,
                        date_of_birth: cow.date_of_birth || null
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Cow registered successfully!");
                window.location.reload();
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Cow registration error:", error);
            alert("Unable to connect to server");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="cow-card">
            <h2>Register New Cow</h2>

            <form onSubmit={handleSubmit}>
                <div className="cow-form-grid">

                    <div className="cow-field">
                        <label htmlFor="cow_id">Cow ID *</label>
                        <input
                            id="cow_id"
                            name="cow_id"
                            placeholder="e.g. MORYA003"
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
                            placeholder="Enter cow name"
                            value={cow.cow_name}
                            onChange={handleChange}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="cow-field">
                        <label htmlFor="date_of_birth">
                            Date of Birth
                        </label>
                        <input
                            id="date_of_birth"
                            type="date"
                            name="date_of_birth"
                            value={cow.date_of_birth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="cow-field">
                        <label htmlFor="breed">Breed</label>
                        <input
                            id="breed"
                            name="breed"
                            placeholder="e.g. Gir, HF, Jersey"
                            value={cow.breed}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="cow-field cow-field-full">
                        <label className="cow-checkbox">
                            <input
                                type="checkbox"
                                name="birth_date_is_estimated"
                                checked={cow.birth_date_is_estimated}
                                onChange={handleChange}
                            />
                            Birth Date Is Estimated
                        </label>
                    </div>

                    <div className="cow-field cow-field-full">
                        <label htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter additional information about the cow..."
                            value={cow.description}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className="cow-actions">
                    <button
                        type="submit"
                        className="cow-save-btn"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Registering..."
                            : "Register Cow"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default CowForm;
