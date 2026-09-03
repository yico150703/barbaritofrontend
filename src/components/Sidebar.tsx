import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { OpcionMenu } from "../types";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  Users,
  Activity,
  Boxes,
  Package,
  FileBarChart,
  ArrowLeftRight,
  ClipboardCheck,
  ShoppingCart,
  Shield,
  ListTree,
  Wrench,
  BarChart3,
  FileText,
  LucideIcon,
  Warehouse,
  ArrowLeft,
  Sliders,
} from "lucide-react";

// Mapeo inteligente de íconos según el nombre de la opción de menú
const getIconForOption = (nombre: string): LucideIcon => {
  const n = nombre.toLowerCase().trim();
  if (n === "home" || n === "inicio") return Home;
  if (n.includes("técnico") || n.includes("tecnico")) return Wrench;
  if (n.includes("perfil")) return Shield;
  if (n.includes("opciones") || n.includes("menú")) return ListTree;
  if (n.includes("gerencial")) return BarChart3;
  if (n.includes("miembro de equipo") || n.includes("me (miembro")) return Users;
  if (n.includes("usuario")) return Users;
  if (n.includes("actividad")) return Activity;
  if (n.includes("stock")) return Boxes;
  if (n.includes("ítem") || n.includes("item")) return Package;
  if (n.includes("reporte")) return FileBarChart;
  if (n.includes("entrada") || n.includes("salida") || n.includes("movimiento")) return ArrowLeftRight;
  if (n.includes("solicitud")) return FileText;
  if (n.includes("inventario")) return ClipboardCheck;
  if (n.includes("orden de compra") || n.includes("compra")) return ShoppingCart;
  return ListTree;
};

export const Sidebar: React.FC = () => {
  const { menuTree, sidebarCollapsed, toggleSidebar, perfilActivo, panelActivo, seleccionarPanel } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Acordeones abiertos (estado local en React)
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({});

  const toggleAccordion = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isRouteActive = (url: string) => {
    if (!url) return false;
    const current = location.pathname.toLowerCase();
    const target = url.toLowerCase();
    if (target === "/home" || target === "/dashboard") {
      return current === "/home" || current === "/dashboard";
    }
    return current === target || current.startsWith(target + "/");
  };

  const handleItemClick = async (item: OpcionMenu) => {
    // Si el usuario hace clic en Inicio, reseteamos el panel activo a null (Dashboard Inicial)
    if (item.idOpcionMenu === 1 || item.urlMenu === "/home" || item.urlMenu === "/dashboard") {
      await seleccionarPanel(null);
      navigate("/home");
    }
  };

  const getPanelTitle = () => {
    if (!panelActivo) return "Dashboard Inicial";
    if (panelActivo === "tecnico") return "Panel Técnico";
    if (panelActivo === "gerencial") return "Panel Administrador";
    if (panelActivo === "miembro-equipo") return "Panel Miembro";
    return perfilActivo ? perfilActivo.nombre : "Gestión RBAC";
  };

  return (
    <aside
      className={`relative bg-slate-900 text-slate-200 transition-all duration-300 ease-in-out flex flex-col z-40 shadow-xl select-none ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Encabezado del Sidebar / Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <Warehouse className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-tight text-white">
                SISTEMA ALMACÉN
              </span>
              <span className="text-[11px] text-indigo-400 font-medium truncate">
                {getPanelTitle()}
              </span>
            </div>
          )}
        </div>

        {/* Botón para expandir / contraer sidebar */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expandir menú" : "Colapsar a solo íconos"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Indicador de estado del panel activo */}
      {panelActivo && !sidebarCollapsed && (
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => handleItemClick({ idOpcionMenu: 1, nombre: "Inicio", urlMenu: "/home", idPadre: null })}
            className="w-full px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-indigo-600/30 border border-slate-700/60 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Volver al Inicio</span>
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300">
              Paneles
            </span>
          </button>
        </div>
      )}

      {/* Lista del Menú Dinámico */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5">
        {menuTree.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            {!sidebarCollapsed && "Cargando opciones..."}
          </div>
        ) : (
          menuTree.map((item) => (
            <SidebarItem
              key={item.idOpcionMenu}
              item={item}
              sidebarCollapsed={sidebarCollapsed}
              isRouteActive={isRouteActive}
              isOpen={Boolean(openAccordions[item.idOpcionMenu])}
              onToggle={(e) => toggleAccordion(item.idOpcionMenu, e)}
              onItemClick={() => handleItemClick(item)}
            />
          ))
        )}

        {/* Mensaje de ayuda si está en el Dashboard Inicial */}
        {!panelActivo && !sidebarCollapsed && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              💡 Selecciona un panel en el inicio para desplegar sus menús.
            </p>
          </div>
        )}
      </nav>

      {/* Footer del Sidebar con indicador de estado */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/20 text-center">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-semibold">
            <span>v1.0 &bull; RBAC</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" title="Sistema Activo" />
        )}
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  item: OpcionMenu;
  sidebarCollapsed: boolean;
  isRouteActive: (url: string) => boolean;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onItemClick: () => void;
  level?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  sidebarCollapsed,
  isRouteActive,
  isOpen,
  onToggle,
  onItemClick,
  level = 0,
}) => {
  const Icon = getIconForOption(item.nombre);
  const hasChildren = item.hijos && item.hijos.length > 0;
  const active = isRouteActive(item.urlMenu);

  // Si tiene hijos y alguno está activo, expandir por defecto
  const isAnyChildActive = hasChildren && item.hijos?.some((h) => isRouteActive(h.urlMenu));
  const expanded = isOpen || isAnyChildActive;

  const handleClick = (e: React.MouseEvent) => {
    onItemClick();
  };

  return (
    <div className="flex flex-col">
      {/* Item principal */}
      <div
        className={`group relative flex items-center justify-between rounded-xl transition-all duration-200 ${
          active
            ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
        } ${sidebarCollapsed ? "p-2.5 justify-center" : "px-3 py-2.5"}`}
      >
        <Link
          to={item.urlMenu}
          onClick={handleClick}
          className="flex items-center gap-3 flex-1 truncate min-w-0"
          title={sidebarCollapsed ? item.nombre : undefined}
        >
          <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
          {!sidebarCollapsed && (
            <span className="truncate text-sm font-medium leading-none">
              {item.nombre}
            </span>
          )}
        </Link>

        {/* Flecha de acordeón para opciones con hijos */}
        {hasChildren && !sidebarCollapsed && (
          <button
            onClick={onToggle}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-transform"
            aria-label="Desplegar submenú"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                expanded ? "transform rotate-180 text-indigo-400" : ""
              }`}
            />
          </button>
        )}

        {/* Tooltip flotante al colapsar el sidebar */}
        {sidebarCollapsed && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-slate-700">
            {item.nombre}
            {hasChildren && ` (${item.hijos?.length} submenús)`}
          </div>
        )}
      </div>

      {/* Submenús en Acordeón (solo cuando el sidebar no está colapsado) */}
      {hasChildren && !sidebarCollapsed && expanded && (
        <div className="ml-4 pl-3 my-1 border-l border-slate-800 space-y-1">
          {item.hijos?.map((subItem) => {
            const subActive = isRouteActive(subItem.urlMenu);
            const SubIcon = getIconForOption(subItem.nombre);
            return (
              <Link
                key={subItem.idOpcionMenu}
                to={subItem.urlMenu}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  subActive
                    ? "bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <SubIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{subItem.nombre}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
