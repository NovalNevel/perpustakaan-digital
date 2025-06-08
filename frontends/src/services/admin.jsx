import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("accessToken");
    return { Authorization: `Bearer ${token}` };
};

export const getBooks = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/books`);
    return res.data;
};

export const getCategories = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/books/categories`);
    return res.data;
};

export const getUsers = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/users`, { headers: getAuthHeaders() });
    return res.data;
};

export const getUserStatistics = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/users/statistics`, { headers: getAuthHeaders() });
    return res.data;
};

export const getUserLoans = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/books/my-loans`, { headers: getAuthHeaders() });
    return res.data;
};

export const addBook = async (formData) => {
    const res = await axios.post(`${API_BASE_URL}/api/books`, formData, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const updateBook = async (id, formData) => {
    const res = await axios.put(`${API_BASE_URL}/api/books/${id}`, formData, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteBook = async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/api/books/${id}`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const addUser = async (userData) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, userData, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const updateUser = async (id, userData) => {
    const res = await axios.put(`${API_BASE_URL}/api/users/${id}`, userData, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const borrowBook = async (bookId, userId) => {
    const res = await axios.post(
        `${API_BASE_URL}/api/books/borrow`,
        { bookId, userId },
        { headers: getAuthHeaders() },
    );
    return res.data;
};

export const returnBook = async (loanId) => {
    const res = await axios.post(
        `${API_BASE_URL}/api/books/return`,
        { loanId },
        { headers: getAuthHeaders() },
    );
    return res.data;
};

export const getUserById = async (id) => {
    const res = await axios.get(`${API_BASE_URL}/api/users/${id}`, { headers: getAuthHeaders() });
    return res.data;
};
