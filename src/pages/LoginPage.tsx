import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Lock, Mail, AlertCircle, CheckCircle2, ShieldCheck, Database, Wrench, Shield, Users } from "lucide-react";
import barBgImg from "../assets/barbarian_bar_bg.jpg";
import vikingLogoImg from "../assets/barbarian_viking_logo.jpg";

export const LoginPage: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [initSuccess, setInitSuccess] = useState<string | null>(null);

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
      setInitSuccess(null);
      const res = await login(correo.trim(), clave.trim());
      navigate(res.rutaDestino || "/home");
    } catch (err: any) {
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.message ||
        "Error al iniciar sesión. Verifique sus credenciales.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInicializarBD = async () => {
    try {
      setInitLoading(true);
      setError(null);
      setInitSuccess(null);
      const res = await api.get("/init-db");
      if (res.data?.success) {
        setInitSuccess(
          "✅ ¡Base de datos inicializada con éxito! Tablas y datos de Barbarian creados. Ya puedes ingresar."
        );
        setCorreo("crodriguez@gmail.com");
        setClave("Tec123*");
      } else {
        setError(res.data?.mensaje || "No se pudo inicializar la base de datos.");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        err.message ||
        "Error al contactar con el backend.";
      setError(`Error al inicializar la base de datos: ${msg}`);
    } finally {
      setInitLoading(false);
    }
  };

  const llenarDemo = (emailDemo: string, passDemo: string) => {
    setCorreo(emailDemo);
    setClave(passDemo);
    setError(null);
    setInitSuccess(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F3F1EA] overflow-hidden font-sans">
      {/* ========================================================================= */}
      {/* LADO IZQUIERDO: HERO BRANDING BARBARIAN CON FOTOGRAFÍA Y CORTE DIAGONAL */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[54%] min-h-[420px] lg:min-h-screen bg-[#022A1E] flex flex-col justify-between p-8 sm:p-12 z-10 overflow-hidden">
        {/* Imagen de fondo de Cervecería/Bar */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out pointer-events-none"
          style={{ backgroundImage: `url(${barBgImg})` }}
        />

        {/* Gradiente tonal Verde Profundo & Verde Oscuro */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(11, 14, 12, 0.94) 0%, rgba(2, 42, 30, 0.90) 45%, rgba(6, 61, 42, 0.85) 100%)",
          }}
        />

        {/* Marco tecnológico HUD / Cyberpunk en esquinas */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#28D978]/50 pointer-events-none" />
        <div className="absolute top-6 right-12 w-12 h-12 border-t-2 border-r-2 border-[#28D978]/50 pointer-events-none hidden lg:block" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#28D978]/50 pointer-events-none" />

        {/* Línea neón diagonal en el borde divisorio derecho (solo en desktop) */}
        <div className="absolute -right-2 top-0 bottom-0 w-3 bg-[#28D978] shadow-[0_0_20px_#28D978] hidden lg:block z-30 transform -skew-x-3 origin-top-right" />

        {/* Header superior del Hero */}
        <div className="relative z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#28D978] animate-pulse shadow-[0_0_8px_#28D978]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#28D978]">
              Plataforma Oficial
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400/80 tracking-widest">
            v2.4 &bull; SECURE RBAC
          </span>
        </div>

        {/* Contenido Central: Isotipo Vikingo + BARBARIAN + Subtítulo */}
        <div className="relative z-20 my-auto py-10 flex flex-col items-center text-center">
          {/* Isotipo Vikingo Barbarian */}
          <div className="relative mb-5 group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#28D978] to-[#063D2A] opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-[#022A1E] border-2 border-[#28D978]/60 shadow-2xl flex items-center justify-center p-1">
              <img
                src={vikingLogoImg}
                alt="Barbarian Viking"
                className="w-full h-full object-cover rounded-2xl brightness-110 contrast-125"
              />
            </div>
          </div>

          {/* Nombre de Marca: BARBARIAN */}
          <h1 className="font-['Bebas_Neue'] text-6xl sm:text-7xl lg:text-8xl tracking-[0.22em] text-white font-black leading-none drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] select-none">
            BARBARIAN
          </h1>

          {/* Subtítulo: Sistema de Gestión de Inventario */}
          <p className="text-xs sm:text-sm font-bold text-[#28D978] tracking-[0.28em] uppercase mt-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Sistema de Gestión de Inventario
          </p>

          <p className="text-xs text-slate-300/80 max-w-md mt-4 leading-relaxed hidden sm:block">
            Control de existencias en tiempo real, kardex de entradas y salidas, solicitudes de compra y auditoría de inventario físico.
          </p>
        </div>

        {/* Footer del Hero con 3 puntos de estado */}
        <div className="relative z-20 flex items-center justify-between pt-4 border-t border-slate-700/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#28D978]/80" />
            <span className="w-2 h-2 rounded-full bg-[#28D978]/50" />
            <span className="w-2 h-2 rounded-full bg-[#28D978]/20" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Cervecería Barbarian &bull; Almacén Central
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LADO DERECHO: FORMULARIO FLOTANTE SOBRE FONDO CREMA CLARO (#F3F1EA) */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[46%] min-h-[600px] lg:min-h-screen bg-[#F3F1EA] flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Trama de puntos sutiles */}
        <div className="absolute inset-0 bg-barbarian-dots opacity-20 pointer-events-none" />

        {/* Tarjeta Flotante Blanca (#FFFFFF) con bordes redondeados y sombra profunda */}
        <div className="relative w-full max-w-md bg-white rounded-[2.2rem] p-7 sm:p-10 shadow-[0_20px_50px_rgba(6,61,42,0.12)] border border-[#063D2A]/10 z-10 animate-in fade-in duration-300">
          {/* Header de la Tarjeta */}
          <div className="text-center mb-6">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#28D978] mb-1">
              ACCESO SEGURO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#063D2A] tracking-tight">
              INICIAR SESIÓN
            </h2>
            <div className="w-12 h-1 bg-[#28D978] rounded-full mx-auto my-2.5" />
            <p className="text-xs text-slate-500 font-medium">
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          {/* Mensajes de Alerta */}
          {expirado && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Tu sesión ha expirado. Por favor, identifícate de nuevo.</span>
            </div>
          )}

          {initSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-start gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="flex-1">{initSuccess}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex flex-col gap-2 shadow-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span className="flex-1 leading-relaxed">{error}</span>
              </div>
              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-rose-600 font-medium">¿Problema en BD?</span>
                <button
                  type="button"
                  disabled={initLoading}
                  onClick={handleInicializarBD}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Database className="w-3 h-3" />
                  <span>{initLoading ? "Reparando..." : "Sembrar Base de Datos"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Correo Electrónico */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="ejemplo@barbarian.pe"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#28D978]/40 focus:border-[#28D978] transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña con botón "Ver" */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
                  className="w-full pl-10 pr-14 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#28D978]/40 focus:border-[#28D978] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-[#063D2A] transition-colors uppercase px-1 py-0.5 rounded cursor-pointer"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {/* Botón INGRESAR en Verde Oscuro (#063D2A) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#063D2A] hover:bg-[#022A1E] text-white font-extrabold text-sm uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-[#063D2A]/25 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>INGRESAR</span>
              )}
            </button>
          </form>

          {/* Indicador de Acceso protegido y supervisado */}
          <div className="mt-5 text-center flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#28D978] animate-pulse" />
            <span>Acceso protegido y supervisado</span>
          </div>

          {/* Sección de Credenciales Rápidas para Demostración */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center mb-2.5">
              Acceso rápido para demostración
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => llenarDemo("crodriguez@gmail.com", "Tec123*")}
                className="px-2 py-1.5 rounded-lg bg-[#022A1E]/5 hover:bg-[#022A1E]/15 border border-[#063D2A]/20 text-[11px] font-bold text-[#063D2A] transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                title="Carlos Rodriguez Torres - Técnico"
              >
                <Wrench className="w-3.5 h-3.5 text-[#063D2A]" />
                <span>Técnico</span>
              </button>

              <button
                type="button"
                onClick={() => llenarDemo("jrios@gmail.com", "Ger123*")}
                className="px-2 py-1.5 rounded-lg bg-[#022A1E]/5 hover:bg-[#022A1E]/15 border border-[#063D2A]/20 text-[11px] font-bold text-[#063D2A] transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                title="José Ríos Martínez - Gerente"
              >
                <Shield className="w-3.5 h-3.5 text-[#063D2A]" />
                <span>Gerente</span>
              </button>

              <button
                type="button"
                onClick={() => llenarDemo("rdiaz@gmail.com", "Equ123*")}
                className="px-2 py-1.5 rounded-lg bg-[#022A1E]/5 hover:bg-[#022A1E]/15 border border-[#063D2A]/20 text-[11px] font-bold text-[#063D2A] transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                title="Roberto Díaz Guerrero - Miembro de Equipo"
              >
                <Users className="w-3.5 h-3.5 text-[#063D2A]" />
                <span>Miembro</span>
              </button>
            </div>
            <div className="text-[10px] text-slate-500 text-center mt-2.5 font-mono space-y-0.5">
              <p>Técnico: <strong className="text-slate-700 font-bold">Tec123*</strong> &bull; Gerente: <strong className="text-slate-700 font-bold">Ger123*</strong></p>
              <p>Miembro: <strong className="text-slate-700 font-bold">Equ123*</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
