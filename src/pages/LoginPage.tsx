import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, Eye, EyeOff, Warehouse, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expirado = searchParams.get("expirado");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo || !clave) {
      setError("Por favor complete todos los campos.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(correo, clave);
      navigate("/home");
    } catch (err: any) {
      const msg =
        err.response?.data?.mensaje ||
        err.message ||
        "Error al iniciar sesión. Verifique sus datos.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const llenarDemo = (emailDemo: string) => {
    setCorreo(emailDemo);
    setClave("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800">
      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/40 mb-4 border border-indigo-400/30">
            <Warehouse className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sistema de Almacén
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">
            Control de Acceso RBAC &bull; 3 Roles Principales
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          {expirado && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Tu sesión anterior ha expirado. Por favor, vuelve a iniciar sesión.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Correo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Campo Clave */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Cuentas reales para los 3 Roles */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cuentas de Prueba (Clic Rápido):
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => llenarDemo("crodriguez@gmail.com")}
                className="w-full px-3 py-2 text-left text-xs bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-sky-800">Carlos Rodríguez</span>
                  <span className="block text-[11px] text-slate-500">crodriguez@gmail.com</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  Técnico (Acceso a los 3 Paneles)
                </span>
              </button>

              <button
                type="button"
                onClick={() => llenarDemo("jrios@gmail.com")}
                className="w-full px-3 py-2 text-left text-xs bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-amber-900">José Ríos</span>
                  <span className="block text-[11px] text-slate-500">jrios@gmail.com</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Gerente / Administrador
                </span>
              </button>

              <button
                type="button"
                onClick={() => llenarDemo("rdiaz@gmail.com")}
                className="w-full px-3 py-2 text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-emerald-900">Roberto Díaz</span>
                  <span className="block text-[11px] text-slate-500">rdiaz@gmail.com</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  Miembro de equipo (Operativo)
                </span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Contraseña demo para todos: <code className="text-indigo-400 font-bold">password123</code>
        </p>
      </div>
    </div>
  );
};
