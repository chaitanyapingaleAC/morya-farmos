import { useEffect, useState } from "react";

function CowList() {
    const [cows, setCows] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        const fetchCow = async () => {
            try {
                const token = sessionStorage.getItem("authToken");

                const response = await fetch("http://localhost:5000/api/cows", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }); if (!response.ok) {
                    throw new Error("falied to fetch cow..");
                }
                const data = await response.json();
                setCows(data);


            } catch (error) {
                setError(error.message);

            }
            finally {
                setloading(false);
            }
        };
        fetchCow();
    }, []);







    const deleteCow = async (id) => {
        const confirmDelete = window.confirm("Are you want to sure to delete this cow ? ");
        if (!confirmDelete) {
            return;
        }

        try {

            const token = sessionStorage.getItem("authToken");

            const response = await fetch(
                `http://localhost:5000/api/cows/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("cow deleted succesfully");
                setCows(cows.filter((cow) => cow.cow_id !== id));
            } else {
                alert(data.messege || "delete failed");
            }

        } catch (error) {
            alert("unable to conenct server");

        }
    }


    const editCow = (cow) => {
        setEditData({ ...cow });
    };



    const updateCow = async (e) => {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("authToken");

            const response = await fetch(
                `http://localhost:5000/api/cows/${editData.cow_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(editData)
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Cow updated successfully");

                setCows(cows.map((cow) =>
                    cow.cow_id === editData.cow_id
                        ? { ...editData }
                        : cow
                ));

                setEditData(null);
            } else {
                alert(data.message || "Update failed");
            }
        } catch (error) {
            alert("Unable to connect to server");
        }
    };




    if (loading) {
        return <p>Loading cows....</p>
    }
    if (error) {
        return <p>Error: {error}</p>;
    }



    return (

        <div>


            {editData && (
                <div>
                    <h2>Edit Cow</h2>

                    <form onSubmit={updateCow}>
                        <p>Cow ID: {editData.cow_id}</p>

                        <input
                            placeholder="Cow Name"
                            value={editData.cow_name || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    cow_name: e.target.value
                                })
                            }
                            required
                        />

                        <input
                            type="date"
                            value={
                                editData.date_of_birth
                                    ? editData.date_of_birth.slice(0, 10)
                                    : ""
                            }
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    date_of_birth: e.target.value
                                })
                            }
                        />

                        <label>
                            <input
                                type="checkbox"
                                checked={Boolean(editData.birth_date_is_estimated)}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        birth_date_is_estimated: e.target.checked
                                    })
                                }
                            />
                            Birth Date Is Estimated
                        </label>

                        <input
                            placeholder="Breed"
                            value={editData.breed || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    breed: e.target.value
                                })
                            }
                        />

                        <textarea
                            placeholder="Description"
                            value={editData.description || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    description: e.target.value
                                })
                            }
                        />

                        <button type="submit">Save Changes</button>

                        <button
                            type="button"
                            onClick={() => setEditData(null)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
            <h2>Registered Cows</h2>
            {cows.length === 0 ? (<p>no cow registered yet</p>) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Cow ID</th>
                            <th>Name</th>
                            <th>Breed</th>
                            <th>Description</th>
                            <th>Action</th>

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
                                    <button onClick={() => editCow(cow)}> Edit</button>
                                    <button onClick={() => deleteCow(cow.cow_id)}> Delete </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>
            )}
        </div>

    )


}


export default CowList;
