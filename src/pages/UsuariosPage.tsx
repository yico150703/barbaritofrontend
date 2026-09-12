import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Perfil, Usuario } from "../types";
import { TablaGenerica, ColumnDef } from "../components/TablaGenerica";
import { ModalGenerico } from "../components/ModalGenerico";
import { FormField, FormActions } from "../components/FormularioGenerico";
import { Users, UserPlus, CheckCircle2, AlertTriangle, Shield, Edit3, Eye, ArrowRight, UserCheck, Trash2 } from "lucide-react";

export const UsuariosPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfilesDisponibles, setPerfilesDisponibles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Estados para Modal Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    celular: "",
    correoElectronico: "",
    clave: "",
    perfiles_ids: [] as number[],
    estadoRegistro: 1,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Estado para Modal Confirmar Desactivación (Borrado Lógico)
  const [deletingUser, setDeletingUser] = useState<Usuario | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cargar lista de usuarios desde la API (incluye inactivos para poder habilitarlos)
  const cargarUsuarios = async (p = page, q = search) => {
    try {
      setLoading(true);
      const res = await api.get("/usuarios", {
        params: { page: p, limit: 10, q, incluir_inactivos: true },
      });
      if (res.data.success) {
        setUsuarios(res.data.usuarios || []);
        setTotalPages(res.data.total_paginas || 1);
        setTotalRecords(res.data.total || 0);
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar perfiles para el selector multi-perfil
  const cargarPerfiles = async () => {
    try {
      const res = await api.get("/perfiles");
      if (res.data.success) {
        setPerfilesDisponibles(res.data.perfiles || []);
      }
    } catch (err) {
      console.error("Error al cargar perfiles:", err);
    }
  };

  useEffect(() => {
    cargarUsuarios(page, search);
  }, [page]);

  useEffect(() => {
    cargarPerfiles();
  }, []);

  // Búsqueda con debounce básico
  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
    cargarUsuarios(1, query);
  };

  const handleOpenNuevo = () => {
    setEditingUser(null);
    setFormData({
      dni: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      celular: "",
      correoElectronico: "",
      clave: "",
      perfiles_ids: [],
      estadoRegistro: 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      dni: String(user.dni || ""),
      nombres: user.nombres || "",
      apellidoPaterno: user.apellidoPaterno || "",
      apellidoMaterno: user.apellidoMaterno || "",
      celular: user.celular ? String(user.celular) : "",
      correoElectronico: user.correoElectronico || "",
      clave: "", // Vacío si no se desea cambiar
      perfiles_ids: user.perfiles?.map((p) => p.idPerfil) || [],
      estadoRegistro: user.estadoRegistro !== undefined ? user.estadoRegistro : 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Habilitar directamente a un usuario inactivo
  const handleHabilitarUsuario = async (user: Usuario) => {
    try {
      setLoading(true);
      await api.put(`/usuarios/${user.idUsuario}`, { estadoRegistro: 1 });
      setFeedbackMsg(`¡El usuario ${user.nombres} ${user.apellidoPaterno} ha sido habilitado con éxito!`);
      await cargarUsuarios(page, search);
    } catch (err: any) {
      setFeedbackMsg("Error al habilitar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  const togglePerfilSelection = (idPerfil: number) => {
    setFormData((prev) => {
      const exists = prev.perfiles_ids.includes(idPerfil);
      return {
        ...prev,
        perfiles_ids: exists
          ? prev.perfiles_ids.filter((id) => id !== idPerfil)
          : [...prev.perfiles_ids, idPerfil],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dni || !formData.nombres || !formData.apellidoPaterno || !formData.correoElectronico) {
      setFormError("Por favor completa los campos obligatorios.");
      return;
    }

    if (!editingUser && !formData.clave) {
      setFormError("La contraseña es obligatoria para nuevos usuarios.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      const payload: any = {
        dni: formData.dni.trim(),
        nombres: formData.nombres.trim(),
        apellidoPaterno: formData.apellidoPaterno.trim(),
        apellidoMaterno: formData.apellidoMaterno.trim() || null,
        celular: formData.celular.trim() || null,
        correoElectronico: formData.correoElectronico.trim().toLowerCase(),
        perfiles_ids: formData.perfiles_ids,
        estadoRegistro: formData.estadoRegistro,
      };

      if (formData.clave) {
        payload.clave = formData.clave;
      }

      if (editingUser) {
        await api.put(`/usuarios/${editingUser.idUsuario}`, payload);
        setFeedbackMsg(`¡Usuario ${payload.nombres} actualizado correctamente!`);
      } else {
        await api.post("/usuarios", payload);
        setFeedbackMsg(`¡Usuario ${payload.nombres} creado correctamente!`);
      }

      setIsModalOpen(false);
      cargarUsuarios(page, search);
    } catch (err: any) {
      if (err.response?.status === 409 || err.response?.data?.yaExiste) {
        setFormError(`⚠️ ${err.response?.data?.mensaje || "El usuario ya existe en el sistema. No se duplicará."}`);
      } else {
        const msg = err.response?.data?.mensaje || "Error al procesar la solicitud.";
        setFormError(msg);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      setDeleteLoading(true);
      // Borrado lógico vía API (EstadoRegistro = 0)
      await api.delete(`/usuarios/${deletingUser.idUsuario}`);
      setDeletingUser(null);
      cargarUsuarios(page, search);
    } catch (err) {
      console.error("Error al desactivar usuario:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Definición de columnas para TablaGenerica
  const columns: ColumnDef<Usuario>[] = [
    {
      header: "Usuario",
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-800 block">{row.nombreCompleto || `${row.nombres} ${row.apellidoPaterno}`}</span>
          <span className="text-xs text-slate-500">{row.correoElectronico}</span>
        </div>
      ),
    },
    {
      header: "DNI",
      accessor: "dni",
      className: "font-mono text-xs text-slate-600",
    },
    {
      header: "Celular",
      accessor: (row) => row.celular || "—",
      className: "text-xs text-slate-600",
    },
    {
      header: "Perfiles Asignados",
      accessor: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.perfiles && row.perfiles.length > 0 ? (
            row.perfiles.map((p) => (
              <span
                key={p.idPerfil}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
              >
                {p.nombre}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">Sin perfil</span>
          )}
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
      {/* Mensaje de Confirmación / Éxito */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer">
            Cerrar
          </button>
        </div>
      )}

      {/* Banner Informativo si se ingresó a la ruta /editar */}
      {location.pathname.includes("editar") && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-xs">
          <Edit3 className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block text-amber-950">Modo Edición y Habilitación de Usuarios</span>
            <span>Usa los botones de acción para editar datos personales o rehabilitar cuentas que se encuentren inactivas.</span>
          </div>
        </div>
      )}

      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Mantenimiento de Usuarios y Perfiles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestión completa de usuarios (Tabla <code>Usuario</code>), edición de cuentas y habilitación de acceso al sistema.
          </p>
        </div>

        <div>
          <button
            onClick={handleOpenNuevo}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#063D2A] hover:bg-[#022A1E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#063D2A]/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#28D978]" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Tabla con Búsqueda y Paginación (Formularios y Acciones siempre habilitados) */}
      <TablaGenerica
        columns={columns}
        data={usuarios}
        searchQuery={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por nombre, apellido, correo o DNI..."
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(p) => setPage(p)}
        onNuevo={handleOpenNuevo}
        nuevoLabel="Nuevo Usuario"
        renderActions={(item) => (
          <div className="inline-flex items-center gap-1.5">
            <button
              onClick={() => handleOpenEdit(item)}
              title="Editar datos del usuario"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Editar</span>
            </button>

            {item.estadoRegistro === 0 ? (
              <button
                onClick={() => handleHabilitarUsuario(item)}
                title="Habilitar este usuario"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-white" />
                <span>Habilitar</span>
              </button>
            ) : (
              <button
                onClick={() => setDeletingUser(item)}
                title="Inhabilitar usuario (Soft delete)"
                className="inline-flex items-center gap-1 px-2 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Inhabilitar</span>
              </button>
            )}
          </div>
        )}
        loading={loading}
        emptyText="No se encontraron usuarios registrados."
        keyExtractor={(item) => item.idUsuario}
      />

      {/* Modal Crear / Editar */}
      <ModalGenerico
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="DNI" required>
              <input
                type="number"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="Ej: 90999999"
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
              />
            </FormField>

            <FormField label="Celular">
              <input
                type="number"
                value={formData.celular}
                onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                placeholder="Ej: 999111222"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Nombres" required>
              <input
                type="text"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                placeholder="Nombres"
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
              />
            </FormField>

            <FormField label="Apellido Paterno" required>
              <input
                type="text"
                value={formData.apellidoPaterno}
                onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                placeholder="Apellido Paterno"
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
              />
            </FormField>

            <FormField label="Apellido Materno">
              <input
                type="text"
                value={formData.apellidoMaterno}
                onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                placeholder="Apellido Materno"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
              />
            </FormField>
          </div>

          <FormField label="Correo Electrónico" required>
            <input
              type="email"
              value={formData.correoElectronico}
              onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
              placeholder="correo@ejemplo.com"
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
            />
          </FormField>

          <FormField
            label={editingUser ? "Nueva Clave (dejar en blanco para mantener)" : "Contraseña"}
            required={!editingUser}
          >
            <input
              type="password"
              value={formData.clave}
              onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
              placeholder={editingUser ? "Opcional: nueva contraseña" : "••••••••"}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28D978]/30 focus:border-[#063D2A] text-slate-800"
            />
          </FormField>

          {/* Selector de Perfiles Asignados (Multi-perfil) */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Perfiles Asignados (Roles de Usuario)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {perfilesDisponibles.map((p) => {
                const isSelected = formData.perfiles_ids.includes(p.idPerfil);
                return (
                  <button
                    key={p.idPerfil}
                    type="button"
                    onClick={() => togglePerfilSelection(p.idPerfil)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-xs text-slate-800">{p.nombre}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 line-clamp-2">
                      {p.descripcion || "Sin descripción"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de Estado / Habilitación */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Estado de Cuenta / Habilitación en el Sistema
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, estadoRegistro: 1 })}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  formData.estadoRegistro === 1
                    ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">Usuario Habilitado</span>
                  <span className="text-[10px] text-emerald-700">Acceso activo al sistema</span>
                </div>
                {formData.estadoRegistro === 1 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, estadoRegistro: 0 })}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  formData.estadoRegistro === 0
                    ? "bg-rose-50 border-rose-400 ring-2 ring-rose-500/20 text-rose-900"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">Usuario Inhabilitado</span>
                  <span className="text-[10px] text-rose-700">Acceso bloqueado / inactivo</span>
                </div>
                {formData.estadoRegistro === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-rose-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300" />
                )}
              </button>
            </div>
          </div>

          {editingUser && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 grid grid-cols-2 gap-2">
              <div>
                <span className="font-semibold text-slate-700">ID Usuario:</span> #{editingUser.idUsuario}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Estado Registro:</span>{" "}
                <span className={formData.estadoRegistro === 1 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                  {formData.estadoRegistro === 1 ? "Habilitado (1)" : "Inhabilitado (0)"}
                </span>
              </div>
              {editingUser.fechaCreacion && (
                <div>
                  <span className="font-semibold text-slate-700">Fecha Creación:</span> {new Date(editingUser.fechaCreacion).toLocaleDateString()}
                </div>
              )}
              {editingUser.fechaModificacion && (
                <div>
                  <span className="font-semibold text-slate-700">Fecha Modif.:</span> {new Date(editingUser.fechaModificacion).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          <FormActions
            onCancel={() => setIsModalOpen(false)}
            submitLabel={editingUser ? "Guardar Cambios" : "Crear Usuario"}
            loading={formLoading}
          />
        </form>
      </ModalGenerico>

      {/* Modal de Confirmación de Borrado Lógico */}
      <ModalGenerico
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        title="Confirmar Desactivación de Usuario"
        maxWidth="max-w-md"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-base mb-1">
            ¿Desactivar a {deletingUser?.nombreCompleto || deletingUser?.nombres}?
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
            De acuerdo a la regla de negocio, el usuario no se borrará físicamente. Se actualizará su{" "}
            <code className="text-indigo-600 font-bold">EstadoRegistro = 0</code> y no podrá iniciar sesión.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeletingUser(null)}
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
