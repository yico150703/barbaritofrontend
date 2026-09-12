import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Perfil } from "../types";
import { TablaGenerica, ColumnDef } from "../components/TablaGenerica";
import { ModalGenerico } from "../components/ModalGenerico";
import { FormField, FormActions } from "../components/FormularioGenerico";
import { Shield, AlertTriangle } from "lucide-react";

export const PerfilesPage: React.FC = () => {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Estados Modal Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<Perfil | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Estado Borrado Lógico
  const [deletingPerfil, setDeletingPerfil] = useState<Perfil | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const cargarPerfiles = async (p = page, q = search) => {
    try {
      setLoading(true);
      const res = await api.get("/perfiles", {
        params: { page: p, limit: 10, q },
      });
      if (res.data.success) {
        setPerfiles(res.data.perfiles || []);
        setTotalPages(res.data.total_paginas || 1);
        setTotalRecords(res.data.total || 0);
      }
    } catch (err) {
      console.error("Error al cargar perfiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfiles(page, search);
  }, [page]);

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
    cargarPerfiles(1, query);
  };

  const handleOpenNuevo = () => {
    setEditingPerfil(null);
    setFormData({ nombre: "", descripcion: "" });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (perfil: Perfil) => {
    setEditingPerfil(perfil);
    setFormData({
      nombre: perfil.nombre || "",
      descripcion: perfil.descripcion || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setFormError("El nombre del perfil es obligatorio.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      if (editingPerfil) {
        await api.put(`/perfiles/${editingPerfil.idPerfil}`, formData);
      } else {
        await api.post("/perfiles", formData);
      }

      setIsModalOpen(false);
      cargarPerfiles(page, search);
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || "Error al procesar el perfil.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPerfil) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/perfiles/${deletingPerfil.idPerfil}`);
      setDeletingPerfil(null);
      cargarPerfiles(page, search);
    } catch (err) {
      console.error("Error al desactivar perfil:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: ColumnDef<Perfil>[] = [
    {
      header: "ID",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-slate-500">
          #{row.idPerfil}
        </span>
      ),
      className: "w-16",
    },
    {
      header: "Nombre del Rol",
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-800 block text-sm">{row.nombre}</span>
          <span className="text-xs text-slate-500">{row.descripcion || "Sin descripción"}</span>
        </div>
      ),
    },
    {
      header: "Estado",
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.estadoRegistro === 1
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.estadoRegistro === 1 ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {row.estadoRegistro === 1 ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Mantenimiento de Perfiles (Roles)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configuración y mantenimiento de perfiles y roles del sistema (Tabla <code>Perfiles</code>).
          </p>
        </div>

        <div>
          <button
            onClick={handleOpenNuevo}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#063D2A]/20 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#28D978]" />
            <span>Nuevo Perfil</span>
          </button>
        </div>
      </div>

      {/* Tabla */}
      <TablaGenerica
        columns={columns}
        data={perfiles}
        searchQuery={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por nombre o descripción de rol..."
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(p) => setPage(p)}
        onNuevo={handleOpenNuevo}
        nuevoLabel="Nuevo Perfil"
        onEdit={handleOpenEdit}
        onDelete={(p) => setDeletingPerfil(p)}
        loading={loading}
        emptyText="No se encontraron perfiles registrados."
        keyExtractor={(item) => item.idPerfil}
      />

      {/* Modal Crear/Editar */}
      <ModalGenerico
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPerfil ? "Editar Perfil" : "Nuevo Perfil"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          <FormField label="Nombre del Rol / Perfil" required>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Supervisor de Almacén"
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
            />
          </FormField>

          <FormField label="Descripción de Responsabilidades">
            <textarea
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Funciones y alcance de este rol..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
            />
          </FormField>

          <FormActions
            onCancel={() => setIsModalOpen(false)}
            submitLabel={editingPerfil ? "Guardar Cambios" : "Crear Perfil"}
            loading={formLoading}
          />
        </form>
      </ModalGenerico>

      {/* Modal Confirmar Desactivación */}
      <ModalGenerico
        isOpen={Boolean(deletingPerfil)}
        onClose={() => setDeletingPerfil(null)}
        title="Confirmar Desactivación de Perfil"
        maxWidth="max-w-md"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-base mb-1">
            ¿Desactivar el perfil '{deletingPerfil?.nombre}'?
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
            Se marcará con <code className="text-indigo-600 font-bold">EstadoRegistro = 0</code>.
            Los usuarios que dependan de este rol no podrán acceder a sus módulos asociados.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeletingPerfil(null)}
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
