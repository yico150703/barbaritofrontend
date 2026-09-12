import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { OpcionMenu } from "../types";
import vikingLogoImg from "../assets/barbarian_viking_logo.jpg";
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
  Warehouse,
  Edit3,
  FileText,
  LucideIcon,
  ArrowLeft,
} from "lucide-react";

// Mapeo inteligente de íconos según el nombre de la opción de menú
const getIconForOption = (nombre: string): LucideIcon => {
  const n = nombre.toLowerCase().trim();
  if (n === "home" || n === "inicio") return Home;
  if (n.includes("técnico") || n.includes("tecnico")) return Wrench;
  if (n.includes("perfil")) return Shield;
  if (n.includes("opciones") || n.includes("menú") || n.includes("menu")) return ListTree;
  if (n.includes("gerencial") || n.includes("admin")) return Warehouse;
  if (n.includes("miembro de equipo") || n.includes("me (miembro") || n.includes("operativ")) return Boxes;
  if (n.includes("editar usuario") || n.includes("editar")) return Edit3;
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
  const { menuTree, sidebarCollapsed, toggleSidebar, perfilActivo, panelActivo, seleccionarPanel, perfiles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Comprobar si el usuario tiene rol de técnico
  const esTecnico =
    perfilActivo?.idPerfil === 1 ||
    perfiles?.some(
      (p) =>
        p.idPerfil === 1 ||
        p.nombre.toLowerCase().includes("técnico") ||
        p.nombre.toLowerCase().includes("tecnico")
    );

  // Acordeones abiertos (todos cerrados por defecto al ingresar a un panel o login)
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({});

  // Cada vez que se ingrese a un panel o cambie de panel/perfil, cerrar todos los acordeones predeterminadamente
  useEffect(() => {
    setOpenAccordions({});
  }, [panelActivo, perfilActivo?.idPerfil]);

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
    if (item.idOpcionMenu === 1 || item.urlMenu === "/home" || item.urlMenu === "/dashboard") {
      if (esTecnico) {
        await seleccionarPanel(null);
      }
      navigate("/home");
      return;
    }
    if (item.urlMenu.includes("panel-tecnico")) {
      await seleccionarPanel("tecnico");
      navigate("/home/panel-tecnico");
      return;
    }
    if (item.urlMenu.includes("panel-gerencial")) {
      await seleccionarPanel("gerencial");
      navigate("/home/panel-gerencial");
      return;
    }
    if (item.urlMenu.includes("panel-miembro-equipo")) {
      await seleccionarPanel("miembro-equipo");
      navigate("/home/panel-miembro-equipo");
      return;
    }
    navigate(item.urlMenu);
  };

  const getPanelTitle = () => {
    if (!panelActivo || panelActivo === "tecnico") return "Panel Técnico";
    if (panelActivo === "gerencial") return "Panel Administrador";
    if (panelActivo === "miembro-equipo") return "Panel Miembro";
    return perfilActivo ? perfilActivo.nombre : "Gestión RBAC";
  };

  return (
    <aside
      className={`relative bg-[#022A1E] text-slate-100 transition-all duration-300 ease-in-out flex flex-col z-40 shadow-2xl border-r border-[#063D2A]/80 select-none ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Encabezado del Sidebar / Logo BARBARIAN */}
      <div className="h-18 flex items-center justify-between px-4 border-b border-[#063D2A] bg-[#0B0E0C]/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#063D2A] border border-[#28D978]/40 flex items-center justify-center shrink-0 shadow-md shadow-black/40 p-0.5">
            <img
              src={vikingLogoImg}
              alt="Barbarian Viking"
              className="w-full h-full object-cover rounded-lg brightness-110"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-['Bebas_Neue'] tracking-[0.2em] text-xl text-white font-black leading-none drop-shadow-sm">
                BARBARIAN
              </span>
              <span className="text-[10px] text-[#28D978] font-bold uppercase tracking-wider truncate mt-0.5">
                {getPanelTitle()}
              </span>
            </div>
          )}
        </div>

        {/* Botón para expandir / contraer sidebar */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expandir menú" : "Colapsar a solo íconos"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#063D2A] transition-colors shrink-0 cursor-pointer"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#28D978]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>

      {/* Lista del Menú Dinámico */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5">
        {/* Acceso rápido para regresar a Panel Técnico: solo visible para el Técnico cuando navega dentro del Panel Gerencial */}
        {esTecnico && panelActivo === "gerencial" && (
          <div className="mb-2 pb-2 border-b border-[#063D2A]/60">
            <button
              type="button"
              onClick={async () => {
                await seleccionarPanel("tecnico");
                navigate("/home/panel-tecnico");
              }}
              title="Volver a Panel Técnico"
              className={`w-full flex items-center gap-2.5 rounded-xl bg-sky-950/70 hover:bg-sky-900/90 text-sky-300 border border-sky-500/40 text-xs font-bold transition-all shadow-xs cursor-pointer ${
                sidebarCollapsed ? "p-2.5 justify-center" : "px-3 py-2 justify-between"
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Wrench className="w-4 h-4 text-sky-400 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">Volver a Panel Técnico</span>}
              </span>
              {!sidebarCollapsed && <ArrowLeft className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
            </button>
          </div>
        )}
        {menuTree.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            {!sidebarCollapsed && "Cargando opciones..."}
          </div>
        ) : (
          menuTree.map((item) => (
            <SidebarItem
              key={item.idOpcionMenu}
              item={item}
              sidebarCollapsed={sidebarCollapsed}
              isRouteActive={isRouteActive}
              openAccordions={openAccordions}
              toggleAccordion={toggleAccordion}
              onItemClick={handleItemClick}
              level={0}
            />
          ))
        )}
      </nav>

      {/* Footer del Sidebar con indicador de estado estilo Barbarian */}
      <div className="p-3.5 border-t border-[#063D2A] bg-[#0B0E0C]/60 text-center">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-semibold">
            <span className="truncate">Barbarian Inventory</span>
            <span className="text-[#28D978] flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#28D978] animate-pulse shadow-[0_0_6px_#28D978]" />
              Conectado
            </span>
          </div>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-[#28D978] mx-auto shadow-[0_0_8px_#28D978]" title="Sistema Barbarian Conectado" />
        )}
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  item: OpcionMenu;
  sidebarCollapsed: boolean;
  isRouteActive: (url: string) => boolean;
  openAccordions: Record<number, boolean>;
  toggleAccordion: (id: number, e: React.MouseEvent) => void;
  onItemClick: (item: OpcionMenu) => void;
  level?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  sidebarCollapsed,
  isRouteActive,
  openAccordions,
  toggleAccordion,
  onItemClick,
  level = 0,
}) => {
  const Icon = getIconForOption(item.nombre);
  const hasChildren = Boolean(item.hijos && item.hijos.length > 0);
  const active = isRouteActive(item.urlMenu);

  // Los acordeones siempre inician cerrados predeterminadamente para todos los usuarios
  const expanded = Boolean(openAccordions[item.idOpcionMenu]);

  const handleRowClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      toggleAccordion(item.idOpcionMenu, e);
    }
    onItemClick(item);
  };

  return (
    <div className="flex flex-col">
      {/* Item principal */}
      <div
        className={`group relative flex items-center justify-between rounded-xl transition-all duration-200 ${
          active
            ? "bg-[#063D2A] text-white font-bold border border-[#28D978]/50 shadow-md shadow-[#063D2A]/60"
            : "text-slate-300 hover:bg-[#063D2A]/60 hover:text-white"
        } ${sidebarCollapsed ? "p-2.5 justify-center" : level > 0 ? "px-2.5 py-2" : "px-3 py-2.5"}`}
      >
        <Link
          to={item.urlMenu}
          onClick={handleRowClick}
          className="flex items-center gap-3 flex-1 truncate min-w-0 cursor-pointer"
          title={sidebarCollapsed ? item.nombre : undefined}
        >
          <Icon
            className={`${level > 0 ? "w-4 h-4" : "w-5 h-5"} shrink-0 transition-colors ${
              active ? "text-[#28D978]" : "text-slate-400 group-hover:text-[#28D978]"
            }`}
          />
          {!sidebarCollapsed && (
            <span className={`truncate leading-none ${level > 0 ? "text-xs font-medium" : "text-sm font-medium"}`}>
              {item.nombre}
            </span>
          )}
        </Link>

        {/* Flecha de acordeón para opciones con hijos */}
        {hasChildren && !sidebarCollapsed && (
          <button
            type="button"
            onClick={(e) => toggleAccordion(item.idOpcionMenu, e)}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-transform cursor-pointer"
            aria-label="Desplegar submenú"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                expanded ? "transform rotate-180 text-[#28D978]" : ""
              }`}
            />
          </button>
        )}

        {/* Tooltip flotante al colapsar el sidebar */}
        {sidebarCollapsed && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B0E0C] text-white text-xs rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-[#28D978]/30">
            {item.nombre}
            {hasChildren && ` (${item.hijos?.length} submenús)`}
          </div>
        )}
      </div>

      {/* Submenús en Acordeón Recursivo */}
      {hasChildren && !sidebarCollapsed && expanded && (
        <div className={`my-1 border-l-2 border-[#063D2A] space-y-1 ${level === 0 ? "ml-4 pl-3" : "ml-3 pl-2.5"}`}>
          {item.hijos?.map((subItem) => (
            <SidebarItem
              key={subItem.idOpcionMenu}
              item={subItem}
              sidebarCollapsed={sidebarCollapsed}
              isRouteActive={isRouteActive}
              openAccordions={openAccordions}
              toggleAccordion={toggleAccordion}
              onItemClick={onItemClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
