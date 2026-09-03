import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de peticiones para inyectar Token JWT y Perfil Activo
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("almacen_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const activeProfileStr = localStorage.getItem("almacen_active_profile_id");
    if (activeProfileStr) {
      config.headers["X-Perfil-Activo"] = activeProfileStr;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas para capturar expiración de sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si expira el token o no está autorizado, limpiar sesión y redirigir
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        localStorage.removeItem("almacen_token");
        localStorage.removeItem("almacen_usuario");
        localStorage.removeItem("almacen_perfiles");
        localStorage.removeItem("almacen_active_profile_id");
        window.location.href = "/login?expirado=true";
      }
    }
    return Promise.reject(error);
  }
);
