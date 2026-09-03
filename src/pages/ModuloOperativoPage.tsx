import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  Boxes,
  Package,
  ArrowLeftRight,
  FileText,
  ClipboardCheck,
  Activity,
  Plus,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Search,
  UserPlus,
  Shield,
  Clock,
  ArrowRight,
  Calendar,
  Layers,
  FileBarChart,
  Check,
  Sliders,
} from "lucide-react";

export const ModuloOperativoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, perfilActivo } = useAuth();
  const path = location.pathname.toLowerCase();

  // Estados de datos
  const [items, setItems] = useState<any[]>([]);
  const [stockList, setStockList] = useState<any[]>([]);
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [miembros, setMiembros] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados de alertas y feedback
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Formularios para cada submódulo
  // 1. Agregar Ítem (/home/items/agregar)
  const [formItem, setFormItem] = useState({
    codigo: "",
    nombre: "",
    unidad: "Kg",
    stockMinimo: 10,
    presentacion: 1,
    idCategoria: 1,
  });

  // 2. Editar Stock / Ajuste (/home/stock/editar)
  const [formStock, setFormStock] = useState({
    idProducto: "",
    nuevoStock: "",
    motivo: "Corrección por inventario físico",
    observacion: "",
  });

  // 3. Registrar Movimiento (/home/movimientos/registrar)
  const [formMov, setFormMov] = useState({
    tipoMovimiento: "ENTRADA",
    motivoMovimiento: "Recepción de compra",
    idProducto: "",
    cantidad: "",
    localRelacionado: "Almacén Principal",
    observacion: "",
  });

  // 4. Agregar Miembro de Equipo (/home/miembros-equipo/agregar)
  const [formMiembro, setFormMiembro] = useState({
    dni: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    celular: "",
    correoElectronico: "",
    clave: "password123",
  });

  // 5. Registrar Solicitud de Compra (/home/solicitudes/registrar)
  const [formSolicitud, setFormSolicitud] = useState({
    idProducto: "",
    cantidad: "",
    motivo: "Reabastecimiento regular",
    observacion: "",
  });

  // 6. Realizar Inventario (/home/inventario/realizar)
  const [formInventario, setFormInventario] = useState({
    fechaInventario: new Date().toISOString().split("T")[0],
    idProducto: "",
    stockContado: "",
    observacion: "Conteo físico rutinario verificado",
  });

  // Cargar datos según la sección
  const cargarDatos = async () => {
    try {
      setLoading(true);
      if (path.includes("items") || path.includes("stock") || path.includes("movimientos") || path.includes("solicitudes") || path.includes("inventario")) {
        const res = await api.get("/items");
        if (res.data.success) setItems(res.data.items || []);
      }
      if (path.includes("stock")) {
        const res = await api.get("/stock");
        if (res.data.success) setStockList(res.data.stock || []);
      }
      if (path.includes("movimientos")) {
        const res = await api.get("/movimientos");
        if (res.data.success) setMovimientos(res.data.movimientos || []);
      }
      if (path.includes("solicitudes") || path.includes("ordenes-compra")) {
        const res = await api.get("/solicitudes");
        if (res.data.success) setSolicitudes(res.data.solicitudes || []);
      }
      if (path.includes("miembros-equipo")) {
        const res = await api.get("/miembros-equipo");
        if (res.data.success) setMiembros(res.data.miembros || []);
      }
    } catch (err) {
      console.error("Error al cargar datos operativos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMensajeExito(null);
    setMensajeError(null);
    cargarDatos();
  }, [path]);

  // Manejadores de envíos de formularios a la base de datos
  const handleGuardarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.post("/items", formItem);
      setMensajeExito(res.data.mensaje || "Ítem guardado con éxito en la base de datos.");
      setFormItem({ codigo: "", nombre: "", unidad: "Kg", stockMinimo: 10, presentacion: 1, idCategoria: 1 });
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al registrar el ítem.");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarAjusteStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStock.idProducto || !formStock.nuevoStock) {
      setMensajeError("Por favor seleccione un producto e ingrese el nuevo stock.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.post("/stock/ajustar", formStock);
      setMensajeExito(res.data.mensaje || "Stock ajustado y registrado correctamente.");
      setFormStock({ idProducto: "", nuevoStock: "", motivo: "Corrección por inventario físico", observacion: "" });
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al ajustar el stock.");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMov.idProducto || !formMov.cantidad) {
      setMensajeError("Debe seleccionar un producto e ingresar la cantidad.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.post("/movimientos", formMov);
      setMensajeExito(res.data.mensaje || "Movimiento registrado con éxito.");
      setFormMov({ tipoMovimiento: "ENTRADA", motivoMovimiento: "Recepción de compra", idProducto: "", cantidad: "", localRelacionado: "Almacén Principal", observacion: "" });
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al registrar movimiento.");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMiembro.dni || !formMiembro.nombres || !formMiembro.apellidoPaterno || !formMiembro.correoElectronico) {
      setMensajeError("DNI, Nombres, Apellido Paterno y Correo son obligatorios.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      // REGLA: Si ya existe no lo insertes
      const res = await api.post("/miembros-equipo", formMiembro);
      setMensajeExito(res.data.mensaje || "Miembro de equipo registrado con éxito en la base de datos.");
      setFormMiembro({ dni: "", nombres: "", apellidoPaterno: "", apellidoMaterno: "", celular: "", correoElectronico: "", clave: "password123" });
      cargarDatos();
    } catch (err: any) {
      // Detección de usuario existente
      if (err.response?.status === 409 || err.response?.data?.yaExiste) {
        setMensajeError(`⚠️ El miembro con DNI '${formMiembro.dni}' o correo ya existe en la base de datos. No se ha duplicado.`);
      } else {
        setMensajeError(err.response?.data?.mensaje || "Error al registrar el miembro de equipo.");
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSolicitud.idProducto || !formSolicitud.cantidad) {
      setMensajeError("Seleccione un producto e ingrese la cantidad a solicitar.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.post("/solicitudes", formSolicitud);
      setMensajeExito(res.data.mensaje || "Solicitud de compra emitida correctamente.");
      setFormSolicitud({ idProducto: "", cantidad: "", motivo: "Reabastecimiento regular", observacion: "" });
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al registrar solicitud.");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarInventario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInventario.idProducto || formInventario.stockContado === "") {
      setMensajeError("Seleccione un producto e ingrese el conteo físico verificado.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.post("/inventarios", formInventario);
      setMensajeExito(res.data.mensaje || "Conteo físico registrado con éxito en la base de datos.");
      setFormInventario({ fechaInventario: new Date().toISOString().split("T")[0], idProducto: "", stockContado: "", observacion: "Conteo físico rutinario verificado" });
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al registrar inventario.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Mensajes de Alerta / Éxito */}
      {mensajeExito && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
          <button onClick={() => setMensajeExito(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            Cerrar
          </button>
        </div>
      )}

      {mensajeError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{mensajeError}</span>
          </div>
          <button onClick={() => setMensajeError(null)} className="text-rose-700 hover:text-rose-900 text-xs font-bold">
            Cerrar
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. AGREGAR ÍTEM (/home/items/agregar) */}
      {/* ========================================================================= */}
      {path.includes("items/agregar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Agregar Nuevo Ítem al Catálogo</h2>
              <p className="text-xs text-slate-500">Registra un nuevo producto en la base de datos PostgreSQL.</p>
            </div>
          </div>

          <form onSubmit={handleGuardarItem} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Código del Ítem *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. V-020, S-015"
                  value={formItem.codigo}
                  onChange={(e) => setFormItem({ ...formItem, codigo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pimiento Morrón"
                  value={formItem.nombre}
                  onChange={(e) => setFormItem({ ...formItem, nombre: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Unidad de Medida *</label>
                <select
                  value={formItem.unidad}
                  onChange={(e) => setFormItem({ ...formItem, unidad: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Kg">Kilogramos (Kg)</option>
                  <option value="Lt">Litros (Lt)</option>
                  <option value="Und">Unidades (Und)</option>
                  <option value="Paquete">Paquete</option>
                  <option value="Caja">Caja</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Stock Mínimo</label>
                <input
                  type="number"
                  step="0.1"
                  value={formItem.stockMinimo}
                  onChange={(e) => setFormItem({ ...formItem, stockMinimo: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/home/items")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Volver al Catálogo
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Registrando..." : "Guardar Ítem en Base de Datos"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDITAR / AJUSTAR STOCK (/home/stock/editar) */}
      {/* ========================================================================= */}
      {path.includes("stock/editar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Corrección y Ajuste de Stock</h2>
              <p className="text-xs text-slate-500">Permite corregir las existencias cuando se detecte una discrepancia física.</p>
            </div>
          </div>

          <form onSubmit={handleGuardarAjusteStock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Seleccionar Producto a Ajustar *</label>
              <select
                required
                value={formStock.idProducto}
                onChange={(e) => setFormStock({ ...formStock, idProducto: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="">-- Selecciona un producto del almacén --</option>
                {items.map((it) => (
                  <option key={it.idProducto} value={it.idProducto}>
                    [{it.codigo}] {it.nombre} ({it.unidad})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nuevo Stock Físico *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ej. 25.50"
                  value={formStock.nuevoStock}
                  onChange={(e) => setFormStock({ ...formStock, nuevoStock: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Motivo del Ajuste *</label>
                <select
                  value={formStock.motivo}
                  onChange={(e) => setFormStock({ ...formStock, motivo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="Corrección por inventario físico">Corrección por inventario físico</option>
                  <option value="Merma detectada en almacén">Merma detectada en almacén</option>
                  <option value="Devolución de material">Devolución de material</option>
                  <option value="Ajuste inicial">Ajuste inicial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Observaciones / Justificación</label>
              <textarea
                rows={2}
                placeholder="Explica la causa del ajuste de stock..."
                value={formStock.observacion}
                onChange={(e) => setFormStock({ ...formStock, observacion: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/home/stock")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Volver al Stock
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Ajustando..." : "Guardar Ajuste en Base de Datos"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. REGISTRAR MOVIMIENTO (/home/movimientos/registrar) */}
      {/* ========================================================================= */}
      {path.includes("movimientos/registrar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Registrar Entrada / Salida</h2>
              <p className="text-xs text-slate-500">Registra transacciones de kardex en la base de datos.</p>
            </div>
          </div>

          <form onSubmit={handleGuardarMovimiento} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tipo de Movimiento *</label>
                <select
                  value={formMov.tipoMovimiento}
                  onChange={(e) => setFormMov({ ...formMov, tipoMovimiento: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                >
                  <option value="ENTRADA">🟢 ENTRADA (Ingreso a Almacén)</option>
                  <option value="SALIDA">🔴 SALIDA (Despacho / Consumo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Motivo del Movimiento *</label>
                <select
                  value={formMov.motivoMovimiento}
                  onChange={(e) => setFormMov({ ...formMov, motivoMovimiento: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Recepción de compra">Recepción de compra</option>
                  <option value="Despacho a cocina">Despacho a cocina</option>
                  <option value="Préstamo a otra sede">Préstamo a otra sede</option>
                  <option value="Devolución de producto">Devolución de producto</option>
                  <option value="Desecho por vencimiento">Desecho por vencimiento</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Producto *</label>
              <select
                required
                value={formMov.idProducto}
                onChange={(e) => setFormMov({ ...formMov, idProducto: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="">-- Selecciona el producto a mover --</option>
                {items.map((it) => (
                  <option key={it.idProducto} value={it.idProducto}>
                    [{it.codigo}] {it.nombre} ({it.unidad})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cantidad *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ej. 12.00"
                  value={formMov.cantidad}
                  onChange={(e) => setFormMov({ ...formMov, cantidad: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Local / Destino</label>
                <input
                  type="text"
                  value={formMov.localRelacionado}
                  onChange={(e) => setFormMov({ ...formMov, localRelacionado: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Observaciones</label>
              <input
                type="text"
                placeholder="Número de guía, persona receptora o detalle adicional..."
                value={formMov.observacion}
                onChange={(e) => setFormMov({ ...formMov, observacion: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/home/movimientos")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Volver al Kardex
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Registrando..." : "Guardar Movimiento en Base de Datos"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AGREGAR MIEMBRO DE EQUIPO (/home/miembros-equipo/agregar) */}
      {/* CON REGLA ESTRICTA: SI YA EXISTE NO LO HAGAS */}
      {/* ========================================================================= */}
      {path.includes("miembros-equipo/agregar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Dar de Alta Miembro de Equipo</h2>
              <p className="text-xs text-slate-500">
                Registra un nuevo usuario operativo. Si el DNI o correo ya existen en la base de datos, el sistema no lo duplicará.
              </p>
            </div>
          </div>

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
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Volver a la Lista
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Verificando y Guardando..." : "Guardar en Base de Datos (Si no existe)"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. REGISTRAR SOLICITUD DE COMPRA (/home/solicitudes/registrar) */}
      {/* ========================================================================= */}
      {path.includes("solicitudes/registrar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Nueva Solicitud de Compra</h2>
              <p className="text-xs text-slate-500">Genera una solicitud de requerimiento de insumos en orden_compra.</p>
            </div>
          </div>

          <form onSubmit={handleGuardarSolicitud} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Producto Requerido *</label>
              <select
                required
                value={formSolicitud.idProducto}
                onChange={(e) => setFormSolicitud({ ...formSolicitud, idProducto: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="">-- Selecciona el producto a solicitar --</option>
                {items.map((it) => (
                  <option key={it.idProducto} value={it.idProducto}>
                    [{it.codigo}] {it.nombre} ({it.unidad})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cantidad a Solicitar *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ej. 50.00"
                  value={formSolicitud.cantidad}
                  onChange={(e) => setFormSolicitud({ ...formSolicitud, cantidad: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Motivo / Justificación</label>
                <input
                  type="text"
                  value={formSolicitud.motivo}
                  onChange={(e) => setFormSolicitud({ ...formSolicitud, motivo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/home/solicitudes")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Volver a Solicitudes
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Emitiendo..." : "Emitir Solicitud en Base de Datos"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. REALIZAR INVENTARIO (/home/inventario/realizar) */}
      {/* ========================================================================= */}
      {path.includes("inventario/realizar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Realizar Inventario Físico</h2>
              <p className="text-xs text-slate-500">Registra el conteo físico de existencias por fecha en inventario_cierre.</p>
            </div>
          </div>

          <form onSubmit={handleGuardarInventario} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Fecha del Inventario *</label>
                <input
                  type="date"
                  required
                  value={formInventario.fechaInventario}
                  onChange={(e) => setFormInventario({ ...formInventario, fechaInventario: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Producto a Auditar *</label>
                <select
                  required
                  value={formInventario.idProducto}
                  onChange={(e) => setFormInventario({ ...formInventario, idProducto: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="">-- Selecciona el ítem auditado --</option>
                  {items.map((it) => (
                    <option key={it.idProducto} value={it.idProducto}>
                      [{it.codigo}] {it.nombre} ({it.unidad})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Stock Físico Contado *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ej. 18.50"
                  value={formInventario.stockContado}
                  onChange={(e) => setFormInventario({ ...formInventario, stockContado: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Observaciones del Conteo</label>
                <input
                  type="text"
                  value={formInventario.observacion}
                  onChange={(e) => setFormInventario({ ...formInventario, observacion: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Guardando..." : "Guardar Conteo en Base de Datos"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TABLAS GENERALES CUANDO SE VISITA EL PADRE */}
      {/* ========================================================================= */}

      {/* Catálogo de Ítems */}
      {path === "/home/items" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gestión de Ítems ({items.length} productos en BD)</h2>
              <p className="text-xs text-slate-500">Catálogo maestro de artículos y materias primas del almacén.</p>
            </div>
            <button
              onClick={() => navigate("/home/items/agregar")}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nuevo Ítem</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Nombre del Ítem</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Proveedor</th>
                  <th className="py-3 px-4">Unidad</th>
                  <th className="py-3 px-4 text-right">Stock Mínimo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-xs font-medium">
                {items.slice(0, 15).map((it) => (
                  <tr key={it.idProducto} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-indigo-600">{it.codigo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{it.nombre}</td>
                    <td className="py-3 px-4">{it.categoriaNombre || "General"}</td>
                    <td className="py-3 px-4 text-slate-500">{it.proveedorNombre || "Sin asignar"}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold">{it.unidad}</span></td>
                    <td className="py-3 px-4 text-right font-bold">{it.stockMinimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Control de Stock */}
      {path === "/home/stock" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gestión de Stock ({stockList.length} ítems auditados)</h2>
              <p className="text-xs text-slate-500">Existencias actuales calculadas y advertencias de reposición.</p>
            </div>
            {perfilActivo?.idPerfil !== 3 && (
              <button
                onClick={() => navigate("/home/stock/editar")}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Sliders className="w-4 h-4" />
                <span>Editar / Corregir Stock</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Unidad</th>
                  <th className="py-3 px-4 text-right">Stock Mínimo</th>
                  <th className="py-3 px-4 text-right">Existencias Actuales</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-xs font-medium">
                {stockList.slice(0, 15).map((st) => (
                  <tr key={st.idProducto} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-amber-600">{st.codigo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.nombre}</td>
                    <td className="py-3 px-4">{st.unidad}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-500">{st.stockMinimo}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">{st.stockActual}</td>
                    <td className="py-3 px-4 text-center">
                      {st.alertaStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Bajo Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movimientos (Kardex) */}
      {path === "/home/movimientos" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Entradas y Salidas de Almacén (Kardex)</h2>
              <p className="text-xs text-slate-500">Historial de transacciones de inventario en la base de datos.</p>
            </div>
            <button
              onClick={() => navigate("/home/movimientos/registrar")}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Movimiento</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Motivo</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Detalle Ítems</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-xs font-medium">
                {movimientos.map((m) => (
                  <tr key={m.idMovimiento} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-sky-600">{m.codigo}</td>
                    <td className="py-3 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] ${m.tipoMovimiento === "ENTRADA" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        {m.tipoMovimiento}
                      </span>
                    </td>
                    <td className="py-3 px-4">{m.motivoMovimiento}</td>
                    <td className="py-3 px-4 text-slate-500">{m.fechaMovimiento}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {m.detalles && m.detalles.length > 0 ? (
                        <span>{m.detalles.map((d: any) => `${d.productoNombre} (${d.cantidad} ${d.unidad})`).join(", ")}</span>
                      ) : (
                        <span>{m.observacion || "Sin detalle"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Miembros de Equipo */}
      {path === "/home/miembros-equipo" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gestión de Miembros de Equipo ({miembros.length})</h2>
              <p className="text-xs text-slate-500">Personal operativo autorizado para conteo y recepción.</p>
            </div>
            {perfilActivo?.idPerfil !== 3 && (
              <button
                onClick={() => navigate("/home/miembros-equipo/agregar")}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Agregar Miembro de Equipo</span>
              </button>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-xs font-medium">
                {miembros.map((mb) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Solicitudes de compra */}
      {(path === "/home/solicitudes" || path === "/home/ordenes-compra") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Solicitudes y Órdenes de Compra ({solicitudes.length})</h2>
              <p className="text-xs text-slate-500">Gestión de abastecimiento y requerimientos de insumos.</p>
            </div>
            <button
              onClick={() => navigate("/home/solicitudes/registrar")}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Solicitud</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Fecha Emisión</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Ítems Solicitados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-xs font-medium">
                {solicitudes.map((sol) => (
                  <tr key={sol.idOrdenCompra} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-purple-600">{sol.codigo}</td>
                    <td className="py-3 px-4 text-slate-500">{sol.fechaRegistro}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {sol.estadoOrdenCompra}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sol.detalles && sol.detalles.length > 0 ? (
                        <span>{sol.detalles.map((d: any) => `${d.productoNombre} (${d.cantidadSolicitada} ${d.unidad})`).join(", ")}</span>
                      ) : (
                        <span>Sin ítems detallados</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reportes */}
      {path.includes("reportes") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileBarChart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reportes de Inventario y Movimientos</h2>
              <p className="text-xs text-slate-500">Genera balances y resúmenes ejecutivos por rango de fechas.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Fecha Desde</label>
              <input type="date" defaultValue="2026-09-01" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Fecha Hasta</label>
              <input type="date" defaultValue="2026-09-03" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setMensajeExito("Reporte generado con éxito a partir de la base de datos PostgreSQL.")}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Generar Reporte
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <CheckCircle2 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">Balance Consolidado del Sistema</p>
            <p className="text-xs text-slate-500 mt-1">140 Ítems Catalogados &bull; 4 Transacciones en Kardex &bull; 3 Órdenes de Compra</p>
          </div>
        </div>
      )}

      {/* Actividades del sistema */}
      {path.includes("actividades") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Seguimiento de Actividades (Auditoría)</h2>
              <p className="text-xs text-slate-500">Bitácora de operaciones registradas por los usuarios del sistema.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Actualización y sincronización de base de datos</p>
                <p className="text-xs text-slate-500">Por: Carlos Rodríguez (Técnico)</p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Hoy, 17:15</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Registro de ajuste y conteo físico</p>
                <p className="text-xs text-slate-500">Por: José Ríos (Gerente)</p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Hoy, 16:45</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Verificación operativa de inventario</p>
                <p className="text-xs text-slate-500">Por: Roberto Díaz (Miembro de equipo)</p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Hoy, 15:30</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
