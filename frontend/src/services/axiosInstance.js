import axios from 'axios';

// Création de l'instance Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // URL de ton backend
  timeout: 5000, // temps max pour une requête
});

// Ajouter automatiquement le token JWT dans chaque requête si existant
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si non autorisé, on peut rediriger vers login
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;