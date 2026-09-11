import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
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
  Edit3,
  Download,
  FileSpreadsheet,
  FileDown,
  Eye,
  ShoppingCart,
  Printer,
  ChevronRight,
  UserCheck,
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
  const [actividades, setActividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados de alertas y feedback
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Formulario 1: Agregar Ítem (/home/items/agregar)
  const [formItem, setFormItem] = useState({
    codigo: "",
    nombre: "",
    unidad: "Kg",
    stockMinimo: 10,
    presentacion: 1,
    idCategoria: 1,
  });

  // Formulario 1.1: Editar Ítem (/home/items/editar)
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [formEditItem, setFormEditItem] = useState({
    nombre: "",
    unidad: "Kg",
    stockMinimo: 10,
    presentacion: 1,
    idCategoria: 1,
  });

  // Formulario 2: Editar Stock / Ajuste (/home/stock/editar)
  const [formStock, setFormStock] = useState({
    idProducto: "",
    nuevoStock: "",
    motivo: "Corrección por inventario físico",
    observacion: "",
  });

  // Formulario 3: Registrar Movimiento (/home/movimientos/registrar)
  const [formMov, setFormMov] = useState({
    tipoMovimiento: "ENTRADA",
    motivoMovimiento: "Recepción de compra",
    idProducto: "",
    cantidad: "",
    localRelacionado: "Almacén Principal",
    observacion: "",
  });

  // Formulario 3.1: Editar Movimiento (/home/movimientos/editar)
  const [selectedMovId, setSelectedMovId] = useState<string>("");
  const [formEditMov, setFormEditMov] = useState({
    motivoMovimiento: "",
    localRelacionado: "",
    fechaMovimiento: "",
    observacion: "",
  });

  // Formulario 4: Agregar Miembro de Equipo (/home/miembros-equipo/agregar)
  const [formMiembro, setFormMiembro] = useState({
    dni: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    celular: "",
    correoElectronico: "",
    clave: "password123",
  });

  // Formulario 4.1: Editar Miembro de Equipo (/home/miembros-equipo/editar)
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

  // Formulario 5: Registrar Solicitud de Compra (/home/solicitudes/registrar)
  const [formSolicitud, setFormSolicitud] = useState({
    idProducto: "",
    cantidad: "",
    motivo: "Reabastecimiento regular",
    observacion: "",
  });

  // Formulario 5.1: Editar Solicitud (/home/solicitudes/editar)
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<string>("");
  const [formEditSolicitud, setFormEditSolicitud] = useState({
    estadoOrdenCompra: "PENDIENTE",
    cantidad: "",
    observacion: "",
  });

  // Detalle de Solicitud seleccionada (/home/solicitudes/detalle)
  const [detalleSolicitudId, setDetalleSolicitudId] = useState<string>("");

  // Detalle de Orden de Compra seleccionada (/home/ordenes-compra/detalle)
  const [detalleOrdenId, setDetalleOrdenId] = useState<string>("");

  // Formulario 6: Realizar Inventario (/home/inventario/realizar)
  const [formInventario, setFormInventario] = useState({
    fechaInventario: new Date().toISOString().split("T")[0],
    idProducto: "",
    stockContado: "",
    observacion: "Conteo físico rutinario verificado",
  });
  const [ultimoInventarioPDF, setUltimoInventarioPDF] = useState<any | null>(null);

  // Cargar datos según la sección
  const cargarDatos = async () => {
    try {
      setLoading(true);
      if (
        path.includes("items") ||
        path.includes("stock") ||
        path.includes("movimientos") ||
        path.includes("solicitudes") ||
        path.includes("inventario") ||
        path.includes("reportes")
      ) {
        const res = await api.get("/items");
        if (res.data.success) setItems(res.data.items || []);
      }
      if (path.includes("stock") || path.includes("reportes")) {
        const res = await api.get("/stock");
        if (res.data.success) setStockList(res.data.stock || []);
      }
      if (path.includes("movimientos") || path.includes("reportes")) {
        const res = await api.get("/movimientos");
        if (res.data.success) {
          setMovimientos(res.data.movimientos || []);
          if (res.data.movimientos?.length > 0 && !selectedMovId) {
            const primerMov = res.data.movimientos[0];
            setSelectedMovId(String(primerMov.idMovimiento));
            setFormEditMov({
              motivoMovimiento: primerMov.motivoMovimiento || "",
              localRelacionado: primerMov.localRelacionado || "",
              fechaMovimiento: primerMov.fechaMovimiento || "",
              observacion: primerMov.observacion || "",
            });
          }
        }
      }
      if (path.includes("solicitudes") || path.includes("ordenes-compra") || path.includes("reportes")) {
        const res = await api.get("/solicitudes");
        if (res.data.success) {
          const list = res.data.solicitudes || [];
          setSolicitudes(list);
          if (list.length > 0) {
            if (!detalleSolicitudId) setDetalleSolicitudId(String(list[0].idOrdenCompra));
            if (!detalleOrdenId) setDetalleOrdenId(String(list[0].idOrdenCompra));
            if (!selectedSolicitudId) {
              setSelectedSolicitudId(String(list[0].idOrdenCompra));
              setFormEditSolicitud({
                estadoOrdenCompra: list[0].estadoOrdenCompra || "PENDIENTE",
                cantidad: list[0].detalles?.[0]?.cantidadSolicitada || "10",
                observacion: "",
              });
            }
          }
        }
      }
      if (path.includes("miembros-equipo")) {
        const res = await api.get("/miembros-equipo");
        if (res.data.success) {
          const list = res.data.miembros || [];
          setMiembros(list);
          if (list.length > 0 && !selectedMiembroId) {
            const m = list[0];
            setSelectedMiembroId(String(m.idUsuario));
            setFormEditMiembro({
              dni: m.dni || "",
              nombres: m.nombres || "",
              apellidoPaterno: m.apellidoPaterno || "",
              apellidoMaterno: m.apellidoMaterno || "",
              celular: m.celular || "",
              correoElectronico: m.correoElectronico || "",
              estadoRegistro: m.estadoRegistro ?? 1,
            });
          }
        }
      }
      if (path.includes("actividades")) {
        const res = await api.get("/actividades");
        if (res.data.success) setActividades(res.data.actividades || []);
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

  // Si se selecciona un ítem para editar, rellenar su formulario
  const handleSelectEditItem = (id: string) => {
    setSelectedItemId(id);
    const it = items.find((p) => String(p.idProducto) === id);
    if (it) {
      setFormEditItem({
        nombre: it.nombre || "",
        unidad: it.unidad || "Kg",
        stockMinimo: it.stockMinimo || 10,
        presentacion: it.presentacion || 1,
        idCategoria: it.idCategoria || 1,
      });
    }
  };

  // Si se selecciona un movimiento para editar, rellenar su formulario
  const handleSelectEditMov = (id: string) => {
    setSelectedMovId(id);
    const m = movimientos.find((x) => String(x.idMovimiento) === id);
    if (m) {
      setFormEditMov({
        motivoMovimiento: m.motivoMovimiento || "",
        localRelacionado: m.localRelacionado || "",
        fechaMovimiento: m.fechaMovimiento || "",
        observacion: m.observacion || "",
      });
    }
  };

  // Si se selecciona un miembro para editar, rellenar su formulario
  const handleSelectEditMiembro = (id: string) => {
    setSelectedMiembroId(id);
    const m = miembros.find((x) => String(x.idUsuario) === id);
    if (m) {
      setFormEditMiembro({
        dni: m.dni || "",
        nombres: m.nombres || "",
        apellidoPaterno: m.apellidoPaterno || "",
        apellidoMaterno: m.apellidoMaterno || "",
        celular: m.celular || "",
        correoElectronico: m.correoElectronico || "",
        estadoRegistro: m.estadoRegistro ?? 1,
      });
    }
  };

  // Si se selecciona una solicitud para editar
  const handleSelectEditSolicitud = (id: string) => {
    setSelectedSolicitudId(id);
    const s = solicitudes.find((x) => String(x.idOrdenCompra) === id);
    if (s) {
      setFormEditSolicitud({
        estadoOrdenCompra: s.estadoOrdenCompra || "PENDIENTE",
        cantidad: s.detalles?.[0]?.cantidadSolicitada || "10",
        observacion: "",
      });
    }
  };

  // 1. Guardar nuevo ítem
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

  // 1.1 Guardar edición de ítem
  const handleActualizarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      setMensajeError("Debe seleccionar un producto para editar.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.put(`/items/${selectedItemId}`, formEditItem);
      setMensajeExito(res.data.mensaje || "Ítem actualizado correctamente en la base de datos.");
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al actualizar el ítem.");
    } finally {
      setGuardando(false);
    }
  };

  // 2. Guardar Ajuste de Stock
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
      setMensajeExito(res.data.mensaje || "Stock ajustado y guardado correctamente en la base de datos.");
      setFormStock({ idProducto: "", nuevoStock: "", motivo: "Corrección por inventario físico", observacion: "" });
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al ajustar el stock.");
    } finally {
      setGuardando(false);
    }
  };

  // 3. Registrar Movimiento
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
      setFormMov({
        tipoMovimiento: "ENTRADA",
        motivoMovimiento: "Recepción de compra",
        idProducto: "",
        cantidad: "",
        localRelacionado: "Almacén Principal",
        observacion: "",
      });
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al registrar movimiento.");
    } finally {
      setGuardando(false);
    }
  };

  // 3.1 Actualizar Movimiento
  const handleActualizarMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovId) {
      setMensajeError("Debe seleccionar un movimiento a editar.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.put(`/movimientos/${selectedMovId}`, formEditMov);
      setMensajeExito(res.data.mensaje || "Movimiento actualizado con éxito en la base de datos.");
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al actualizar el movimiento.");
    } finally {
      setGuardando(false);
    }
  };

  // 4. Agregar Miembro de Equipo
  const handleGuardarMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMiembro.dni || !formMiembro.nombres || !formMiembro.apellidoPaterno || !formMiembro.correoElectronico) {
      setMensajeError("DNI, Nombres, Apellido Paterno y Correo son obligatorios.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.post("/miembros-equipo", formMiembro);
      setMensajeExito(res.data.mensaje || "Miembro de equipo registrado con éxito en la base de datos.");
      setFormMiembro({ dni: "", nombres: "", apellidoPaterno: "", apellidoMaterno: "", celular: "", correoElectronico: "", clave: "password123" });
      cargarDatos();
    } catch (err: any) {
      if (err.response?.status === 409 || err.response?.data?.yaExiste) {
        setMensajeError(`⚠️ El miembro con DNI '${formMiembro.dni}' o correo ya existe en la base de datos. No se ha duplicado.`);
      } else {
        setMensajeError(err.response?.data?.mensaje || "Error al registrar el miembro de equipo.");
      }
    } finally {
      setGuardando(false);
    }
  };

  // 4.1 Actualizar Miembro de Equipo
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
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al actualizar miembro.");
    } finally {
      setGuardando(false);
    }
  };

  // 5. Registrar Solicitud
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

  // 5.1 Actualizar Solicitud
  const handleActualizarSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolicitudId) {
      setMensajeError("Debe seleccionar una solicitud a modificar.");
      return;
    }
    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.put(`/solicitudes/${selectedSolicitudId}`, formEditSolicitud);
      setMensajeExito(res.data.mensaje || "Solicitud actualizada con éxito.");
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al actualizar solicitud.");
    } finally {
      setGuardando(false);
    }
  };

  // Función para generar y descargar Acta de Conteo de Inventario en PDF
  const generarPDFInventario = (datosInv: {
    fecha: string;
    producto: any;
    stockContado: string | number;
    stockAnterior: string | number;
    observacion: string;
    auditor: string;
  }) => {
    try {
      const doc = new jsPDF();
      // Cabecera institucional
      doc.setFillColor(15, 23, 42); // Slate-900
      doc.rect(0, 0, 210, 32, "F");

      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("ACTA DE TOMA DE INVENTARIO FÍSICO", 14, 18);

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("Sistema de Gestión de Almacén - Registro Oficial de Existencias", 14, 25);

      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(`Fecha del Conteo Físico: ${datosInv.fecha}`, 14, 44);
      doc.text(`Responsable / Auditor: ${datosInv.auditor}`, 14, 51);
      doc.text(`Estado del Registro: Guardado en Base de Datos PostgreSQL`, 14, 58);

      const tableData = [
        ["Código de Ítem", datosInv.producto?.codigo || "N/A"],
        ["Nombre del Ítem", datosInv.producto?.nombre || "N/A"],
        ["Categoría", datosInv.producto?.categoriaNombre || "General"],
        ["Unidad de Medida", datosInv.producto?.unidad || "Und"],
        ["Stock Contado (Físico)", `${datosInv.stockContado} ${datosInv.producto?.unidad || ""}`],
        ["Stock Previo en Sistema", `${datosInv.stockAnterior} ${datosInv.producto?.unidad || ""}`],
        ["Observaciones de Toma", datosInv.observacion || "Sin observaciones adicionales"],
      ];

      autoTable(doc, {
        startY: 65,
        head: [["Parámetro de Auditoría", "Valor Registrado"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [13, 148, 136] }, // Teal-600
        styles: { fontSize: 9 },
      });

      const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 35 : 150;
      doc.setDrawColor(148, 163, 184);
      doc.line(25, finalY, 85, finalY);
      doc.line(125, finalY, 185, finalY);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Firma del Auditor / Operador", 30, finalY + 6);
      doc.text("Firma de Jefatura de Almacén", 130, finalY + 6);

      const filename = `Acta_Inventario_${datosInv.producto?.codigo || "Auditoria"}_${datosInv.fecha}.pdf`;
      doc.save(filename);
      return filename;
    } catch (err) {
      console.error("Error al generar PDF:", err);
      return null;
    }
  };

  // 6. Realizar Inventario con descarga automática de PDF
  const handleGuardarInventario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInventario.idProducto || formInventario.stockContado === "") {
      setMensajeError("Seleccione un producto e ingrese el conteo físico verificado.");
      return;
    }
    const prodSeleccionado = items.find((it) => String(it.idProducto) === String(formInventario.idProducto));
    const stockActualPrevio = prodSeleccionado?.stockActual ?? prodSeleccionado?.stockMinimo ?? 0;

    try {
      setGuardando(true);
      setMensajeError(null);
      const res = await api.post("/inventarios", formInventario);

      const datosParaPDF = {
        fecha: formInventario.fechaInventario,
        producto: prodSeleccionado,
        stockContado: formInventario.stockContado,
        stockAnterior: stockActualPrevio,
        observacion: formInventario.observacion,
        auditor: usuario?.nombreCompleto || "Personal de Almacén",
      };

      setUltimoInventarioPDF(datosParaPDF);
      const archivoGenerado = generarPDFInventario(datosParaPDF);

      setMensajeExito(
        `${res.data.mensaje || "Conteo físico registrado con éxito en la base de datos."} Se ha descargado automáticamente el reporte PDF '${archivoGenerado}'.`
      );
      setFormInventario({
        fechaInventario: new Date().toISOString().split("T")[0],
        idProducto: "",
        stockContado: "",
        observacion: "Conteo físico rutinario verificado",
      });
      cargarDatos();
    } catch (err: any) {
      setMensajeError(err.response?.data?.mensaje || "Error al registrar inventario.");
    } finally {
      setGuardando(false);
    }
  };

  // Exportar Reporte General a PDF
  const handleDescargarReportePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 30, "F");

      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("REPORTE OFICIAL DE INVENTARIO Y STOCK", 14, 18);

      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text(`Generado: ${new Date().toLocaleString()} | Usuario: ${usuario?.nombreCompleto || "Sistema"}`, 14, 25);

      const dataAExportar = stockList.length > 0 ? stockList : items;
      const tableData = dataAExportar.map((s) => [
        s.codigo,
        s.nombre,
        s.categoriaNombre || "General",
        s.unidad,
        String(s.stockMinimo ?? 0),
        String(s.stockActual ?? 0),
        s.alertaStock ? "BAJO STOCK" : "NORMAL",
      ]);

      autoTable(doc, {
        startY: 38,
        head: [["Código", "Nombre del Producto", "Categoría", "Unidad", "Stock Mín.", "Stock Actual", "Estado"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 8 },
      });

      doc.save(`Reporte_Inventario_${new Date().toISOString().split("T")[0]}.pdf`);
      setMensajeExito("Reporte en PDF generado y descargado exitosamente.");
    } catch (err) {
      console.error(err);
      setMensajeError("Error al generar reporte en PDF.");
    }
  };

  // Exportar Reporte General a Excel
  const handleDescargarReporteExcel = () => {
    try {
      const dataAExportar = stockList.length > 0 ? stockList : items;
      const rows = dataAExportar.map((s) => ({
        "Código": s.codigo,
        "Producto": s.nombre,
        "Categoría": s.categoriaNombre || "General",
        "Proveedor": s.proveedorNombre || "Sin asignar",
        "Unidad de Medida": s.unidad,
        "Stock Mínimo": s.stockMinimo ?? 0,
        "Stock Actual": s.stockActual ?? 0,
        "Estado": s.alertaStock ? "BAJO STOCK" : "NORMAL",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario Actual");
      XLSX.writeFile(workbook, `Reporte_Inventario_${new Date().toISOString().split("T")[0]}.xlsx`);
      setMensajeExito("Reporte en Excel (.xlsx) generado y descargado exitosamente.");
    } catch (err) {
      console.error(err);
      setMensajeError("Error al generar reporte en Excel.");
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
      {/* 1.1 EDITAR ÍTEM (/home/items/editar) */}
      {/* ========================================================================= */}
      {path.includes("items/editar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Editar Ítem del Catálogo</h2>
              <p className="text-xs text-slate-500">Selecciona el producto que deseas actualizar y guarda los cambios.</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Seleccionar Producto a Modificar *
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => handleSelectEditItem(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-indigo-50/50 border border-indigo-200 rounded-xl text-sm font-semibold text-slate-800"
            >
              <option value="">-- Elige un ítem para editar sus propiedades --</option>
              {items.map((it) => (
                <option key={it.idProducto} value={it.idProducto}>
                  [{it.codigo}] {it.nombre} ({it.unidad}) - Stock actual: {it.stockActual ?? it.stockMinimo}
                </option>
              ))}
            </select>
          </div>

          {selectedItemId ? (
            <form onSubmit={handleActualizarItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={formEditItem.nombre}
                    onChange={(e) => setFormEditItem({ ...formEditItem, nombre: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Unidad de Medida *</label>
                  <select
                    value={formEditItem.unidad}
                    onChange={(e) => setFormEditItem({ ...formEditItem, unidad: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
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
                    value={formEditItem.stockMinimo}
                    onChange={(e) => setFormEditItem({ ...formEditItem, stockMinimo: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Presentación</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formEditItem.presentacion}
                    onChange={(e) => setFormEditItem({ ...formEditItem, presentacion: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
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
                  <span>{guardando ? "Actualizando..." : "Guardar Cambios del Ítem"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Por favor selecciona un producto de la lista desplegable superior para cargar sus datos y editarlos.
            </div>
          )}
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
              <p className="text-xs text-slate-500">Permite corregir las existencias físicas. El nuevo valor se guardará permanentemente en la base de datos.</p>
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
                    [{it.codigo}] {it.nombre} ({it.unidad}) &mdash; Stock actual: {it.stockActual ?? it.stockMinimo}
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
                Volver a Gestión de Stock
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
              <p className="text-xs text-slate-500">Registra transacciones de kardex y actualiza automáticamente el stock.</p>
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
                  <option value="ENTRADA">🟢 ENTRADA (Aumenta existencias)</option>
                  <option value="SALIDA">🔴 SALIDA (Despacho / Disminuye existencias)</option>
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
                    [{it.codigo}] {it.nombre} ({it.unidad}) - Stock actual: {it.stockActual ?? it.stockMinimo}
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
      {/* 3.1 EDITAR MOVIMIENTO (/home/movimientos/editar) */}
      {/* ========================================================================= */}
      {path.includes("movimientos/editar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Editar Movimiento de Almacén</h2>
              <p className="text-xs text-slate-500">Corrige el motivo, fecha u observaciones de una transacción previa.</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Seleccionar Movimiento a Editar *
            </label>
            <select
              value={selectedMovId}
              onChange={(e) => handleSelectEditMov(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-semibold text-slate-800"
            >
              <option value="">-- Selecciona una transacción de kardex --</option>
              {movimientos.map((m) => (
                <option key={m.idMovimiento} value={m.idMovimiento}>
                  [{m.codigo}] {m.tipoMovimiento} - {m.motivoMovimiento} ({m.fechaMovimiento})
                </option>
              ))}
            </select>
          </div>

          {selectedMovId ? (
            <form onSubmit={handleActualizarMovimiento} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Motivo del Movimiento *</label>
                  <input
                    type="text"
                    required
                    value={formEditMov.motivoMovimiento}
                    onChange={(e) => setFormEditMov({ ...formEditMov, motivoMovimiento: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Local / Destino</label>
                  <input
                    type="text"
                    value={formEditMov.localRelacionado}
                    onChange={(e) => setFormEditMov({ ...formEditMov, localRelacionado: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={formEditMov.observacion}
                  onChange={(e) => setFormEditMov({ ...formEditMov, observacion: e.target.value })}
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
                  <span>{guardando ? "Guardando..." : "Actualizar Movimiento"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              <ArrowLeftRight className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Selecciona un movimiento del selector superior para cargar y modificar sus datos.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AGREGAR MIEMBRO DE EQUIPO (/home/miembros-equipo/agregar) */}
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
                <span>{guardando ? "Verificando..." : "Guardar en Base de Datos"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4.1 EDITAR MIEMBRO DE EQUIPO (/home/miembros-equipo/editar) */}
      {/* ========================================================================= */}
      {path.includes("miembros-equipo/editar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Editar Miembro de Equipo</h2>
              <p className="text-xs text-slate-500">Actualiza la ficha del personal operativo del almacén.</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Seleccionar Miembro de Equipo a Editar *
            </label>
            <select
              value={selectedMiembroId}
              onChange={(e) => handleSelectEditMiembro(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-semibold text-slate-800"
            >
              <option value="">-- Selecciona un miembro de equipo --</option>
              {miembros.map((mb) => (
                <option key={mb.idUsuario} value={mb.idUsuario}>
                  {mb.nombreCompleto} (DNI: {mb.dni}) - {mb.correoElectronico}
                </option>
              ))}
            </select>
          </div>

          {selectedMiembroId ? (
            <form onSubmit={handleActualizarMiembro} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">DNI *</label>
                  <input
                    type="text"
                    maxLength={8}
                    required
                    value={formEditMiembro.dni}
                    onChange={(e) => setFormEditMiembro({ ...formEditMiembro, dni: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Celular</label>
                  <input
                    type="text"
                    maxLength={9}
                    value={formEditMiembro.celular}
                    onChange={(e) => setFormEditMiembro({ ...formEditMiembro, celular: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={formEditMiembro.nombres}
                    onChange={(e) => setFormEditMiembro({ ...formEditMiembro, nombres: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Apellido Paterno *</label>
                  <input
                    type="text"
                    required
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
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formEditMiembro.correoElectronico}
                    onChange={(e) => setFormEditMiembro({ ...formEditMiembro, correoElectronico: e.target.value })}
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
                  <span>{guardando ? "Guardando..." : "Actualizar Miembro de Equipo"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              <UserPlus className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Selecciona un miembro de equipo del selector para cargar y editar su información.
            </div>
          )}
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
      {/* 5.1 DETALLE DE LA SOLICITUD (/home/solicitudes/detalle) */}
      {/* ========================================================================= */}
      {path.includes("solicitudes/detalle") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Detalle de Solicitud de Compra</h2>
                <p className="text-xs text-slate-500">Visualiza la información completa y los ítems requeridos.</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/home/solicitudes/editar")}
              className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Ir a Editar Solicitud</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase text-slate-600 shrink-0">Seleccionar Solicitud:</label>
            <select
              value={detalleSolicitudId}
              onChange={(e) => setDetalleSolicitudId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold flex-1"
            >
              {solicitudes.map((s) => (
                <option key={s.idOrdenCompra} value={s.idOrdenCompra}>
                  [{s.codigo}] - Fecha: {s.fechaRegistro} - Estado: {s.estadoOrdenCompra} ({s.detalles?.length || 0} ítems)
                </option>
              ))}
            </select>
          </div>

          {(() => {
            const sol = solicitudes.find((x) => String(x.idOrdenCompra) === String(detalleSolicitudId));
            if (!sol) {
              return (
                <div className="p-8 text-center text-slate-400 border border-dashed rounded-2xl">
                  No hay solicitudes registradas para inspeccionar.
                </div>
              );
            }
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Código</span>
                    <span className="text-base font-extrabold text-purple-700">{sol.codigo}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Fecha de Emisión</span>
                    <span className="text-base font-bold text-slate-800">{sol.fechaRegistro}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Estado</span>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                      {sol.estadoOrdenCompra}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Código Producto</th>
                        <th className="py-3 px-4">Nombre del Producto</th>
                        <th className="py-3 px-4 text-right">Cantidad Solicitada</th>
                        <th className="py-3 px-4">Unidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {sol.detalles?.map((d: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-bold text-indigo-600">{d.productoCodigo || "PROD"}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{d.productoNombre}</td>
                          <td className="py-3 px-4 text-right font-extrabold text-slate-900">{d.cantidadSolicitada}</td>
                          <td className="py-3 px-4 text-slate-500">{d.unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5.2 EDITAR SOLICITUD (/home/solicitudes/editar) */}
      {/* ========================================================================= */}
      {path.includes("solicitudes/editar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Modificar Solicitud de Compra</h2>
              <p className="text-xs text-slate-500">Actualiza el estado de aprobación o la cantidad solicitada.</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Seleccionar Solicitud a Editar *
            </label>
            <select
              value={selectedSolicitudId}
              onChange={(e) => handleSelectEditSolicitud(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-200 rounded-xl text-sm font-semibold text-slate-800"
            >
              <option value="">-- Selecciona una solicitud --</option>
              {solicitudes.map((s) => (
                <option key={s.idOrdenCompra} value={s.idOrdenCompra}>
                  [{s.codigo}] - Estado actual: {s.estadoOrdenCompra} ({s.fechaRegistro})
                </option>
              ))}
            </select>
          </div>

          {selectedSolicitudId ? (
            <form onSubmit={handleActualizarSolicitud} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Estado de la Solicitud *</label>
                  <select
                    value={formEditSolicitud.estadoOrdenCompra}
                    onChange={(e) => setFormEditSolicitud({ ...formEditSolicitud, estadoOrdenCompra: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-purple-900"
                  >
                    <option value="PENDIENTE">PENDIENTE (En evaluación)</option>
                    <option value="APROBADA">🟢 APROBADA (Proceder a compra)</option>
                    <option value="RECHAZADA">🔴 RECHAZADA (No autorizada)</option>
                    <option value="ATENDIDA">🔵 ATENDIDA (Mercadería recibida)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cantidad Ajustada</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formEditSolicitud.cantidad}
                    onChange={(e) => setFormEditSolicitud({ ...formEditSolicitud, cantidad: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
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
                  <span>{guardando ? "Guardando..." : "Actualizar Solicitud"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Selecciona una solicitud para cargar y modificar su estado.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5.3 DETALLES DE ÓRDENES DE COMPRA (/home/ordenes-compra/detalle) */}
      {/* ========================================================================= */}
      {path.includes("ordenes-compra/detalle") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Detalle de Órdenes de Compra</h2>
                <p className="text-xs text-slate-500">Documento de compra emitido a proveedores de insumos.</p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ficha</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase text-slate-600 shrink-0">Seleccionar Orden:</label>
            <select
              value={detalleOrdenId}
              onChange={(e) => setDetalleOrdenId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold flex-1"
            >
              {solicitudes.map((s) => (
                <option key={s.idOrdenCompra} value={s.idOrdenCompra}>
                  Orden {s.codigo} - Emisión: {s.fechaRegistro} - ({s.estadoOrdenCompra})
                </option>
              ))}
            </select>
          </div>

          {(() => {
            const ord = solicitudes.find((x) => String(x.idOrdenCompra) === String(detalleOrdenId));
            if (!ord) {
              return (
                <div className="p-8 text-center text-slate-400 border border-dashed rounded-2xl">
                  No se encontraron órdenes de compra registradas.
                </div>
              );
            }
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Número de Orden</span>
                    <span className="text-base font-extrabold text-amber-700">{ord.codigo}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Fecha Emisión</span>
                    <span className="text-base font-bold text-slate-800">{ord.fechaRegistro}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Estado Actual</span>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                      {ord.estadoOrdenCompra}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Almacén Destino</span>
                    <span className="text-sm font-bold text-slate-700">Almacén Central</span>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Descripción de Insumo</th>
                        <th className="py-3 px-4 text-right">Cantidad Requerida</th>
                        <th className="py-3 px-4">Unidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {ord.detalles?.map((d: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-bold text-indigo-600">{d.productoCodigo || "IN"}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{d.productoNombre}</td>
                          <td className="py-3 px-4 text-right font-extrabold text-slate-900">{d.cantidadSolicitada}</td>
                          <td className="py-3 px-4 text-slate-500">{d.unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. REALIZAR INVENTARIO (/home/inventario/realizar) */}
      {/* ========================================================================= */}
      {path.includes("inventario/realizar") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Formulario: Realizar Inventario Físico</h2>
              <p className="text-xs text-slate-500">
                Registra el conteo físico en la base de datos y descarga inmediatamente el acta/reporte oficial en PDF.
              </p>
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
                      [{it.codigo}] {it.nombre} ({it.unidad}) &mdash; Stock en sistema: {it.stockActual ?? it.stockMinimo}
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
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

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              {ultimoInventarioPDF ? (
                <button
                  type="button"
                  onClick={() => generarPDFInventario(ultimoInventarioPDF)}
                  className="px-4 py-2.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Volver a Descargar Acta PDF</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">El PDF se descargará automáticamente al guardar.</span>
              )}

              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Guardando y Generando PDF..." : "Guardar en BD y Descargar PDF"}</span>
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
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate("/home/items/editar")}
                className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Ítem</span>
              </button>
              <button
                onClick={() => navigate("/home/items/agregar")}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Ítem</span>
              </button>
            </div>
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
                  <th className="py-3 px-4 text-right">Stock Actual</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-xs font-medium">
                {items.slice(0, 20).map((it) => (
                  <tr key={it.idProducto} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-indigo-600">{it.codigo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{it.nombre}</td>
                    <td className="py-3 px-4">{it.categoriaNombre || "General"}</td>
                    <td className="py-3 px-4 text-slate-500">{it.proveedorNombre || "Sin asignar"}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold">{it.unidad}</span></td>
                    <td className="py-3 px-4 text-right font-bold text-slate-500">{it.stockMinimo}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">{it.stockActual ?? it.stockMinimo}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          handleSelectEditItem(String(it.idProducto));
                          navigate("/home/items/editar");
                        }}
                        title="Editar ítem"
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
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
              <p className="text-xs text-slate-500">Existencias actuales sincronizadas directamente con la base de datos PostgreSQL.</p>
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
                  <th className="py-3 px-4 text-right">Ajuste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-xs font-medium">
                {stockList.map((st) => (
                  <tr key={st.idProducto} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-amber-600">{st.codigo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.nombre}</td>
                    <td className="py-3 px-4">{st.unidad}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-500">{st.stockMinimo}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-sm">{st.stockActual}</td>
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setFormStock({
                            idProducto: String(st.idProducto),
                            nuevoStock: String(st.stockActual),
                            motivo: "Corrección por inventario físico",
                            observacion: "",
                          });
                          navigate("/home/stock/editar");
                        }}
                        title="Ajustar stock de este ítem"
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/home/movimientos/editar")}
                className="px-4 py-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Movimiento</span>
              </button>
              <button
                onClick={() => navigate("/home/movimientos/registrar")}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Movimiento</span>
              </button>
            </div>
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
                  <th className="py-3 px-4 text-right">Acción</th>
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          handleSelectEditMov(String(m.idMovimiento));
                          navigate("/home/movimientos/editar");
                        }}
                        title="Editar movimiento"
                        className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 border border-sky-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/home/miembros-equipo/editar")}
                  className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Miembro</span>
                </button>
                <button
                  onClick={() => navigate("/home/miembros-equipo/agregar")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          handleSelectEditMiembro(String(mb.idUsuario));
                          navigate("/home/miembros-equipo/editar");
                        }}
                        title="Editar ficha"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/home/solicitudes/detalle")}
                className="px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Detalle</span>
              </button>
              <button
                onClick={() => navigate("/home/solicitudes/editar")}
                className="px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Solicitud</span>
              </button>
              <button
                onClick={() => navigate("/home/solicitudes/registrar")}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Solicitud</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Fecha Emisión</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Ítems Solicitados</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
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
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setDetalleSolicitudId(String(sol.idOrdenCompra));
                          navigate("/home/solicitudes/detalle");
                        }}
                        title="Ver detalle"
                        className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 border border-purple-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          handleSelectEditSolicitud(String(sol.idOrdenCompra));
                          navigate("/home/solicitudes/editar");
                        }}
                        title="Modificar estado"
                        className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 border border-purple-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reportes de inventario */}
      {path.includes("reportes") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileBarChart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reportes de Inventario y Movimientos</h2>
              <p className="text-xs text-slate-500">Genera informes ejecutivos y descarga los balances en PDF o Excel.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase block">Total Ítems en Catálogo</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{items.length}</span>
              <span className="text-[11px] text-indigo-600 font-semibold">Productos registrados</span>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-xs font-bold text-emerald-700 uppercase block">Ítems con Stock Normal</span>
              <span className="text-2xl font-black text-emerald-800 mt-1 block">
                {stockList.filter((s) => !s.alertaStock).length}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">Sin riesgo de desabastecimiento</span>
            </div>
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-xs font-bold text-rose-700 uppercase block">Alertas de Bajo Stock</span>
              <span className="text-2xl font-black text-rose-800 mt-1 block">
                {stockList.filter((s) => s.alertaStock).length}
              </span>
              <span className="text-[11px] text-rose-600 font-semibold">Requieren compra urgente</span>
            </div>
          </div>

          {/* Botones de Descarga PDF y Excel */}
          <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-indigo-950">Descargas Disponibles</h3>
              <p className="text-xs text-slate-600 mt-0.5">Exporta el inventario completo con sus existencias y estados calculados.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDescargarReportePDF}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar en PDF</span>
              </button>
              <button
                type="button"
                onClick={handleDescargarReporteExcel}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Descargar en Excel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actividades del sistema */}
      {path.includes("actividades") && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Seguimiento de Actividades (Auditoría en Tiempo Real)</h2>
                <p className="text-xs text-slate-500">Bitácora detallada de qué usuario realizó cada movimiento, edición o agregación.</p>
              </div>
            </div>
            <button
              onClick={cargarDatos}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Actualizar Bitácora</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {actividades.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No hay actividades registradas en la bitácora aún.
              </div>
            ) : (
              actividades.map((act) => {
                let badgeClass = "bg-slate-100 text-slate-700";
                if (act.tipoAccion === "CREAR") badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
                if (act.tipoAccion === "EDITAR") badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
                if (act.tipoAccion === "AJUSTE") badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
                if (act.tipoAccion === "MOVIMIENTO") badgeClass = "bg-sky-100 text-sky-800 border-sky-200";
                if (act.tipoAccion === "INVENTARIO") badgeClass = "bg-teal-100 text-teal-800 border-teal-200";
                if (act.tipoAccion === "SOLICITUD") badgeClass = "bg-purple-100 text-purple-800 border-purple-200";
                if (act.tipoAccion === "ELIMINAR") badgeClass = "bg-rose-100 text-rose-800 border-rose-200";

                return (
                  <div key={act.idActividad} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-3 rounded-xl transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                        {act.usuarioNombre?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{act.usuarioNombre}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600">
                            {act.usuarioRol}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                            {act.tipoAccion}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-medium">{act.descripcion}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold shrink-0 pl-11 sm:pl-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.fechaFormateada || act.fechaHora}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
