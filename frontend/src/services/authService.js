import axios from "axios";
const API_URL = "http://localhost:5000"; // ton backend

export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, credentials);
  return res.data;
};
