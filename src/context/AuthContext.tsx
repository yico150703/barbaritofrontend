import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { OpcionMenu, Perfil, TipoPanel, Usuario } from "../types";

export const OPCION_INICIO: OpcionMenu = {
  idOpcionMenu: 1,
  nombre: "Inicio",
  urlMenu: "/home",
  descripcion: "Dashboard inicial y centro de acceso a paneles",
  idPadre: null,
  orden: 1,
  hijos: [],
};

export const MENU_GERENCIAL_ITEMS: OpcionMenu[] = [
  {
    idOpcionMenu: 9,
    nombre: "Gestión de usuarios",
    urlMenu: "/home/usuarios",
    idPadre: 3,
    orden: 2,
    hijos: [
      { idOpcionMenu: 10, nombre: "Editar usuario", urlMenu: "/home/usuarios/editar", idPadre: 9, orden: 1 },
    ],
  },
  {
    idOpcionMenu: 11,
    nombre: "Seguimiento de actividades",
    urlMenu: "/home/actividades",
    idPadre: 3,
    orden: 3,
  },
  {
    idOpcionMenu: 12,
    nombre: "Gestión de stock",
    urlMenu: "/home/stock",
    idPadre: 3,
    orden: 4,
    hijos: [
      { idOpcionMenu: 13, nombre: "Editar stock", urlMenu: "/home/stock/editar", idPadre: 12, orden: 1 },
    ],
  },
  {
    idOpcionMenu: 14,
    nombre: "Gestión de ítems",
    urlMenu: "/home/items",
    idPadre: 3,
    orden: 5,
    hijos: [
      { idOpcionMenu: 15, nombre: "Agregar item", urlMenu: "/home/items/agregar", idPadre: 14, orden: 1 },
      { idOpcionMenu: 16, nombre: "Editar item", urlMenu: "/home/items/editar", idPadre: 14, orden: 2 },
    ],
  },
  {
    idOpcionMenu: 17,
    nombre: "Reportes de inventario",
    urlMenu: "/home/reportes",
    idPadre: 3,
    orden: 6,
  },
  {
    idOpcionMenu: 18,
    nombre: "Entradas y salidas",
    urlMenu: "/home/movimientos",
    idPadre: 3,
    orden: 7,
    hijos: [
      { idOpcionMenu: 19, nombre: "Registrar movimiento", urlMenu: "/home/movimientos/registrar", idPadre: 18, orden: 1 },
      { idOpcionMenu: 20, nombre: "Editar movimiento", urlMenu: "/home/movimientos/editar", idPadre: 18, orden: 2 },
    ],
  },
  {
    idOpcionMenu: 21,
    nombre: "Gestión de miembros de equipo",
    urlMenu: "/home/miembros-equipo",
    idPadre: 3,
    orden: 8,
    hijos: [
      { idOpcionMenu: 22, nombre: "Agregar miembro de equipo", urlMenu: "/home/miembros-equipo/agregar", idPadre: 21, orden: 1 },
      { idOpcionMenu: 23, nombre: "Editar miembro de equipo", urlMenu: "/home/miembros-equipo/editar", idPadre: 21, orden: 2 },
    ],
  },
  {
    idOpcionMenu: 24,
    nombre: "Solicitudes de compra",
    urlMenu: "/home/solicitudes",
    idPadre: 3,
    orden: 9,
    hijos: [
      { idOpcionMenu: 25, nombre: "Registrar solicitud", urlMenu: "/home/solicitudes/registrar", idPadre: 24, orden: 1 },
      { idOpcionMenu: 26, nombre: "Detalle de solicitud", urlMenu: "/home/solicitudes/detalle", idPadre: 24, orden: 2 },
      { idOpcionMenu: 27, nombre: "Editar solicitud", urlMenu: "/home/solicitudes/editar", idPadre: 24, orden: 3 },
    ],
  },
  {
    idOpcionMenu: 28,
    nombre: "Realizar inventario",
    urlMenu: "/home/inventario-realizar",
    idPadre: 3,
    orden: 10,
  },
  {
    idOpcionMenu: 29,
    nombre: "Órdenes de compra",
    urlMenu: "/home/ordenes-compra",
    idPadre: 3,
    orden: 11,
    hijos: [
      { idOpcionMenu: 30, nombre: "Detalle de orden de compra", urlMenu: "/home/ordenes-compra/detalle", idPadre: 29, orden: 1 },
    ],
  },
];

