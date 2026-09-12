import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  Shield,
  Users,
  ListTree,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Database,
  Layers,
} from "lucide-react";

export const DashboardHomePage: React.FC = () => {
  const { usuario, perfilActivo } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPerfiles: 0,
    totalUsuarios: 0,
    totalOpciones: 0,
    loading: true,
  });

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [resPerfiles, resUsuarios, resOpciones] = await Promise.all([
          api.get("/perfiles", { params: { limit: 1 } }),
          api.get("/usuarios", { params: { limit: 1 } }),
          api.get("/opciones-menu", { params: { limit: 1 } }),
        ]);

        setStats({
          totalPerfiles: resPerfiles.data?.total || 0,
          totalUsuarios: resUsuarios.data?.total || 0,
          totalOpciones: resOpciones.data?.total || 0,
          loading: false,
        });
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    cargarEstadisticas();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Banner Principal Barbarian - Seguridad y Control de Acceso RBAC */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B0E0C] via-[#022A1E] to-[#063D2A] text-white p-6 sm:p-9 shadow-2xl border border-[#28D978]/30">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#28D978]/20 border border-[#28D978]/40 text-[#28D978] text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#28D978]" />
            <span>Sistema RBAC &bull; Sesión: {perfilActivo?.nombre || "Administrador"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Bienvenido, {usuario?.nombres} {usuario?.apellidoPaterno}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base mt-3 leading-relaxed">
            Plataforma configurada exclusivamente para la administración y mantenimiento de los{" "}
            <strong className="text-[#28D978]">3 Requerimientos Principales</strong> según el modelo de datos:{" "}
            <strong>Perfiles</strong>, <strong>Usuarios con asignación de Roles</strong> y{" "}
            <strong>Opciones de Menú jerárquico</strong>.
          </p>
        </div>

        {/* Resumen numérico rápido en la esquina derecha del banner */}
        <div className="hidden lg:grid grid-cols-3 gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-10">
          <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <span className="text-2xl font-black text-[#28D978]">
              {stats.loading ? "..." : stats.totalPerfiles}
            </span>
            <p className="text-[11px] text-slate-300 uppercase font-semibold mt-0.5">Perfiles</p>
          </div>
          <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <span className="text-2xl font-black text-sky-400">
              {stats.loading ? "..." : stats.totalUsuarios}
            </span>
            <p className="text-[11px] text-slate-300 uppercase font-semibold mt-0.5">Usuarios</p>
          </div>
          <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <span className="text-2xl font-black text-indigo-400">
              {stats.loading ? "..." : stats.totalOpciones}
            </span>
            <p className="text-[11px] text-slate-300 uppercase font-semibold mt-0.5">Opciones</p>
          </div>
        </div>

        {/* Halo de luz decorativo */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-[#28D978]/15 blur-3xl pointer-events-none" />
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN DE LOS 3 REQUERIMIENTOS DEL DIAGRAMA ENTIDAD-RELACIÓN */}
      {/* ===================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#063D2A]" />
            <span>Módulos y Formularios Disponibles</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            Fase de Evaluación: 3 Requerimientos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ============================================================== */}
          {/* 1. MANTENIMIENTO DE LA TABLA PERFIL */}
          {/* ============================================================== */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <Shield className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  Requerimiento #1
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                Mantenimiento de Perfiles
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Gestión completa de los roles del sistema (Tabla <code className="text-sky-700 font-semibold">Perfiles</code>) para el control de acceso y seguridad RBAC.
              </p>

              <div className="space-y-2.5 mb-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Formulario de alta y edición con campos: Nombre y Descripción</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Desactivación / Borrado lógico (EstadoRegistro = 0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Búsqueda en tiempo real y paginación</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/home/perfiles")}
              className="w-full py-3 px-4 rounded-xl bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-[#063D2A]/30 cursor-pointer"
            >
              <span>Abrir Mantenimiento de Perfiles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ============================================================== */}
          {/* 2. MANTENIMIENTO DE LA TABLA USUARIO (RELACIONADO CON PERFIL) */}
          {/* ============================================================== */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <Users className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Requerimiento #2
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Mantenimiento de Usuarios y Perfil
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Directorio y formularios de usuarios (Tabla <code className="text-emerald-700 font-semibold">Usuario</code>) vinculados a sus perfiles (Tabla <code className="text-emerald-700 font-semibold">Usuario_Perfiles</code>).
              </p>

              <div className="space-y-2.5 mb-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Formulario con DNI, Nombres, Apellidos, Celular y Correo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Selector multi-perfil para asignar/desasignar roles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Gestión segura de contraseñas hasheadas y auditoría</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/home/usuarios")}
              className="w-full py-3 px-4 rounded-xl bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-[#063D2A]/30 cursor-pointer"
            >
              <span>Abrir Mantenimiento de Usuarios</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ============================================================== */}
          {/* 3. MANTENIMIENTO DE LA TABLA OPCIONESMENU */}
          {/* ============================================================== */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <ListTree className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Requerimiento #3
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Mantenimiento de Opciones de Menú
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Estructura del árbol jerárquico de menús (Tabla <code className="text-indigo-700 font-semibold">OpcionesMenu</code>) y vinculación a perfiles autorizados (Tabla <code className="text-indigo-700 font-semibold">OpcionesMenu_Perfiles</code>).
              </p>

              <div className="space-y-2.5 mb-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Formulario de Nombre, Ruta/URL, Padre (IdPadre) y Descripción</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Configuración de relaciones padre-hijo (árbol de navegación)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Desactivación en cascada de submenús</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/home/opciones-menu")}
              className="w-full py-3 px-4 rounded-xl bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-[#063D2A]/30 cursor-pointer"
            >
              <span>Abrir Mantenimiento de Menús</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* RESUMEN DEL MODELO ENTIDAD-RELACIÓN IMPLEMENTADO */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#28D978]/10 text-[#063D2A]">
            <Database className="w-5 h-5 text-[#28D978]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Estructura de Base de Datos Vinculada (Diagrama ER Oficial)
            </h3>
            <p className="text-xs text-slate-500">
              Mapeo relacional de las 5 tablas activas en el esquema PostgreSQL / MySQL.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-sky-700 block mb-1">1. Perfiles</span>
            <p className="text-[11px] text-slate-500">IdPerfil, Nombre, Descripcion, EstadoRegistro.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-emerald-700 block mb-1">2. Usuario</span>
            <p className="text-[11px] text-slate-500">IdUsuario, DNI, Nombres, Apellidos, Celular, Correo, Clave, Auditoría.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-teal-700 block mb-1">3. Usuario_Perfiles</span>
            <p className="text-[11px] text-slate-500">IdUsuario, IdPerfil, EstadoRegistro, UsuarioAsignacion, Fechas.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-indigo-700 block mb-1">4. OpcionesMenu</span>
            <p className="text-[11px] text-slate-500">IdOpcionMenu, Nombre, UrlMenu, Descripcion, IdPadre, EstadoRegistro.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-purple-700 block mb-1">5. OpcionesMenu_Perfiles</span>
            <p className="text-[11px] text-slate-500">IdOpcionMenu, IdPerfil, Orden, EstadoRegistro.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
