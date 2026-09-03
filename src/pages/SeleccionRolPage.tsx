import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Perfil } from "../types";
import { Wrench, Briefcase, Boxes, ArrowRight, ShieldCheck, LogOut, Eye, Users } from "lucide-react";

export const SeleccionRolPage: React.FC = () => {
  const { usuario, perfiles, seleccionarPerfil, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (perfil: Perfil) => {
    await seleccionarPerfil(perfil);
    navigate("/home");
  };

  const getRoleCardStyle = (nombre: string, id: number) => {
    const n = nombre.toLowerCase();
    if (n.includes("admin") || n.includes("técnico") || n.includes("tecnico")) {
      return {
        icon: Wrench,
        borderStyle: "hover:border-sky-500 hover:ring-2 hover:ring-sky-500/20",
        iconBg: "bg-sky-500 text-white",
        badgeColor: "bg-sky-100 text-sky-800",
      };
    }
    if (n.includes("gerente")) {
      return {
        icon: Briefcase,
        borderStyle: "hover:border-amber-500 hover:ring-2 hover:ring-amber-500/20",
        iconBg: "bg-amber-500 text-white",
        badgeColor: "bg-amber-100 text-amber-900",
      };
    }
    if (n.includes("supervisor")) {
      return {
        icon: Eye,
        borderStyle: "hover:border-purple-500 hover:ring-2 hover:ring-purple-500/20",
        iconBg: "bg-purple-500 text-white",
        badgeColor: "bg-purple-100 text-purple-900",
      };
    }
    if (n.includes("miembro")) {
      return {
        icon: Boxes,
        borderStyle: "hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/20",
        iconBg: "bg-emerald-500 text-white",
        badgeColor: "bg-emerald-100 text-emerald-800",
      };
    }
    return {
      icon: Users,
      borderStyle: "hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/20",
      iconBg: "bg-indigo-500 text-white",
      badgeColor: "bg-indigo-100 text-indigo-800",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800">
      <div className="w-full max-w-4xl">
        {/* Encabezado */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Autenticación Exitosa &bull; Base de Datos Barbarito</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ¿Con qué rol deseas ingresar?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl mx-auto">
            Hola, <strong className="text-white">{usuario?.nombres}</strong>. Tienes múltiples perfiles asignados en el sistema.
            Selecciona el rol con el que operarás en esta sesión:
          </p>
        </div>

        {/* Tarjetas de roles asignados dinámicamente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {perfiles.map((perfil) => {
            const style = getRoleCardStyle(perfil.nombre, perfil.idPerfil);
            const Icon = style.icon;

            return (
              <div
                key={perfil.idPerfil}
                onClick={() => handleSelect(perfil)}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-md bg-white/95 cursor-pointer shadow-xl hover:-translate-y-1.5 ${style.borderStyle}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${style.iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${style.badgeColor}`}>
                      Rol #{perfil.idPerfil}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {perfil.nombre}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {perfil.descripcion || "Acceso y funciones asignadas para este perfil."}
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Acceder como {perfil.nombre}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Botón salir / cambiar cuenta */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Volver a iniciar sesión con otra cuenta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
