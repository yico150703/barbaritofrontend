import axios from "axios";

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== "" && !envUrl.includes("tu-backend")) {
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      envUrl.includes("http://localhost")
    ) {
      return "https://barbaritosql.onrender.com/api";
    }
    return envUrl;
  }

  // Si estamos en el navegador en Vercel o cualquier dominio remoto HTTPS
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://barbaritosql.onrender.com/api";
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