export const MENU_MIEMBRO_ITEMS: OpcionMenu[] = [
  {
    idOpcionMenu: 12,
    nombre: "Gestión de stock",
    urlMenu: "/home/stock",
    idPadre: 4,
    orden: 1,
  },
  {
    idOpcionMenu: 18,
    nombre: "Entradas y salidas",
    urlMenu: "/home/movimientos",
    idPadre: 4,
    orden: 2,
    hijos: [
      { idOpcionMenu: 19, nombre: "Registrar movimiento", urlMenu: "/home/movimientos/registrar", idPadre: 18, orden: 1 },
      { idOpcionMenu: 20, nombre: "Editar movimiento", urlMenu: "/home/movimientos/editar", idPadre: 18, orden: 2 },
    ],
  },
  {
    idOpcionMenu: 24,
    nombre: "Solicitudes de compra",
    urlMenu: "/home/solicitudes",
    idPadre: 4,
    orden: 3,
    hijos: [
      { idOpcionMenu: 25, nombre: "Registrar solicitud", urlMenu: "/home/solicitudes/registrar", idPadre: 24, orden: 1 },
      { idOpcionMenu: 26, nombre: "Detalle de solicitud", urlMenu: "/home/solicitudes/detalle", idPadre: 24, orden: 2 },
    ],
  },
  {
    idOpcionMenu: 28,
    nombre: "Realizar inventario",
    urlMenu: "/home/inventario-realizar",
    idPadre: 4,
    orden: 4,
  },
];

