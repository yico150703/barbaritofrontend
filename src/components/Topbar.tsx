import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, Wrench, Shield, Users, ChevronDown, CheckCircle2 } from "lucide-react";

export const Topbar: React.FC = () => {
  const { usuario, perfilActivo, panelActivo, logout, toggleSidebar } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadge = () => {
    if (panelActivo === "tecnico") {
      return { label: "Técnico (Super)", icon: Wrench, color: "text-[#063D2A] bg-[#28D978]/20 border-[#28D978]/40" };
    }
    if (panelActivo === "gerencial") {
      return { label: "Administrador / Supervisor", icon: Shield, color: "text-[#063D2A] bg-amber-100 border-amber-300" };
    }
    if (panelActivo === "miembro-equipo") {
      return { label: "Miembro de Equipo", icon: Users, color: "text-[#063D2A] bg-emerald-100 border-emerald-300" };
    }
    return { label: perfilActivo?.nombre || "Usuario", icon: CheckCircle2, color: "text-[#063D2A] bg-[#28D978]/15 border-[#28D978]/30" };
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

  const iniciales = usuario
    ? `${usuario.nombres?.[0] || ""}${usuario.apellidoPaterno?.[0] || ""}`.toUpperCase()
    : "BA";

  const nombreCompleto = usuario
    ? `${usuario.nombres} ${usuario.apellidoPaterno}`
    : "Roberto Díaz";

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs select-none">
      {/* Lado izquierdo: Botón toggle móvil y título del sistema */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleSidebar}
          aria-label="Alternar menú lateral"
          className="p-2 rounded-xl text-slate-600 hover:text-[#063D2A] hover:bg-[#F3F1EA] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <h1 className="text-sm font-semibold text-slate-600 leading-tight">
            Sistema de gestión e inventario
          </h1>
          {panelActivo && (
            <span className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${roleInfo.color}`}>
              <RoleIcon className="w-3 h-3" />
              <span>{roleInfo.label}</span>
            </span>
          )}
        </div>
      </div>

      {/* Lado derecho: Cápsula de Usuario interactiva */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-[#F3F1EA] border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#0B0E0C] group-hover:text-[#063D2A] transition-colors leading-tight">
              {nombreCompleto}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {perfilActivo?.nombre || (panelActivo ? roleInfo.label : "Supervisor")}
            </p>
          </div>

          {/* Avatar Circular con iniciales en Verde Oscuro (#063D2A) */}
          <div className="w-10 h-10 rounded-full bg-[#063D2A] text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-[#063D2A]/20 border-2 border-[#28D978] transition-transform group-hover:scale-105">
            {iniciales}
          </div>

          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180 text-[#063D2A]" : ""}`} />
        </button>

        {/* Popover desplegable flotante estilo Barbarian */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header del Popover */}
            <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
              <div className="w-11 h-11 rounded-full bg-[#063D2A] text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-[#28D978]">
                {iniciales}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#0B0E0C] truncate">
                  {nombreCompleto}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {usuario?.correoElectronico || "rdiaz@gmail.com"}
                </p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#28D978]/20 text-[#063D2A]">
                  {perfilActivo?.nombre || "Usuario Activo"}
                </span>
              </div>
            </div>

            {/* Salida: Solo Cerrar Sesión */}
            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
