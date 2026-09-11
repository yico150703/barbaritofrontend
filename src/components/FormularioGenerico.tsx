import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <span className="text-xs font-medium text-rose-500">{error}</span>}
    </div>
  );
};

interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  loading = false,
}) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#063D2A] hover:bg-[#022A1E] rounded-xl transition-all shadow-sm shadow-[#063D2A]/25 disabled:opacity-50 flex items-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white border-t-[#28D978] rounded-full animate-spin" />
        )}
        <span>{submitLabel}</span>
      </button>
    </div>
  );
};
