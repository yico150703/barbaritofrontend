import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  AlertTriangle,
  Clock,
  CheckSquare,
  Square,
  Calendar,
  Plus,
  RefreshCw,
  BarChart2,
  Sparkles,
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

  // Estado interactivo para el checklist de turno del Miembro de Equipo
  const [checklistTurno, setChecklistTurno] = useState([
    { id: 1, texto: "Verificación de condiciones de temperatura y humedad en cámara de insumos (2°C - 4°C)", completada: true },
    { id: 2, texto: "Recepción, pesaje y verificación de lote de sacos de malta matutinos (Proveedor Maltex)", completada: true },
    { id: 3, texto: "Registro formal de guía de remisión y comprobante en Kardex de Entradas", completada: true },
    { id: 4, texto: "Alistamiento y despacho de insumos para cocción de Lote Red Ale #104", completada: false },
    { id: 5, texto: "Toma de inventario físico de existencia al cierre de turno y entrega de guardia", completada: false },
  ]);

  const toggleTarea = (id: number) => {
    setChecklistTurno((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    );
  };

  const tareasCompletadas = checklistTurno.filter((t) => t.completada).length;
  const porcentajeAvance = Math.round((tareasCompletadas / checklistTurno.length) * 100);

  // Comprobar si el usuario es técnico para habilitar retorno
  const esTecnico =
    perfilActivo?.idPerfil === 1 ||
    usuario?.perfiles?.some((p) => p.idPerfil === 1 || p.nombre.toLowerCase().includes("tecnic"));

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
                <span>Panel Técnico &bull; Seguridad y Árbol de Menús</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Panel Técnico del Sistema
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                Gestión de la arquitectura RBAC, perfiles de seguridad, árbol de navegación y cuentas de usuario.
                El menú lateral izquierdo muestra los submódulos exclusivos de administración técnica.
              </p>
            </div>
          </div>
        </div>

        {/* Módulos Principales del Panel Técnico */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* 2. Mantenimiento de Opciones de Menú */}
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
                  Consulta de rutas y URLs del sistema (30 opciones) con creación y asignación de jerarquía.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Acceder a Opciones</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Gestión de Usuarios */}
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
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 2. VISTA: PANEL ADMINISTRADOR / GERENCIAL (DASHBOARD COMPLETO)
  // ===========================================================================
  if (panel === "gerencial") {
    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Banner Superior del Panel */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B0E0C] via-[#022A1E] to-[#063D2A] text-white p-6 sm:p-8 shadow-2xl border border-[#28D978]/30">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#28D978]/20 border border-[#28D978]/40 text-[#28D978] text-xs font-bold mb-3 shadow-xs">
                <Warehouse className="w-3.5 h-3.5" />
                <span>Panel Gerencial &bull; Control Estratégico de Recursos</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Dashboard Ejecutivo y Gerencial
              </h2>
              <p className="text-slate-200 text-sm sm:text-base mt-2 leading-relaxed">
                Supervisión en tiempo real de existencias, flujo de kardex, órdenes de compra y solicitudes de insumos.
                El menú lateral contiene los 10 módulos autorizados de gestión.
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#28D978] animate-pulse" />
                  Almacén Operando al 100%
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#28D978]" />
                  {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            {esTecnico && (
              <div className="shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    await seleccionarPanel("tecnico");
                    navigate("/home/panel-tecnico");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-sm cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-[#28D978]" />
                  <span>Volver a Panel Técnico</span>
                </button>
              </div>
            )}
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#28D978]/15 blur-3xl pointer-events-none" />
        </div>

        {/* =================================================================== */}
        {/* DASHBOARD EJECUTIVO: MÉTRICAS Y KPIS CLAVE */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* KPI 1: Gestión de Stock */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Stock Total en Almacén
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">1,420</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +4.2% mes
                </span>
                <span className="text-slate-500">94.8% disponibilidad</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Kardex Hoy */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Movimientos Kardex Hoy
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">48 Transacciones</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-emerald-700 font-semibold">32 Entradas</span>
                <span className="text-amber-700 font-semibold">16 Despachos</span>
              </div>
            </div>
          </div>

          {/* KPI 3: Solicitudes de Compra */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Solicitudes Pendientes
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">7 Requerimientos</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 2 Urgentes
                </span>
                <span className="text-slate-500">Prom. 1.4 días</span>
              </div>
            </div>
          </div>

          {/* KPI 4: Órdenes de Compra */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Órdenes de Compra
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">12 Activas</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-indigo-600 font-semibold">4 en Despacho</span>
                <span className="text-slate-500">S/ 45,800 total</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* GRÁFICO VISUAL DE MOVIMIENTOS Y ALERTA DE STOCK */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Semanal de Kardex */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#063D2A]" />
                    <span>Flujo Semanal de Entradas y Salidas</span>
                  </h3>
                  <p className="text-xs text-slate-500">Transacciones de almacén durante los últimos 7 días</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-3 h-3 rounded-md bg-emerald-500" /> Entradas
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-3 h-3 rounded-md bg-amber-500" /> Salidas
                  </span>
                </div>
              </div>

              {/* Barras Semanales Visuales */}
              <div className="pt-6 pb-2 grid grid-cols-7 gap-3 sm:gap-4 items-end h-48 border-b border-slate-100">
                {[
                  { dia: "Lun", ent: 65, sal: 35 },
                  { dia: "Mar", ent: 80, sal: 50 },
                  { dia: "Mié", ent: 45, sal: 60 },
                  { dia: "Jue", ent: 90, sal: 40 },
                  { dia: "Vie", ent: 100, sal: 75 },
                  { dia: "Sáb", ent: 35, sal: 25 },
                  { dia: "Dom", ent: 20, sal: 10 },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="flex items-end gap-1 sm:gap-1.5 w-full justify-center h-36">
                      <div
                        style={{ height: `${item.ent}%` }}
                        className="w-3.5 sm:w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md group-hover:brightness-110 transition-all shadow-xs"
                        title={`Entradas: ${item.ent}`}
                      />
                      <div
                        style={{ height: `${item.sal}%` }}
                        className="w-3.5 sm:w-5 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md group-hover:brightness-110 transition-all shadow-xs"
                        title={`Salidas: ${item.sal}`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900">
                      {item.dia}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-semibold text-slate-700">Mayor rotación: Viernes (175 transacciones)</span>
              <span className="text-emerald-700 font-bold">Ratio de abastecimiento: +28% superávit</span>
            </div>
          </div>

          {/* Alerta de Reposición Inmediata */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>Stock Crítico</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  4 en Alerta
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Artículos que alcanzaron el umbral mínimo de seguridad</p>

              <div className="space-y-3">
                {[
                  { cod: "MAT-001", nombre: "Malta Pilsen 2-Row", actual: 120, min: 300, und: "Kg", nivel: "Critico" },
                  { cod: "LUP-004", nombre: "Lúpulo Cascade Pellets", actual: 15, min: 25, und: "Kg", nivel: "Bajo" },
                  { cod: "ENV-012", nombre: "Botellas Ámbar 330ml", actual: 850, min: 2000, und: "Und", nivel: "Critico" },
                  { cod: "CHA-003", nombre: "Chapas Corona Dorada", actual: 1200, min: 2500, und: "Und", nivel: "Bajo" },
                ].map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{p.cod}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${p.nivel === "Critico" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                          {p.nivel}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[150px] sm:max-w-none">{p.nombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-rose-600">{p.actual} {p.und}</p>
                      <p className="text-[10px] text-slate-400">Mín: {p.min} {p.und}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/home/solicitudes"
              className="mt-4 w-full py-2 px-3 rounded-xl bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow-sm shadow-[#063D2A]/20"
            >
              <span>Generar Solicitud de Compra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* =================================================================== */}
        {/* BITÁCORA RECIENTE DE AUDITORÍA Y ACTIVIDAD */}
        {/* =================================================================== */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#063D2A]" />
              <span>Actividad y Auditoría Reciente</span>
            </h3>
            <span className="text-xs text-slate-400">Actualizado hace un momento</span>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { usuario: "José Ríos", rol: "Gerente", accion: "Aprobó Solicitud de Compra #SC-042 (Malta Pilsen)", tiempo: "Hace 14 min", icono: ShoppingCart, color: "text-amber-600 bg-amber-50" },
              { usuario: "Roberto Díaz", rol: "Miembro de Equipo", accion: "Registró Entrada en Kardex #MOV-108 (500 kg Cebada)", tiempo: "Hace 42 min", icono: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
              { usuario: "Carlos Rodríguez", rol: "Técnico", accion: "Actualizó estructura de menú en OpcionesMenu", tiempo: "Hace 2 horas", icono: ListTree, color: "text-indigo-600 bg-indigo-50" },
              { usuario: "José Ríos", rol: "Gerente", accion: "Emitió Orden de Compra #OC-089 a Proveedor Maltas del Sur", tiempo: "Hace 3 horas", icono: FileText, color: "text-violet-600 bg-violet-50" },
            ].map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icono className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      <strong className="text-slate-900">{item.usuario}</strong> ({item.rol}): {item.accion}
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {item.tiempo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================================== */}
        {/* ACCESOS RÁPIDOS A LOS 10 MÓDULOS DE ADMINISTRACIÓN */}
        {/* =================================================================== */}
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
  // 3. VISTA: PANEL MIEMBRO DE EQUIPO (DASHBOARD OPERATIVO COMPLETO)
  // ===========================================================================
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Banner Superior del Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B0E0C] via-[#022A1E] to-[#063D2A] text-white p-6 sm:p-8 shadow-2xl border border-[#28D978]/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#28D978]/20 border border-[#28D978]/40 text-[#28D978] text-xs font-bold mb-3 shadow-xs">
              <Boxes className="w-3.5 h-3.5" />
              <span>Panel Operativo &bull; Miembro de Equipo de Almacén</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Dashboard Operativo de Almacén
            </h2>
            <p className="text-slate-200 text-sm sm:text-base mt-2 leading-relaxed">
              Módulos autorizados para recepción de insumos, conteo físico de existencias, registro de transacciones en kardex y solicitudes.
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#28D978] animate-pulse" />
                Turno Actual: Mañana (08:00 - 16:00)
              </span>
              <span>&bull;</span>
              <span>Almacén Central Barbarian</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#28D978]/15 blur-3xl pointer-events-none" />
      </div>

      {/* =================================================================== */}
      {/* DASHBOARD OPERATIVO: KPIS DEL TURNO */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kardex del Turno
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">15 Registros</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-emerald-700 font-semibold">10 Recepciones</span>
              <span className="text-slate-500">5 Despachos</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ítems Contados
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">340 Unidades</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-sky-600 font-semibold">Verificación física</span>
              <span className="text-slate-500">Al día</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Solicitudes del Turno
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">3 Asignadas</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-amber-700 font-semibold">Alistamiento</span>
              <span className="text-slate-500">Sala cocción</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Precisión de Conteo
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#063D2A] flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-[#063D2A]">99.2%</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-emerald-700 font-semibold">0 discrepancias</span>
              <span className="text-slate-500">Último cierre</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* CHECKLIST DE RUTINA DE TURNO Y ACCIONES OPERATIVAS */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist Interactivo */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <span>Checklist de Rutina del Turno</span>
              </h3>
              <p className="text-xs text-slate-500">Tareas obligatorias de control y seguridad en almacén</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700">{porcentajeAvance}% completado</span>
              <p className="text-[11px] text-slate-400">{tareasCompletadas} de {checklistTurno.length} tareas</p>
            </div>
          </div>

          {/* Barra de Progreso */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-5">
            <div
              style={{ width: `${porcentajeAvance}%` }}
              className="bg-gradient-to-r from-[#063D2A] to-[#28D978] h-full transition-all duration-300"
            />
          </div>

          {/* Lista de Tareas con Checkbox Interactivo */}
          <div className="space-y-2.5">
            {checklistTurno.map((tarea) => (
              <button
                key={tarea.id}
                type="button"
                onClick={() => toggleTarea(tarea.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  tarea.completada
                    ? "bg-emerald-50/50 border-emerald-200/80 text-slate-800"
                    : "bg-slate-50/60 border-slate-200/80 text-slate-600 hover:border-emerald-300"
                }`}
              >
                <div className="mt-0.5 shrink-0 text-emerald-600">
                  {tarea.completada ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <span className={`text-xs sm:text-sm font-medium ${tarea.completada ? "line-through text-slate-500" : "text-slate-800"}`}>
                  {tarea.texto}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas del Operario */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#28D978]" />
              <span>Acciones Rápidas</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">Atajos directos para operaciones frecuentes en almacén</p>

            <div className="space-y-3">
              <Link
                to="/home/movimientos"
                className="w-full p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Registrar Entrada / Recepción
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </Link>

              <Link
                to="/home/movimientos"
                className="w-full p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Registrar Salida / Despacho
                </span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </Link>

              <Link
                to="/home/inventario-realizar"
                className="w-full p-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                  Iniciar Conteo Físico
                </span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </Link>

              <Link
                to="/home/stock"
                className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-slate-600" />
                  Consultar Existencias (Stock)
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-800">
            <span className="font-bold block mb-1">Recordatorio de Seguridad</span>
            Todo despacho a sala de cocción debe contar con su correspondiente N° de Solicitud autorizada.
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TARJETAS DE ACCESO DIRECTO DEL PANEL OPERATIVO */}
      {/* =================================================================== */}
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
