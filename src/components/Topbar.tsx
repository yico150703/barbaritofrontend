import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Home, Menu, ShieldCheck, Warehouse, Boxes, Wrench } from "lucide-react";

export const Topbar: React.FC = () => {
  const { usuario, perfilActivo, panelActivo, logout, toggleSidebar, seleccionarPanel } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleVolverInicio = async () => {
    await seleccionarPanel(null);
    navigate("/home");
  };

  // Color e ícono del panel activo
  const getPanelBadge = () => {
    switch (panelActivo) {
      case "tecnico":
        return {
          label: "Panel Técnico",
          style: "bg-sky-100 text-sky-800 border-sky-300 ring-sky-500/20",
          icon: Wrench,
        };
      case "gerencial":
        return {
          label: "Panel Administrador",
          style: "bg-amber-100 text-amber-900 border-amber-300 ring-amber-500/20",
          icon: Warehouse,
        };
      case "miembro-equipo":
        return {
          label: "Panel Miembro de Equipo",
          style: "bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-500/20",
          icon: Boxes,
        };
      default:
        return {
          label: "Dashboard Inicial",
          style: "bg-indigo-100 text-indigo-800 border-indigo-300 ring-indigo-500/20",
          icon: ShieldCheck,
        };
    }
  };

  const panelInfo = getPanelBadge();
  const PanelIcon = panelInfo.icon;

  const iniciales = usuario
    ? `${usuario.nombres?.[0] || ""}${usuario.apellidoPaterno?.[0] || ""}`.toUpperCase()
    : "UA";

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm/50">
      {/* Lado izquierdo: Botón toggle móvil y título */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Alternar menú lateral"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Módulo Operativo &bull; Almacén
          </span>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">
            {panelActivo ? panelInfo.label : "Dashboard Inicial (Selección de Paneles)"}
          </h1>
        </div>
      </div>

      {/* Lado derecho: Información de usuario, rol activo y acciones */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Badge de Panel Activo */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ring-1 ${panelInfo.style} shadow-xs`}
        >
          <PanelIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{panelInfo.label}</span>
        </div>

        {/* Botón para volver al Inicio si se encuentra dentro de un panel */}
        {panelActivo && (
          <button
            onClick={handleVolverInicio}
            title="Volver al Dashboard Inicial para cambiar de panel"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Inicio / Paneles</span>
          </button>
        )}

        {/* Chip de usuario */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-500/20">
            {iniciales}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {usuario?.nombres} {usuario?.apellidoPaterno}
            </p>
            <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
              {usuario?.correoElectronico}
            </p>
          </div>
        </div>

        {/* Botón Cerrar Sesión */}
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};
