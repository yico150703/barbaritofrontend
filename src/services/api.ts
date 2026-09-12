import axios from "axios";

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // Si estamos en Vercel, usar el proxy relativo /api para máxima compatibilidad con modo incógnito y evitar bloqueos CORS
    if (window.location.hostname.endsWith("vercel.app")) {
      return "/api";
    }
    // Si estamos en cualquier otro host remoto HTTPS
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return "https://barbaritosql.onrender.com/api";
    }
  }

  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== "" && !envUrl.includes("tu-backend")) {
    return envUrl;
  }

  // Desarrollo local en localhost
  return "http://localhost:5000/api";
};

export const API_BASE_URL = getBaseUrl();

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
