
const API_URL = "http://localhost:5000/api/expenses";

// Get authentication headers
const getAuthHeaders = () => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Session expired. Please log in again.");
    }

    return {
        Authorization: `Bearer ${token}`
    };
};

// Handle API responses
const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ||
            `Request failed (${response.status})`
        );
    }

    return data;
};

// Get all expenses
export const getExpenses = async () => {
    const response = await fetch(API_URL, {
        headers: getAuthHeaders()
    });

    return handleResponse(response);
};

// Get one expense by ID
export const getExpenseById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
    });

    return handleResponse(response);
};

// Add a new expense
export const addExpense = async (expenseData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expenseData)
    });

    return handleResponse(response);
};

// Update an existing expense
export const updateExpense = async (id, expenseData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expenseData)
    });

    return handleResponse(response);
};

// Delete an expense
export const deleteExpense = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    return handleResponse(response);
};
