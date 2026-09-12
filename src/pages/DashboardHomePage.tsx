import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TipoPanel } from "../types";
import {
  Wrench,
  Warehouse,
  Boxes,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ListTree,
  TrendingUp,
  Layers,
  Sparkles,
} from "lucide-react";

export const DashboardHomePage: React.FC = () => {
  const { usuario, perfilActivo, perfiles, seleccionarPanel } = useAuth();
  const navigate = useNavigate();

  // Asegurar que al estar en el Dashboard Inicial, el menú lateral contenga ÚNICAMENTE "Inicio"
  useEffect(() => {
    seleccionarPanel(null);
  }, []);

  // Comprobar si el usuario tiene rol Técnico
  const esTecnico =
    perfilActivo?.idPerfil === 1 ||
    perfiles.some((p) => p.idPerfil === 1 || p.nombre.toLowerCase().includes("técnico") || p.nombre.toLowerCase().includes("tecnico"));

  // Comprobar si es Gerente / Administrador
  const esGerente =
    perfilActivo?.idPerfil === 2 ||
    perfiles.some((p) => p.idPerfil === 2 || p.nombre.toLowerCase().includes("gerente") || p.nombre.toLowerCase().includes("admin"));

  // Comprobar si es Miembro de equipo
  const esMiembro =
    perfilActivo?.idPerfil === 3 ||
    perfiles.some((p) => p.idPerfil === 3 || p.nombre.toLowerCase().includes("miembro"));

  const handleEntrarPanel = async (panel: TipoPanel, ruta: string) => {
    await seleccionarPanel(panel);
    navigate(ruta);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Banner Principal de Bienvenida Barbarian */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B0E0C] via-[#022A1E] to-[#063D2A] text-white p-6 sm:p-9 shadow-2xl border border-[#28D978]/30">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#28D978]/20 border border-[#28D978]/40 text-[#28D978] text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#28D978]" />
            <span>Dashboard Inicial &bull; Sesión: {perfilActivo?.nombre || "Usuario"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Bienvenido, {usuario?.nombres} {usuario?.apellidoPaterno}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base mt-3 leading-relaxed">
            {esTecnico ? (
              <>
                Como <strong className="text-white">Técnico</strong> cuentas con{" "}
                <span className="text-[#28D978] font-bold">acceso general a todos los módulos del sistema</span>.
                Selecciona a continuación el panel al que deseas ingresar para desplegar sus menús y submódulos autorizados.
              </>
            ) : esGerente ? (
              <>
                Has ingresado con el rol de <strong className="text-white">Administrador / Gerente</strong>.
                Haz clic en tu panel de control para desplegar los 10 módulos y submenús autorizados de supervisión.
              </>
            ) : (
              <>
                Has ingresado con el rol de <strong className="text-white">Miembro de Equipo</strong>.
                Haz clic en tu panel operativo para desplegar tus 5 submódulos autorizados de almacén e inventario.
              </>
            )}
          </p>
        </div>

        {/* Círculo de luz decorativo en verde brillante */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-[#28D978]/15 blur-3xl pointer-events-none" />
      </div>

      {/* ===================================================================== */}
      {/* TARJETAS DE PANELES DE ACCESO */}
      {/* ===================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#063D2A]" />
            <span>{esTecnico ? "Paneles Disponibles en el Sistema" : "Tu Panel de Control"}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {esTecnico ? "3 paneles con acceso irrestricto" : "Acceso configurado según perfil"}
          </span>
        </div>

        {/* 1. VISTA PARA TÉCNICO: MUESTRA LOS 3 PANELES */}
        {esTecnico && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1: Panel Técnico */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
                    <Wrench className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    Panel #1 &bull; Técnico
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                  Panel Técnico
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Mantenimiento de seguridad del sistema, administración de perfiles de usuario, árbol jerárquico de menús y asignación de permisos.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Mantenimiento de Perfiles (Roles)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Mantenimiento de Opciones de Menú</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Gestión, Edición y Habilitación de Usuarios</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleEntrarPanel("tecnico", "/home/panel-tecnico")}
                className="w-full py-3 px-4 rounded-xl bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-[#063D2A]/30 cursor-pointer"
              >
                <span>Ingresar al Panel Técnico</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Tarjeta 2: Panel Administrador / Gerencial */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Warehouse className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Panel #2 &bull; Administrador
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  Panel Administrador
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Supervisión gerencial de inventario: existencias, entradas y salidas, catálogo de ítems, solicitudes, miembros de equipo y reportes.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>10 Módulos de Supervisión General</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Control de Stock, Ítems y Kardex</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Compras, Solicitudes y Reportes</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleEntrarPanel("gerencial", "/home/panel-gerencial")}
                className="w-full py-3 px-4 rounded-xl bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-[#063D2A]/30 cursor-pointer"
              >
                <span>Ingresar al Panel Administrador</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Tarjeta 3: Panel Miembro de Equipo */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Boxes className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Panel #3 &bull; Miembro de Equipo
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Panel Miembro de Equipo
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Módulos operativos directos de almacén: consulta de existencias, recepción y despacho de productos, solicitudes e inventario físico.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Consulta de Stock en Almacén</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Registro de Entradas y Salidas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Conteo Físico por Fecha e Inventario</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleEntrarPanel("miembro-equipo", "/home/panel-miembro-equipo")}
                className="w-full py-3 px-4 rounded-xl bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-[#063D2A]/30 cursor-pointer"
              >
                <span>Ingresar al Panel Miembro de Equipo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* 2. VISTA PARA ADMINISTRADOR / GERENTE */}
        {!esTecnico && esGerente && (
          <div className="max-w-xl mx-auto">
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-amber-200/90 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Warehouse className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Panel Asignado &bull; Administrador
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Panel de Administración y Gerencia
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Accede a todos los módulos de supervisión autorizados para tu cuenta: Gestión de Usuarios, Stock, Catálogo de Ítems, Movimientos, Solicitudes, Miembros y Reportes.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>10 Módulos de Supervisión con sus Submenús Acordeón</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Control de Kardex, Existencias y Ajustes Físicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Auditoría de Movimientos y Emisión de Compras</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleEntrarPanel("gerencial", "/home/panel-gerencial")}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-all shadow-md shadow-amber-600/30 flex items-center justify-center gap-2"
              >
                <span>Ingresar a mi Panel de Administrador</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 3. VISTA PARA MIEMBRO DE EQUIPO */}
        {!esTecnico && !esGerente && esMiembro && (
          <div className="max-w-xl mx-auto">
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-emerald-200/90 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Boxes className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Panel Asignado &bull; Operativo
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Panel de Operaciones de Almacén
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Accede a tus módulos operativos asignados: Consulta de Stock, Registro de Movimientos de Entrada y Salida, Monitoreo de Solicitudes y Toma Física de Inventario.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Consulta de Stock y Existencias Actuales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Registro de Entradas y Salidas de Almacén</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Formulario de Conteo Físico e Inventario</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleEntrarPanel("miembro-equipo", "/home/panel-miembro-equipo")}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <span>Ingresar a mi Panel Operativo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
