const API_URL = "http://localhost:5000/api/milk";

const getHeaders = () => {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
    };
};

export const getMilkRecords = async () => {
    const response = await fetch(API_URL, {
        headers: getHeaders()
    });
    return response.json();
};

export const addMilkRecord = async (recordData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(recordData)
    });
    return response.json();
};

export const deleteMilkRecord = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });
    return response.json();
};
