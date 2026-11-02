import { useState  } from "react";

function CowForm(){
    const [cow,setcow] = useState({
        cow_id:"", cow_name:"" , date_of_birth:"" , birt_date_is_estimated:false , breed:"" , description:""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if(e.target.type === "checkbox"){
            setcow({
                ...cow,[e.target.name] : e.target.checked
            });
        }else{
            setcow({
                ...cow,[e.target.name]:e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/cows", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cow)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cow registered successfully!");
                window.location.reload();
            } else {
                alert(data.message || "Registration failed");
            }

        } catch (error) {
            alert("Unable to connect to server");
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

                <button type="submit">Register Cow</button>
            </form>
        </div>
    );




}


export default CowForm;