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

export const MENU_TECNICO_TREE: OpcionMenu[] = [
  OPCION_INICIO,
  {
    idOpcionMenu: 10,
    nombre: "Panel Técnico",
    urlMenu: "/home/panel-tecnico",
    idPadre: null,
    orden: 2,
    hijos: [
      {
        idOpcionMenu: 11,
        nombre: "Mantenimiento de Perfiles",
        urlMenu: "/home/perfiles",
        idPadre: 10,
        orden: 1,
      },
      {
        idOpcionMenu: 12,
        nombre: "Mantenimiento de Opciones de Menú",
        urlMenu: "/home/opciones-menu",
        idPadre: 10,
        orden: 2,
      },
      {
        idOpcionMenu: 13,
        nombre: "Gestión de Usuarios",
        urlMenu: "/home/usuarios",
        idPadre: 10,
        orden: 3,
        hijos: [
          {
            idOpcionMenu: 14,
            nombre: "Editar Usuario",
            urlMenu: "/home/usuarios/editar",
            idPadre: 13,
            orden: 1,
          },
        ],
      },
    ],
  },
  {
    idOpcionMenu: 20,
    nombre: "Panel Gerencial",
    urlMenu: "/home/panel-gerencial",
    idPadre: null,
    orden: 3,
  },
  {
    idOpcionMenu: 30,
    nombre: "Panel Miembro de Equipo",
    urlMenu: "/home/panel-miembro-equipo",
    idPadre: null,
    orden: 4,
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
  login: (correo: string, clave: string) => Promise<{ multiRol: boolean; perfiles?: Perfil[] }>;
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

    try {
      const idPerfilTarget = getProfileIdForPanel(panel);
      const resp = await api.get(`/menu/${idUsuario}/${idPerfilTarget}`);

      if (resp.data && resp.data.success) {
        const rawMenu: OpcionMenu[] = resp.data.menu || [];

        // Para Gerencial y Miembro de Equipo: excluimos el nodo de Inicio que viene de la BD
        const modulosPanel: OpcionMenu[] = rawMenu.filter(
          (m) => m.idOpcionMenu !== 1 && m.urlMenu !== "/home" && m.urlMenu !== "/dashboard"
        );

        // Asegurar que para miembro de equipo "Entradas y salidas" contenga tanto Registrar como Editar movimiento
        if (panel === "miembro-equipo") {
          const itemMov = modulosPanel.find(
            (m) => m.urlMenu === "/home/movimientos" || m.nombre.toLowerCase().includes("entradas")
          );
          if (itemMov) {
            if (!itemMov.hijos) itemMov.hijos = [];
            const tieneRegistrar = itemMov.hijos.some((h) => h.urlMenu === "/home/movimientos/registrar");
            const tieneEditar = itemMov.hijos.some((h) => h.urlMenu === "/home/movimientos/editar");
            if (!tieneRegistrar) {
              itemMov.hijos.push({
                idOpcionMenu: 15,
                nombre: "Registrar movimiento",
                urlMenu: "/home/movimientos/registrar",
                idPadre: itemMov.idOpcionMenu,
              });
            }
            if (!tieneEditar) {
              itemMov.hijos.push({
                idOpcionMenu: 16,
                nombre: "Editar movimiento",
                urlMenu: "/home/movimientos/editar",
                idPadre: itemMov.idOpcionMenu,
              });
            }
          }
        }

        // El menú final del panel siempre tiene 'Inicio' al principio + todos los módulos de ese rol
        setMenuTree([OPCION_INICIO, ...modulosPanel]);
      } else {
        setMenuTree([OPCION_INICIO]);
      }
    } catch (error) {
      console.error("Error al obtener árbol de menú para panel:", panel, error);
      setMenuTree([OPCION_INICIO]);
    }
  };

  // Inicializar menú según ruta o estado guardado al arrancar
  useEffect(() => {
    const inicializar = async () => {
      if (usuario && token) {
        const path = window.location.pathname.toLowerCase();

        let panelDetectado: TipoPanel = null;
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

    setPanelActivo(null);
    setMenuTree(MENU_TECNICO_TREE);

    return { multiRol: false };
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
