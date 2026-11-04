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
        <div>
            <h2>Register New Cow</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="cow_id"
                    placeholder="Cow ID"
                    value={cow.cow_id}
                    onChange={handleChange}
                    required
                    maxLength={30}
                />

                <input
                    name="cow_name"
                    placeholder="Cow Name"
                    value={cow.cow_name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                />

                <label>Date of Birth: </label>
                <input
                    type="date"
                    name="date_of_birth"
                    value={cow.date_of_birth}
                    onChange={handleChange}
                />

                <label>
                    <input
                        type="checkbox"
                        name="birth_date_is_estimated"
                        checked={cow.birth_date_is_estimated}
                        onChange={handleChange}
                    />
                    Birth Date Is Estimated
                </label>

                <input
                    name="breed"
                    placeholder="Breed"
                    value={cow.breed}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={cow.description}
                    onChange={handleChange}
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? "Registering..." : "Register Cow"}
                </button>
            </form>
        </div>
    );
}

export default CowForm;