import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert } from "lucide-react";

interface RutaProtegidaProps {
  rolesPermitidos?: (number | string)[];
}

export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ rolesPermitidos }) => {
  const { token, usuario, perfilActivo, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Verificando credenciales...</p>
      </div>
    );
  }

  // Si no hay token o usuario autenticado, redirigir al login
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario tiene sesión pero aún no ha seleccionado rol (en multi-rol)
  if (!perfilActivo) {
    return <Navigate to="/seleccionar-rol" replace />;
  }

  // Si la ruta exige roles específicos, verificar que el rol activo los cumpla
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const rolActualId = perfilActivo.idPerfil;
    const rolActualNombre = perfilActivo.nombre.toLowerCase().trim();

    const tienePermiso = rolesPermitidos.some((rol) => {
      if (typeof rol === "number") return rol === rolActualId;
      return rol.toLowerCase().trim() === rolActualNombre;
    });

    if (!tienePermiso) {
      return (
        <div className="p-8 max-w-2xl mx-auto mt-12 bg-white border border-rose-100 rounded-2xl shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Acceso Restringido</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Tu rol activo actual (<strong className="text-slate-900 font-semibold">{perfilActivo.nombre}</strong>) no cuenta
            con privilegios suficientes para consultar este módulo.
          </p>
          <div className="flex gap-4">
            <a
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              Volver al Inicio
            </a>
            <a
              href="/seleccionar-rol"
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
            >
              Cambiar de Rol
            </a>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
};
