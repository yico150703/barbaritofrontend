import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TipoPanel } from "../types";
import {
  Wrench,
  ShieldCheck,
  ListTree,
  Users,
  Boxes,
  Package,
  TrendingUp,
  FileText,
  ClipboardCheck,
  Activity,
  ArrowRight,
  ArrowLeft,
  Home,
  CheckCircle2,
  Sliders,
  Warehouse,
  ShoppingCart,
  UserPlus,
  Edit3,
  UserCheck,
} from "lucide-react";

interface PanelDashboardPageProps {
  panelTipo?: "tecnico" | "gerencial" | "miembro-equipo";
}

export const PanelDashboardPage: React.FC<PanelDashboardPageProps> = ({ panelTipo }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, perfilActivo, seleccionarPanel } = useAuth();

  // Determinar panel a partir de la propiedad o la URL actual
  const getPanelFromUrl = (): "tecnico" | "gerencial" | "miembro-equipo" => {
    if (panelTipo) return panelTipo;
    const path = location.pathname.toLowerCase();
    if (path.includes("tecnico")) return "tecnico";
    if (path.includes("miembro")) return "miembro-equipo";
    return "gerencial";
  };

  const panel = getPanelFromUrl();

  // Sincronizar el estado del panel en AuthContext para que el Sidebar muestre sus menús correspondientes
  useEffect(() => {
    seleccionarPanel(panel);
  }, [panel]);

  const volverAInicio = async () => {
    await seleccionarPanel(null);
    navigate("/home");
  };

  // ===========================================================================
  // 1. VISTA: PANEL TÉCNICO
  // ===========================================================================
  if (panel === "tecnico") {
    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Banner Superior del Panel */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-sky-800/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3">
                <Wrench className="w-3.5 h-3.5" />
                <span>Panel Técnico &bull; Administración de Seguridad y Menús</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Panel Técnico del Sistema
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                Gestión de la arquitectura RBAC, perfiles de seguridad, árbol de navegación y cuentas de usuario.
                El menú lateral izquierdo ahora muestra los submódulos exclusivos de administración técnica.
              </p>
            </div>
          </div>
        </div>

        {/* Módulos Principales del Panel Técnico */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Mantenimiento de Perfiles */}
            <Link
              to="/home/perfiles"
              className="p-6 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50/40 to-white hover:border-sky-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-4 shadow-md shadow-sky-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Mantenimiento de Perfiles
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Consulta del catálogo de roles del sistema y registro de nuevos perfiles de usuario.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>Acceder a Perfiles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Editar Perfiles */}
            <Link
              to="/home/perfiles/editar"
              className="p-6 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50/40 to-white hover:border-sky-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-md shadow-sky-600/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Editar Perfiles
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Modificación de nombres de roles, descripciones y desactivación lógica de perfiles.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>Editar Roles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Mantenimiento de Opciones de Menú */}
            <Link
              to="/home/opciones-menu"
              className="p-6 rounded-2xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 to-white hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-600/20">
                  <ListTree className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Mantenimiento de Opciones de Menú
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Consulta de rutas y URLs del sistema con creación de nuevas opciones de navegación.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Acceder a Opciones</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Editar Opciones de Menú */}
            <Link
              to="/home/opciones-menu/editar"
              className="p-6 rounded-2xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 to-white hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-700/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Editar Opciones de Menú
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ajuste de URLs, orden de presentación, asignación de padres y control de estado de menús.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Editar Opciones</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 5. Gestión de Usuarios */}
            <Link
              to="/home/usuarios"
              className="p-6 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/40 to-white hover:border-slate-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mb-4 shadow-md shadow-slate-800/20">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                  Gestión de Usuarios
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Directorio del personal institucional y alta de nuevos usuarios en el sistema.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Directorio Usuarios</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 6. Editar Usuario */}
            <Link
              to="/home/usuarios/editar"
              className="p-6 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 to-white hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-600/20">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Editar Usuario
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Actualización de datos personales, contraseñas, roles y habilitación de cuentas inactivas.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Editar Cuentas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 2. VISTA: PANEL ADMINISTRADOR / GERENCIAL
  // ===========================================================================
  if (panel === "gerencial") {
    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Banner Superior del Panel */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-amber-800/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
                <Warehouse className="w-3.5 h-3.5" />
                <span>Panel Administrador / Gerencial &bull; Control Total de Recursos</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Panel de Administración General
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                Supervisión de operaciones de inventario, stock, movimientos, catálogo de productos, personal y compras.
                El menú lateral izquierdo contiene los 10 módulos con todos sus respectivos submenús.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  await seleccionarPanel("tecnico");
                  navigate("/home/panel-tecnico");
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-sm cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-sky-400" />
                <span>Volver a Panel Técnico</span>
              </button>
            </div>
          </div>
        </div>

        {/* Métricas Gerenciales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">Gestión de Stock</span>
              <p className="text-2xl font-black text-slate-900 mt-1">1,420</p>
              <span className="text-[11px] text-amber-600 font-semibold">Ítems auditados en almacén</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">Movimientos Hoy</span>
              <p className="text-2xl font-black text-slate-900 mt-1">48 Transacciones</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Entradas y salidas registradas</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">Solicitudes de Compra</span>
              <p className="text-2xl font-black text-slate-900 mt-1">7 Pendientes</p>
              <span className="text-[11px] text-purple-600 font-semibold">Requerimientos de abastecimiento</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">Personal Registrado</span>
              <p className="text-2xl font-black text-slate-900 mt-1">3 Usuarios</p>
              <span className="text-[11px] text-indigo-600 font-semibold">Cuentas con roles asignados</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Accesos Rápidos a los 10 Módulos de Administración */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-amber-600" />
              <span>Módulos de Supervisión y Operación (10 Módulos)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Despliega el menú lateral izquierdo para ver todos los submenús
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/home/usuarios"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-900">Gestión de Usuarios</h4>
                  <p className="text-[11px] text-slate-500">Mantenimiento de cuentas</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/usuarios/editar"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">Habilitar / Editar Usuarios</h4>
                  <p className="text-[11px] text-slate-500">Reactivación de accesos</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/stock"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-900">Gestión de Stock</h4>
                  <p className="text-[11px] text-slate-500">Existencias y ajustes de stock</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/items"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900">Gestión de Ítems</h4>
                  <p className="text-[11px] text-slate-500">Catálogo de artículos</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/movimientos"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">Entradas y Salidas</h4>
                  <p className="text-[11px] text-slate-500">Kardex de almacén</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/reportes"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-sky-900">Reportes de Inventario</h4>
                  <p className="text-[11px] text-slate-500">Balances por rango de fecha</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/miembros-equipo"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">Miembros de Equipo</h4>
                  <p className="text-[11px] text-slate-500">Personal operativo</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/solicitudes"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-900">Solicitudes de Compra</h4>
                  <p className="text-[11px] text-slate-500">Requerimientos y detalle</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/inventario-realizar"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-teal-900">Realizar Inventario</h4>
                  <p className="text-[11px] text-slate-500">Conteo físico por fecha</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/home/ordenes-compra"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-violet-900">Órdenes de Compra</h4>
                  <p className="text-[11px] text-slate-500">Emisión y control</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 3. VISTA: PANEL MIEMBRO DE EQUIPO
  // ===========================================================================
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Banner Superior del Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Boxes className="w-3.5 h-3.5" />
              <span>Panel Operativo &bull; Miembro de Equipo de Almacén</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Panel Operativo de Almacén
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Módulos autorizados para recepción, conteo físico de existencias, registro de transacciones en kardex y solicitudes.
              El menú lateral contiene exactamente tus 4 submódulos operativos.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                await seleccionarPanel("tecnico");
                navigate("/home/panel-tecnico");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-sm cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-sky-400" />
              <span>Volver a Panel Técnico</span>
            </button>
          </div>
        </div>
      </div>

      {/* Métricas Operativas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500">Stock Actual</span>
            <p className="text-2xl font-black text-slate-900 mt-1">1,420</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Ítems disponibles</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500">Transacciones</span>
            <p className="text-2xl font-black text-slate-900 mt-1">15</p>
            <span className="text-[11px] text-sky-600 font-semibold">Movimientos del turno</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500">Solicitudes</span>
            <p className="text-2xl font-black text-slate-900 mt-1">2 Activas</p>
            <span className="text-[11px] text-amber-600 font-semibold">Requerimientos registrados</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500">Inventario Físico</span>
            <p className="text-2xl font-black text-slate-900 mt-1">Al día</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Conteo verificado</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tarjetas de Acceso Directo del Panel Operativo */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Boxes className="w-4 h-4 text-emerald-600" />
          <span>Módulos Operativos Asignados</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          <Link
            to="/home/stock"
            className="p-6 rounded-2xl border border-[#063D2A]/15 bg-gradient-to-b from-[#F3F1EA] to-white hover:border-[#28D978] hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#063D2A] text-white flex items-center justify-center mb-4 shadow-md shadow-[#063D2A]/20">
                <Boxes className="w-6 h-6 text-[#28D978]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#063D2A] transition-colors">
                Gestión de Stock
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Consulta de existencias actuales y niveles mínimos en tiempo real.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#063D2A]">
              <span>Ver Stock</span>
              <ArrowRight className="w-4 h-4 text-[#28D978] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/home/movimientos"
            className="p-6 rounded-2xl border border-[#063D2A]/15 bg-gradient-to-b from-[#F3F1EA] to-white hover:border-[#28D978] hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#063D2A] text-white flex items-center justify-center mb-4 shadow-md shadow-[#063D2A]/20">
                <TrendingUp className="w-6 h-6 text-[#28D978]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#063D2A] transition-colors">
                Entradas y Salidas
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Registrar transacciones de kardex para recepciones y despachos.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#063D2A]">
              <span>Kardex</span>
              <ArrowRight className="w-4 h-4 text-[#28D978] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/home/movimientos/editar"
            className="p-6 rounded-2xl border-2 border-[#28D978]/40 bg-gradient-to-b from-[#E8F8F0] to-white hover:border-[#28D978] hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#022A1E] text-white flex items-center justify-center mb-4 shadow-md shadow-[#022A1E]/30">
                <Edit3 className="w-6 h-6 text-[#28D978]" />
              </div>
              <h4 className="text-base font-bold text-[#063D2A] group-hover:text-[#022A1E] transition-colors">
                Editar Movimiento
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Modificar y rectificar movimientos de kardex registrados por ti.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#28D978]/20 flex items-center justify-between text-xs font-bold text-[#063D2A]">
              <span>Editar Kardex</span>
              <ArrowRight className="w-4 h-4 text-[#28D978] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/home/solicitudes"
            className="p-6 rounded-2xl border border-[#063D2A]/15 bg-gradient-to-b from-[#F3F1EA] to-white hover:border-[#28D978] hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#063D2A] text-white flex items-center justify-center mb-4 shadow-md shadow-[#063D2A]/20">
                <FileText className="w-6 h-6 text-[#28D978]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#063D2A] transition-colors">
                Estado de Solicitud
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Consultar requerimientos de insumos y registrar solicitudes.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#063D2A]">
              <span>Solicitudes</span>
              <ArrowRight className="w-4 h-4 text-[#28D978] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/home/inventario-realizar"
            className="p-6 rounded-2xl border border-[#063D2A]/15 bg-gradient-to-b from-[#F3F1EA] to-white hover:border-[#28D978] hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#063D2A] text-white flex items-center justify-center mb-4 shadow-md shadow-[#063D2A]/20">
                <ClipboardCheck className="w-6 h-6 text-[#28D978]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#063D2A] transition-colors">
                Realizar Inventario
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Efectuar conteos físicos rutinarios y validación por fecha.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#063D2A]">
              <span>Conteo Físico</span>
              <ArrowRight className="w-4 h-4 text-[#28D978] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
