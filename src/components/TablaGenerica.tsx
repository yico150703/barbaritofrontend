import React from "react";
import { Search, ChevronLeft, ChevronRight, Edit3, Trash2, Plus } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TablaGenericaProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (newPage: number) => void;
  onNuevo?: () => void;
  nuevoLabel?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  emptyText?: string;
  keyExtractor: (item: T) => string | number;
}

export function TablaGenerica<T>({
  columns,
  data,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Buscar registros...",
  page = 1,
  totalPages = 1,
  totalRecords,
  onPageChange,
  onNuevo,
  nuevoLabel = "Nuevo Registro",
  onEdit,
  onDelete,
  loading = false,
  emptyText = "No se encontraron registros.",
  keyExtractor,
}: TablaGenericaProps<T>) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Barra superior con buscador y botón nuevo */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
        {onSearchChange !== undefined && (
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
            />
          </div>
        )}

        {onNuevo && (
          <button
            onClick={onNuevo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-600/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{nuevoLabel}</span>
          </button>
        )}
      </div>

      {/* Tabla responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-100/60 text-slate-600 text-xs font-bold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3.5 px-4 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="py-3.5 px-4 text-right">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="py-12 text-center text-slate-400"
                >
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-medium">Cargando información...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="py-12 text-center text-slate-400"
                >
                  <p className="text-sm font-medium">{emptyText}</p>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {columns.map((col, cIdx) => {
                    let cellContent: React.ReactNode = null;
                    if (typeof col.accessor === "function") {
                      cellContent = col.accessor(item);
                    } else if (col.accessor) {
                      cellContent = String(item[col.accessor] ?? "");
                    }
                    return (
                      <td key={cIdx} className={`py-3.5 px-4 ${col.className || ""}`}>
                        {cellContent}
                      </td>
                    );
                  })}

                  {/* Acciones Editar y Eliminar (Soft delete) */}
                  {(onEdit || onDelete) && (
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            title="Editar"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            title="Desactivar (Borrado Lógico)"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && onPageChange && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/40">
          <span>
            {totalRecords !== undefined ? (
              <>Total: <strong className="font-semibold text-slate-700">{totalRecords}</strong> registros</>
            ) : (
              <>Página <strong className="font-semibold text-slate-700">{page}</strong> de <strong className="font-semibold text-slate-700">{totalPages}</strong></>
            )}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
