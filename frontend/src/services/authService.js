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
export const logout = () => {
  // Supprimer toutes les données d'authentification
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  
  // Optionnel: garder l'email si "Remember me" était coché
  // Si vous voulez aussi supprimer l'email:
  // localStorage.removeItem("rememberedEmail");
  
  // Rediriger vers la page de connexion
  window.location.href = "/login";
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return !!(token && role);
};

/**
 * Récupère les informations de l'utilisateur connecté
 */
export const getCurrentUser = () => {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name")
  };
};