export const MENU_TECNICO_TREE: OpcionMenu[] = [
  OPCION_INICIO,
  {
    idOpcionMenu: 2,
    nombre: "Panel Técnico",
    urlMenu: "/home/panel-tecnico",
    idPadre: 1,
    orden: 2,
    hijos: [
      {
        idOpcionMenu: 5,
        nombre: "Mantenimiento de Perfiles",
        urlMenu: "/home/perfiles",
        idPadre: 2,
        orden: 1,
        hijos: [
          {
            idOpcionMenu: 6,
            nombre: "Editar Perfiles",
            urlMenu: "/home/perfiles/editar",
            idPadre: 5,
            orden: 1,
          },
        ],
      },
      {
        idOpcionMenu: 7,
        nombre: "Mantenimiento de Opciones de Menú",
        urlMenu: "/home/opciones-menu",
        idPadre: 2,
        orden: 2,
        hijos: [
          {
            idOpcionMenu: 8,
            nombre: "Editar Opciones de Menú",
            urlMenu: "/home/opciones-menu/editar",
            idPadre: 7,
            orden: 1,
          },
        ],
      },
      {
        idOpcionMenu: 9,
        nombre: "Gestión de Usuarios",
        urlMenu: "/home/usuarios",
        idPadre: 2,
        orden: 3,
        hijos: [
          {
            idOpcionMenu: 10,
            nombre: "Editar Usuario",
            urlMenu: "/home/usuarios/editar",
            idPadre: 9,
            orden: 1,
          },
        ],
      },
    ],
  },
  {
    idOpcionMenu: 3,
    nombre: "Panel Gerencial",
    urlMenu: "/home/panel-gerencial",
    idPadre: 1,
    orden: 3,
    hijos: MENU_GERENCIAL_ITEMS,
  },
  {
    idOpcionMenu: 4,
    nombre: "Panel Miembro de Equipo",
    urlMenu: "/home/panel-miembro-equipo",
    idPadre: 1,
    orden: 4,
    hijos: MENU_MIEMBRO_ITEMS,
  },
];

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  perfiles: Perfil[];
  perfilActivo: Perfil | null;
  panelActivo: TipoPanel;
  menuTree: OpcionMenu[];
  sidebarCollapsed: boolean;
  loading: boolean;
  login: (correo: string, clave: string) => Promise<{ multiRol: boolean; perfiles?: Perfil[]; rutaDestino: string }>;
  seleccionarPerfil: (perfil: Perfil) => Promise<void>;
  seleccionarPanel: (panel: TipoPanel) => Promise<void>;
  logout: () => void;
  toggleSidebar: () => void;
  recargarMenu: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const raw = localStorage.getItem("almacen_usuario");
    return raw ? JSON.parse(raw) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("almacen_token") || null;
  });

  const [perfiles, setPerfiles] = useState<Perfil[]>(() => {
    const raw = localStorage.getItem("almacen_perfiles");
    return raw ? JSON.parse(raw) : [];
  });

  const [perfilActivo, setPerfilActivo] = useState<Perfil | null>(() => {
    const raw = localStorage.getItem("almacen_perfil_activo");
    return raw ? JSON.parse(raw) : null;
  });

  const [panelActivo, setPanelActivo] = useState<TipoPanel>(() => {
    const raw = localStorage.getItem("almacen_active_panel");
    if (raw === "tecnico" || raw === "gerencial" || raw === "miembro-equipo") {
      return raw as TipoPanel;
    }
    return null;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [menuTree, setMenuTree] = useState<OpcionMenu[]>(MENU_TECNICO_TREE);
  const [loading, setLoading] = useState<boolean>(true);

  // Mapear un panel al ID de perfil en backend (1=Técnico, 2=Gerente/Admin, 3=Miembro de equipo)
  const getProfileIdForPanel = (panel: TipoPanel): number => {
    switch (panel) {
      case "tecnico":
        return 1;
      case "gerencial":
        return 2;
      case "miembro-equipo":
        return 3;
      default:
        return 1;
    }
  };

  // Función para cargar el menú del panel activo desde el Backend
  const cargarMenuPorPanel = async (panel: TipoPanel, idUsuario: number) => {
    if (!panel || panel === "tecnico") {
      setMenuTree(MENU_TECNICO_TREE);
      return;
    }

    const fallbackItems = panel === "gerencial" ? MENU_GERENCIAL_ITEMS : MENU_MIEMBRO_ITEMS;

    try {
      const idPerfilTarget = getProfileIdForPanel(panel);
      const resp = await api.get(`/menu/${idUsuario}/${idPerfilTarget}`);

      if (resp.data && resp.data.success && resp.data.menu && resp.data.menu.length > 0) {
        const rawMenu: OpcionMenu[] = resp.data.menu || [];

        // Excluimos el nodo de Inicio que viene de la BD para colocarlo en primer lugar
        const modulosPanel: OpcionMenu[] = rawMenu.filter(
          (m) => m.idOpcionMenu !== 1 && m.urlMenu !== "/home" && m.urlMenu !== "/dashboard"
        );

        if (modulosPanel.length > 0) {
          setMenuTree([OPCION_INICIO, ...modulosPanel]);
          return;
        }
      }
    } catch (error) {
      console.error("Error al obtener árbol de menú para panel:", panel, error);
    }

    // Fallback asegurado usando la tabla oficial para que NUNCA quede vacío
    setMenuTree([OPCION_INICIO, ...fallbackItems]);
  };

  // Inicializar menú según ruta o estado guardado al arrancar
  useEffect(() => {
    const inicializar = async () => {
      if (usuario && token) {
        const path = window.location.pathname.toLowerCase();

        const tieneTecnico = perfiles?.some(
          (p: Perfil) => p.idPerfil === 1 || p.nombre.toLowerCase().includes("tecnic") || p.nombre.toLowerCase().includes("técnic")
        );
        const tieneGerente = perfiles?.some(
          (p: Perfil) => p.idPerfil === 2 || p.nombre.toLowerCase().includes("gerente") || p.nombre.toLowerCase().includes("admin")
        );
        const tieneMiembro = perfiles?.some(
          (p: Perfil) => p.idPerfil === 3 || p.nombre.toLowerCase().includes("miembro")
        );

        let panelDetectado: TipoPanel = null;

        // Si el usuario NO es técnico, restringir directamente a su panel correspondiente
        if (!tieneTecnico) {
          if (tieneGerente) {
            panelDetectado = "gerencial";
          } else if (tieneMiembro) {
            panelDetectado = "miembro-equipo";
          }
        } else {
          if (path === "/home" || path === "/dashboard" || path === "/") {
            panelDetectado = null;
          } else if (
            path.includes("panel-tecnico") ||
            path.includes("perfiles") ||
            path.includes("opciones-menu") ||
            path.includes("usuarios")
          ) {
            panelDetectado = "tecnico";
          } else if (
            path.includes("panel-gerencial") ||
            path.includes("items") ||
            path.includes("miembros-equipo") ||
            path.includes("reportes") ||
            path.includes("ordenes-compra") ||
            path.includes("actividades")
          ) {
            panelDetectado = "gerencial";
          } else if (path.includes("panel-miembro-equipo")) {
            panelDetectado = "miembro-equipo";
          } else {
            // Verificar si había un panel guardado en localStorage
            const guardado = localStorage.getItem("almacen_active_panel") as TipoPanel;
            panelDetectado = guardado || null;
          }
        }

        // Mantener siempre el perfil REAL del usuario (de su cuenta en la BD)
        if (perfiles && perfiles.length > 0) {
          const perfilReal = perfiles[0];
          setPerfilActivo(perfilReal);
          localStorage.setItem("almacen_perfil_activo", JSON.stringify(perfilReal));
          localStorage.setItem("almacen_active_profile_id", String(perfilReal.idPerfil));
        }

        setPanelActivo(panelDetectado);
        if (!panelDetectado || panelDetectado === "tecnico") {
          setMenuTree(MENU_TECNICO_TREE);
        } else {
          localStorage.setItem("almacen_active_panel", panelDetectado);
          await cargarMenuPorPanel(panelDetectado, usuario.idUsuario);
        }
      }
      setLoading(false);
    };
    inicializar();
  }, []);

  const login = async (correo: string, clave: string) => {
    const res = await api.post("/login", { correo, clave });
    const data = res.data;

    if (!data.success) {
      throw new Error(data.mensaje || "Error al iniciar sesión.");
    }

    const { token: nuevoToken, usuario: nuevoUsuario, perfiles: listaPerfiles } = data;

    // Guardar credenciales de sesión básicas
    localStorage.setItem("almacen_token", nuevoToken);
    localStorage.setItem("almacen_usuario", JSON.stringify(nuevoUsuario));
    localStorage.setItem("almacen_perfiles", JSON.stringify(listaPerfiles));
    localStorage.removeItem("almacen_active_panel");

    setToken(nuevoToken);
    setUsuario(nuevoUsuario);
    setPerfiles(listaPerfiles);

    if (listaPerfiles && listaPerfiles.length > 0) {
      const perfilPrincipal = listaPerfiles[0];
      setPerfilActivo(perfilPrincipal);
      localStorage.setItem("almacen_perfil_activo", JSON.stringify(perfilPrincipal));
      localStorage.setItem("almacen_active_profile_id", String(perfilPrincipal.idPerfil));
    }

    // Identificar roles para dirigir directamente al dashboard autorizado
    const tieneTecnico = listaPerfiles?.some(
      (p: Perfil) => p.idPerfil === 1 || p.nombre.toLowerCase().includes("tecnic") || p.nombre.toLowerCase().includes("técnic")
    );
    const tieneGerente = listaPerfiles?.some(
      (p: Perfil) => p.idPerfil === 2 || p.nombre.toLowerCase().includes("gerente") || p.nombre.toLowerCase().includes("admin")
    );
    const tieneMiembro = listaPerfiles?.some(
      (p: Perfil) => p.idPerfil === 3 || p.nombre.toLowerCase().includes("miembro")
    );

    let rutaDestino = "/home";

    if (tieneTecnico) {
      rutaDestino = "/home";
      setPanelActivo(null);
      setMenuTree(MENU_TECNICO_TREE);
      localStorage.removeItem("almacen_active_panel");
    } else if (tieneGerente) {
      rutaDestino = "/home";
      setPanelActivo("gerencial");
      localStorage.setItem("almacen_active_panel", "gerencial");
      await cargarMenuPorPanel("gerencial", nuevoUsuario.idUsuario);
    } else if (tieneMiembro) {
      rutaDestino = "/home";
      setPanelActivo("miembro-equipo");
      localStorage.setItem("almacen_active_panel", "miembro-equipo");
      await cargarMenuPorPanel("miembro-equipo", nuevoUsuario.idUsuario);
    } else {
      rutaDestino = "/home";
      setPanelActivo(null);
      setMenuTree(MENU_TECNICO_TREE);
    }

    return { multiRol: false, rutaDestino };
  };

  const seleccionarPerfil = async (
    perfil: Perfil,
    usr: Usuario | null = usuario
  ) => {
    const usuarioActual = usr || usuario;
    if (!usuarioActual) return;

    setPerfilActivo(perfil);
    localStorage.setItem("almacen_perfil_activo", JSON.stringify(perfil));
    localStorage.setItem("almacen_active_profile_id", String(perfil.idPerfil));
  };

  const seleccionarPanel = async (panel: TipoPanel) => {
    setPanelActivo(panel);

    if (!panel || panel === "tecnico") {
      if (panel) {
        localStorage.setItem("almacen_active_panel", panel);
      } else {
        localStorage.removeItem("almacen_active_panel");
      }
      setMenuTree(MENU_TECNICO_TREE);
      return;
    }

    // Al seleccionar Panel Gerencial o Miembro de Equipo, cargar inmediatamente su árbol de opciones
    localStorage.setItem("almacen_active_panel", panel);

    if (usuario) {
      await cargarMenuPorPanel(panel, usuario.idUsuario);
    }
  };

  const recargarMenu = async () => {
    if (usuario && panelActivo && panelActivo !== "tecnico") {
      await cargarMenuPorPanel(panelActivo, usuario.idUsuario);
    } else {
      setMenuTree(MENU_TECNICO_TREE);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("almacen_token");
    localStorage.removeItem("almacen_usuario");
    localStorage.removeItem("almacen_perfiles");
    localStorage.removeItem("almacen_perfil_activo");
    localStorage.removeItem("almacen_active_profile_id");
    localStorage.removeItem("almacen_active_panel");

    setUsuario(null);
    setToken(null);
    setPerfiles([]);
    setPerfilActivo(null);
    setPanelActivo(null);
    setMenuTree([OPCION_INICIO]);
    setSidebarCollapsed(false);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        perfiles,
        perfilActivo,
        panelActivo,
        menuTree,
        sidebarCollapsed,
        loading,
        login,
        seleccionarPerfil,
        seleccionarPanel,
        logout,
        toggleSidebar,
        recargarMenu,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
};
