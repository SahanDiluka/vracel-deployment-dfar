import axios from "axios";

const API_URL = "http://127.0.0.1:8000/users";
const AUTH_URL = "http://127.0.0.1:8000/auth";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return { Authorization: `Bearer ${token}` };
};

// GET all users
export const getUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, errors: err.response?.data || err.message };
  }
};

// GET single user
export const getUser = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, errors: err.response?.data || err.message };
  }
};

// DELETE user
export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, errors: err.response?.data || err.message };
  }
};

// REGISTER new user
export const registerUser = async (email, password) => {
  try {
    const res = await axios.post(
      `${AUTH_URL}/register`,
      { email, password },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, errors: err.response?.data || err.message };
  }
};