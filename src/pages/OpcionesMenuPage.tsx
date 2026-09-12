import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../services/api";
import { OpcionMenu } from "../types";
import { TablaGenerica, ColumnDef } from "../components/TablaGenerica";
import { ModalGenerico } from "../components/ModalGenerico";
import { FormField, FormActions } from "../components/FormularioGenerico";
import { ListTree, AlertTriangle, CornerDownRight } from "lucide-react";

export const OpcionesMenuPage: React.FC = () => {
  const location = useLocation();
  const isEditarPage = location.pathname.toLowerCase().includes("editar");

  const [opciones, setOpciones] = useState<OpcionMenu[]>([]);
  const [opcionesPadre, setOpcionesPadre] = useState<OpcionMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Estados Modal Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpcion, setEditingOpcion] = useState<OpcionMenu | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    urlMenu: "",
    descripcion: "",
    idPadre: "" as string | number,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Estado Borrado Lógico
  const [deletingOpcion, setDeletingOpcion] = useState<OpcionMenu | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const cargarOpciones = async (p = page, q = search) => {
    try {
      setLoading(true);
      const res = await api.get("/opciones-menu", {
        params: { page: p, limit: 50, q, incluir_inactivos: true },
      });
      if (res.data.success) {
        setOpciones(res.data.opciones || []);
        setTotalPages(res.data.total_paginas || 1);
        setTotalRecords(res.data.total || 0);
      }
    } catch (err) {
      console.error("Error al cargar opciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarPadres = async () => {
    try {
      const res = await api.get("/opciones-menu", {
        params: { solo_padres: true, incluir_inactivos: true },
      });
      if (res.data.success) {
        setOpcionesPadre(res.data.opciones || []);
      }
    } catch (err) {
      console.error("Error al cargar opciones padre:", err);
    }
  };

  useEffect(() => {
    cargarOpciones(page, search);
  }, [page]);

  useEffect(() => {
    cargarPadres();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
    cargarOpciones(1, query);
  };

  const handleOpenNuevo = () => {
    setEditingOpcion(null);
    setFormData({
      nombre: "",
      urlMenu: "",
      descripcion: "",
      idPadre: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (opc: OpcionMenu) => {
    setEditingOpcion(opc);
    setFormData({
      nombre: opc.nombre || "",
      urlMenu: opc.urlMenu || "",
      descripcion: opc.descripcion || "",
      idPadre: opc.idPadre ? String(opc.idPadre) : "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.urlMenu.trim()) {
      setFormError("El nombre y la URL de la opción son obligatorios.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      const payload = {
        nombre: formData.nombre.trim(),
        urlMenu: formData.urlMenu.trim(),
        descripcion: formData.descripcion.trim(),
        idPadre: formData.idPadre ? parseInt(String(formData.idPadre), 10) : null,
      };

      if (editingOpcion) {
        await api.put(`/opciones-menu/${editingOpcion.idOpcionMenu}`, payload);
      } else {
        await api.post("/opciones-menu", payload);
      }

      setIsModalOpen(false);
      cargarOpciones(page, search);
      cargarPadres();
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || "Error al procesar la opción de menú.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingOpcion) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/opciones-menu/${deletingOpcion.idOpcionMenu}`);
      setDeletingOpcion(null);
      cargarOpciones(page, search);
      cargarPadres();
    } catch (err) {
      console.error("Error al desactivar opción:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: ColumnDef<OpcionMenu>[] = [
    {
      header: "IdOpcionMenu",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-[#063D2A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          #{row.idOpcionMenu}
        </span>
      ),
      className: "w-24 text-center",
    },
    {
      header: "Nombre",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.idPadre ? (
            <div className="flex items-center gap-1 text-emerald-600 pl-2">
              <CornerDownRight className="w-3.5 h-3.5" />
            </div>
          ) : null}
          <span className={`font-bold text-sm ${row.idPadre ? "text-slate-700" : "text-slate-900"}`}>
            {row.nombre}
          </span>
        </div>
      ),
    },
    {
      header: "UrlMenu",
      accessor: (row) => (
        <code className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
          {row.urlMenu}
        </code>
      ),
    },
    {
      header: "Descripcion",
      accessor: (row) => (
        <span className="text-xs text-slate-600 max-w-xs block truncate" title={row.descripcion || ""}>
          {row.descripcion || <span className="text-slate-400 italic font-sans">Sin descripción</span>}
        </span>
      ),
    },
    {
      header: "IdPadre",
      accessor: (row) => (
        <span className="text-xs font-mono">
          {row.idPadre !== null && row.idPadre !== undefined ? (
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold border border-slate-200">
              #{row.idPadre} {row.padreNombre ? `(${row.padreNombre})` : ""}
            </span>
          ) : (
            <span className="text-slate-400 italic font-sans">NULL (Raíz)</span>
          )}
        </span>
      ),
    },
    {
      header: "EstadoRegistro",
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.estadoRegistro === 1
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-600 border border-rose-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.estadoRegistro === 1 ? "bg-emerald-500" : "bg-rose-400"
            }`}
          />
          {row.estadoRegistro === 1 ? "1 (Activo)" : "0 (Inactivo)"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              {isEditarPage ? "Editar Opciones de Menú" : "Mantenimiento de Opciones de Menú"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#063D2A] text-[#28D978] border border-[#28D978]/30 shadow-xs">
              Tabla OpcionesMenu &bull; {opciones.length} Entidades
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isEditarPage
              ? "Actualización de títulos de menú, rutas de navegación, descripción y estructura jerárquica (IdPadre)."
              : "Estructuración jerárquica de las 30 opciones del sistema (Tabla OpcionesMenu: IdOpcionMenu, Nombre, UrlMenu, Descripcion, IdPadre, EstadoRegistro)."}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <TablaGenerica
        columns={columns}
        data={opciones}
        searchQuery={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder={
          isEditarPage
            ? "Buscar opción para editar..."
            : "Buscar por nombre, ruta o descripción..."
        }
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(p) => setPage(p)}
        onNuevo={!isEditarPage ? handleOpenNuevo : undefined}
        nuevoLabel="Nueva Opción"
        onEdit={isEditarPage ? handleOpenEdit : undefined}
        onDelete={isEditarPage ? ((op) => setDeletingOpcion(op)) : undefined}
        loading={loading}
        emptyText="No se encontraron opciones de menú registradas."
        keyExtractor={(item) => item.idOpcionMenu}
      />

      {/* Modal Crear/Editar */}
      <ModalGenerico
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOpcion ? "Editar Opción de Menú" : "Nueva Opción de Menú"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          <FormField label="Nombre de la Opción" required>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Stock"
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
            />
          </FormField>

          <FormField label="Ruta / URL del Menú" required>
            <input
              type="text"
              value={formData.urlMenu}
              onChange={(e) => setFormData({ ...formData, urlMenu: e.target.value })}
              placeholder="Ej: /dashboard/stock"
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
            />
          </FormField>

          {/* Selector de Opción Padre para Jerarquía */}
          <FormField label="Opción Padre (Jerarquía)">
            <select
              value={formData.idPadre}
              onChange={(e) => setFormData({ ...formData, idPadre: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
            >
              <option value="">(Ninguna - Opción Raíz)</option>
              {opcionesPadre
                .filter((p) => !editingOpcion || p.idOpcionMenu !== editingOpcion.idOpcionMenu)
                .map((p) => (
                  <option key={p.idOpcionMenu} value={p.idOpcionMenu}>
                    Raíz: {p.nombre} ({p.urlMenu})
                  </option>
                ))}
            </select>
          </FormField>

          <FormField label="Descripción">
            <textarea
              rows={2}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Propósito de este enlace..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
            />
          </FormField>

          <FormActions
            onCancel={() => setIsModalOpen(false)}
            submitLabel={editingOpcion ? "Guardar Cambios" : "Crear Opción"}
            loading={formLoading}
          />
        </form>
      </ModalGenerico>

      {/* Modal Confirmar Desactivación */}
      <ModalGenerico
        isOpen={Boolean(deletingOpcion)}
        onClose={() => setDeletingOpcion(null)}
        title="Confirmar Desactivación de Opción de Menú"
        maxWidth="max-w-md"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-base mb-1">
            ¿Desactivar '{deletingOpcion?.nombre}'?
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
            Se marcará con <code className="text-indigo-600 font-bold">EstadoRegistro = 0</code>.
            Si tiene submenús asociados, también dejarán de mostrarse según la regla jerárquica.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeletingOpcion(null)}
              disabled={deleteLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm shadow-rose-600/20 disabled:opacity-50"
            >
              {deleteLoading ? "Desactivando..." : "Sí, Desactivar"}
            </button>
          </div>
        </div>
      </ModalGenerico>
    </div>
  );
};
