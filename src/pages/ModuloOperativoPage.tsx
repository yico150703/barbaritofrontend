import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  Package,
  Boxes,
  ArrowLeftRight,
  FileText,
  ClipboardCheck,
  FileBarChart,
  Activity,
  Users,
  UserPlus,
  Edit3,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  UserCheck,
} from "lucide-react";

export const ModuloOperativoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, perfilActivo } = useAuth();
  const path = location.pathname.toLowerCase();

  // Estados exclusivos para Gestión de Miembros de Equipo
  const [miembros, setMiembros] = useState<any[]>([]);
  const [loadingMiembros, setLoadingMiembros] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  // Formulario: Agregar Miembro de Equipo (/home/miembros-equipo/agregar)
  const [formMiembro, setFormMiembro] = useState({
    dni: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    celular: "",
    correoElectronico: "",
    clave: "password123",
  });

  // Formulario: Editar Miembro de Equipo (/home/miembros-equipo/editar)
  const [selectedMiembroId, setSelectedMiembroId] = useState<string>("");
  const [formEditMiembro, setFormEditMiembro] = useState({
    dni: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    celular: "",
    correoElectronico: "",
    estadoRegistro: 1,
  });

  // Cargar miembros de equipo desde la base de datos
  const cargarMiembros = async () => {
    try {
      setLoadingMiembros(true);
      const res = await api.get("/miembros-equipo");
      if (res.data.success) {
        const lista = res.data.miembros || [];
        setMiembros(lista);
        if (lista.length > 0 && !selectedMiembroId) {
          handleSelectEditMiembro(String(lista[0].idUsuario), lista);
        }
      }
    } catch (err) {
      console.error("Error al cargar miembros de equipo:", err);
    } finally {
      setLoadingMiembros(false);
    }
  };

  useEffect(() => {
    if (path.includes("miembros-equipo")) {
      cargarMiembros();
    }
  }, [path]);

  const handleSelectEditMiembro = (idStr: string, lista = miembros) => {
    setSelectedMiembroId(idStr);
    const mb = lista.find((m) => String(m.idUsuario) === idStr);
    if (mb) {
      setFormEditMiembro({
        dni: mb.dni || "",
        nombres: mb.nombres || "",
        apellidoPaterno: mb.apellidoPaterno || "",
        apellidoMaterno: mb.apellidoMaterno || "",
        celular: mb.celular ? String(mb.celular) : "",
        correoElectronico: mb.correoElectronico || "",
        estadoRegistro: mb.estadoRegistro ?? 1,
      });
    }
  };

  const handleGuardarMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMiembro.dni || !formMiembro.nombres || !formMiembro.apellidoPaterno || !formMiembro.correoElectronico) {
      setMensajeError("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.post("/miembros-equipo", formMiembro);
      setMensajeExito(res.data.mensaje || "Miembro de equipo registrado con éxito en la base de datos.");
      setFormMiembro({
        dni: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        celular: "",
        correoElectronico: "",
        clave: "password123",
      });
      cargarMiembros();
    } catch (err: any) {
      if (err.response?.status === 409 || err.response?.data?.yaExiste) {
        setMensajeError(`⚠️ El miembro con DNI '${formMiembro.dni}' o correo ya existe en la base de datos. No se duplicará.`);
      } else {
        setMensajeError(err.response?.data?.mensaje || "Error al registrar el miembro de equipo.");
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleActualizarMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMiembroId) {
      setMensajeError("Debe seleccionar un miembro para editar.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.put(`/miembros-equipo/${selectedMiembroId}`, formEditMiembro);
      setMensajeExito(res.data.mensaje || "Miembro de equipo actualizado con éxito en la base de datos.");
      cargarMiembros();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al actualizar miembro.");
    } finally {
      setGuardando(false);
    }
  };

  // Título e información correspondiente a cada ruta (Separación estricta de Solicitudes vs Órdenes de Compra)
  const getModuloInfo = (currentPath: string) => {
    const p = currentPath.toLowerCase();

    // 1. Solicitudes de Compra (Separadas de Órdenes de Compra)
    if (p === "/home/solicitudes/registrar") {
      return { titulo: "Registrar Solicitud de Compra", descripcion: "Formulario para registro de requerimientos de abastecimiento de insumos.", icono: FileText };
    }
    if (p === "/home/solicitudes/editar") {
      return { titulo: "Editar Solicitud de Compra", descripcion: "Modificación de requerimientos y estados de solicitud de insumos.", icono: FileText };
    }
    if (p === "/home/solicitudes/detalle") {
      return { titulo: "Detalle de Solicitud de Compra", descripcion: "Consulta de información y especificaciones de solicitudes de compra.", icono: FileText };
    }
    if (p === "/home/solicitudes" || p.startsWith("/home/solicitudes")) {
      return { titulo: "Solicitudes de Compra", descripcion: "Monitoreo de solicitudes y requerimientos de insumos.", icono: FileText };
    }

    // 2. Órdenes de Compra (Separadas de Solicitudes)
    if (p === "/home/ordenes-compra/detalle") {
      return { titulo: "Detalle de Orden de Compra", descripcion: "Detalle de órdenes de abastecimiento y pedidos a proveedores.", icono: ShoppingCart };
    }
    if (p === "/home/ordenes-compra" || p.startsWith("/home/ordenes-compra")) {
      return { titulo: "Órdenes de Compra", descripcion: "Emisión y control de órdenes de compra del almacén.", icono: ShoppingCart };
    }

    // 3. Catálogo de Ítems
    if (p === "/home/items/agregar") {
      return { titulo: "Agregar Ítem", descripcion: "Registro de nuevos productos en el catálogo de almacén.", icono: Package };
    }
    if (p === "/home/items/editar") {
      return { titulo: "Editar Ítem", descripcion: "Modificación de especificaciones de productos en el catálogo maestro.", icono: Package };
    }
    if (p === "/home/items" || p.startsWith("/home/items")) {
      return { titulo: "Gestión de Ítems", descripcion: "Catálogo maestro de productos, insumos y artículos de almacén.", icono: Package };
    }

    // 4. Gestión de Stock
    if (p === "/home/stock/editar") {
      return { titulo: "Editar Stock", descripcion: "Ajuste y corrección de existencias en almacén.", icono: Boxes };
    }
    if (p === "/home/stock" || p.startsWith("/home/stock")) {
      return { titulo: "Gestión de Stock", descripcion: "Consulta de existencias, niveles mínimos y alertas de reposición.", icono: Boxes };
    }

    // 5. Entradas y Salidas / Movimientos
    if (p === "/home/movimientos/registrar") {
      return { titulo: "Registrar Movimiento", descripcion: "Formulario de registro de movimientos de almacén.", icono: ArrowLeftRight };
    }
    if (p === "/home/movimientos/editar") {
      return { titulo: "Editar Movimiento", descripcion: "Corrección de transacciones registradas en el kardex.", icono: ArrowLeftRight };
    }
    if (p === "/home/movimientos" || p.startsWith("/home/movimientos")) {
      return { titulo: "Entradas y Salidas", descripcion: "Kardex general de movimientos y transacciones de almacén.", icono: ArrowLeftRight };
    }

    // 6. Inventario
    if (p.includes("inventario")) {
      return { titulo: "Realizar Inventario", descripcion: "Toma física de inventario cíclico y auditoría de existencias.", icono: ClipboardCheck };
    }

    // 7. Reportes
    if (p.includes("reportes")) {
      return { titulo: "Reportes de Inventario", descripcion: "Generación de métricas, balances e informes ejecutivos de almacén.", icono: FileBarChart };
    }

    // 8. Actividades
    if (p.includes("actividades")) {
      return { titulo: "Seguimiento de Actividades", descripcion: "Bitácora de auditoría y trazabilidad de operaciones del sistema.", icono: Activity };
    }

    return { titulo: "Módulo Operativo", descripcion: "Módulo del sistema de almacén.", icono: Package };
  };

  // ===========================================================================
  // 1. CASO EXCEPCIÓN: GESTIÓN DE MIEMBROS DE EQUIPO (FORMULARIOS ACTIVOS)
  // ===========================================================================

  // 1.1 Formulario: Agregar Miembro de Equipo
  if (path.includes("miembros-equipo/agregar")) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Dar de Alta Miembro de Equipo</h2>
              <p className="text-xs text-slate-500">
                Registra un nuevo usuario operativo en la base de datos PostgreSQL.
              </p>
            </div>
          </div>

          {mensajeExito && (
            <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{mensajeExito}</span>
            </div>
          )}

          {mensajeError && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{mensajeError}</span>
            </div>
          )}

          <form onSubmit={handleGuardarMiembro} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">DNI (8 dígitos) *</label>
                <input
                  type="text"
                  maxLength={8}
                  required
                  placeholder="Ej. 70889912"
                  value={formMiembro.dni}
                  onChange={(e) => setFormMiembro({ ...formMiembro, dni: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Celular (9 dígitos)</label>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="Ej. 987654321"
                  value={formMiembro.celular}
                  onChange={(e) => setFormMiembro({ ...formMiembro, celular: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nombres *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Carlos"
                  value={formMiembro.nombres}
                  onChange={(e) => setFormMiembro({ ...formMiembro, nombres: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Apellido Paterno *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Quispe"
                  value={formMiembro.apellidoPaterno}
                  onChange={(e) => setFormMiembro({ ...formMiembro, apellidoPaterno: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Apellido Materno</label>
                <input
                  type="text"
                  placeholder="Ej. Mamani"
                  value={formMiembro.apellidoMaterno}
                  onChange={(e) => setFormMiembro({ ...formMiembro, apellidoMaterno: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@gmail.com"
                  value={formMiembro.correoElectronico}
                  onChange={(e) => setFormMiembro({ ...formMiembro, correoElectronico: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/home/miembros-equipo")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Volver a la Lista
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Registrando..." : "Dar de Alta Miembro"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 1.2 Formulario: Editar Miembro de Equipo
  if (path.includes("miembros-equipo/editar")) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Editar Ficha de Miembro de Equipo</h2>
              <p className="text-xs text-slate-500">
                Selecciona al miembro y actualiza sus datos o su estado de registro.
              </p>
            </div>
          </div>

          {mensajeExito && (
            <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{mensajeExito}</span>
            </div>
          )}

          {mensajeError && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{mensajeError}</span>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Seleccionar Miembro de Equipo a Modificar *
            </label>
            <select
              value={selectedMiembroId}
              onChange={(e) => handleSelectEditMiembro(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            >
              {miembros.length === 0 && <option value="">No hay miembros cargados</option>}
              {miembros.map((mb) => (
                <option key={mb.idUsuario} value={mb.idUsuario}>
                  {mb.nombreCompleto || `${mb.nombres} ${mb.apellidoPaterno}`} (DNI: {mb.dni} - Correo: {mb.correoElectronico})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleActualizarMiembro} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">DNI (8 dígitos)</label>
                <input
                  type="text"
                  maxLength={8}
                  value={formEditMiembro.dni}
                  onChange={(e) => setFormEditMiembro({ ...formEditMiembro, dni: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Celular (9 dígitos)</label>
                <input
                  type="text"
                  maxLength={9}
                  value={formEditMiembro.celular}
                  onChange={(e) => setFormEditMiembro({ ...formEditMiembro, celular: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nombres</label>
                <input
                  type="text"
                  value={formEditMiembro.nombres}
                  onChange={(e) => setFormEditMiembro({ ...formEditMiembro, nombres: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Apellido Paterno</label>
                <input
                  type="text"
                  value={formEditMiembro.apellidoPaterno}
                  onChange={(e) => setFormEditMiembro({ ...formEditMiembro, apellidoPaterno: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Apellido Materno</label>
                <input
                  type="text"
                  value={formEditMiembro.apellidoMaterno}
                  onChange={(e) => setFormEditMiembro({ ...formEditMiembro, apellidoMaterno: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formEditMiembro.correoElectronico}
                  onChange={(e) => setFormEditMiembro({ ...formEditMiembro, correoElectronico: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Estado de Registro</label>
              <select
                value={formEditMiembro.estadoRegistro}
                onChange={(e) => setFormEditMiembro({ ...formEditMiembro, estadoRegistro: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value={1}>Activo (Habilitado)</option>
                <option value={0}>Inactivo (Deshabilitado)</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/home/miembros-equipo")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Volver a la Lista
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Guardando..." : "Actualizar Miembro"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 1.3 Lista de Miembros de Equipo (/home/miembros-equipo)
  if (path === "/home/miembros-equipo") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gestión de Miembros de Equipo ({miembros.length})</h2>
              <p className="text-xs text-slate-500">Personal operativo autorizado para verificación y recepción de existencias.</p>
            </div>
            {perfilActivo?.idPerfil !== 3 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/home/miembros-equipo/editar")}
                  className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Miembro</span>
                </button>
                <button
                  onClick={() => navigate("/home/miembros-equipo/agregar")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Agregar Miembro</span>
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">DNI</th>
                  <th className="py-3 px-4">Nombre Completo</th>
                  <th className="py-3 px-4">Correo Electrónico</th>
                  <th className="py-3 px-4">Celular</th>
                  <th className="py-3 px-4 text-center">Rol Asignado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-xs font-medium">
                {miembros.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      {loadingMiembros ? "Cargando miembros de equipo..." : "No hay miembros de equipo registrados."}
                    </td>
                  </tr>
                ) : (
                  miembros.map((mb) => (
                    <tr key={mb.idUsuario} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{mb.dni}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{mb.nombreCompleto}</td>
                      <td className="py-3 px-4 text-slate-500">{mb.correoElectronico}</td>
                      <td className="py-3 px-4">{mb.celular || "—"}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Miembro de equipo
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            handleSelectEditMiembro(String(mb.idUsuario));
                            navigate("/home/miembros-equipo/editar");
                          }}
                          title="Editar ficha"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 2. TODOS LOS OTROS MÓDULOS / FORMULARIOS:
  // "a excepción de gestión de usuarios y gestión de miembros de equipo, todos los otros formularios
  // solo ponme el título y no me pongas cuadros ni nada solo su título correspondiente, aún no llego a eso"
  // ===========================================================================
  const info = getModuloInfo(path);
  const IconComponent = info.icono;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#063D2A]/10 border border-[#28D978]/30 flex items-center justify-center text-[#063D2A] shrink-0">
          <IconComponent className="w-6 h-6 text-[#063D2A]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            {info.titulo}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {info.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};
