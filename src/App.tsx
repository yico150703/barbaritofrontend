import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RutaProtegida } from "./components/RutaProtegida";
import { DashboardLayout } from "./components/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardHomePage } from "./pages/DashboardHomePage";
import { PanelDashboardPage } from "./pages/PanelDashboardPage";
import { UsuariosPage } from "./pages/UsuariosPage";
import { PerfilesPage } from "./pages/PerfilesPage";
import { OpcionesMenuPage } from "./pages/OpcionesMenuPage";
import { ModuloOperativoPage } from "./pages/ModuloOperativoPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública de Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Redirección directa para evitar multi-rol previo */}
          <Route path="/seleccionar-rol" element={<Navigate to="/home" replace />} />

          {/* Rutas Protegidas bajo /home (Rutas nativas de la BD) */}
          <Route element={<RutaProtegida />}>
            <Route path="/home" element={<DashboardLayout />}>
              {/* Dashboard Inicial con solo Inicio */}
              <Route index element={<DashboardHomePage />} />

              {/* Dashboards específicos de cada panel */}
              <Route path="panel-tecnico" element={<PanelDashboardPage panelTipo="tecnico" />} />
              <Route path="panel-gerencial" element={<PanelDashboardPage panelTipo="gerencial" />} />
              <Route path="panel-miembro-equipo" element={<PanelDashboardPage panelTipo="miembro-equipo" />} />

              {/* Módulos y CRUDs del sistema */}
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="usuarios/*" element={<UsuariosPage />} />
              <Route path="perfiles" element={<PerfilesPage />} />
              {/* Redirección de URL errónea inventario/realizar hacia la URL correcta inventario-realizar */}
              <Route path="inventario/realizar" element={<Navigate to="/home/inventario-realizar" replace />} />
              <Route path="inventario" element={<Navigate to="/home/inventario-realizar" replace />} />
              <Route path="*" element={<ModuloOperativoPage />} />
            </Route>

            {/* Alias /dashboard para compatibilidad con las URLs de la BD */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHomePage />} />
              <Route path="panel-tecnico" element={<PanelDashboardPage panelTipo="tecnico" />} />
              <Route path="panel-gerencial" element={<PanelDashboardPage panelTipo="gerencial" />} />
              <Route path="panel-miembro-equipo" element={<PanelDashboardPage panelTipo="miembro-equipo" />} />
              <Route path="tecnico" element={<PanelDashboardPage panelTipo="tecnico" />} />
              <Route path="gerencial" element={<PanelDashboardPage panelTipo="gerencial" />} />
              <Route path="miembro-equipo" element={<PanelDashboardPage panelTipo="miembro-equipo" />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="usuarios/*" element={<UsuariosPage />} />
              <Route path="perfiles" element={<PerfilesPage />} />
              <Route path="opciones-menu" element={<OpcionesMenuPage />} />
              <Route path="inventario/realizar" element={<Navigate to="/dashboard/inventario-realizar" replace />} />
              <Route path="inventario" element={<Navigate to="/dashboard/inventario-realizar" replace />} />
              <Route path="*" element={<ModuloOperativoPage />} />
            </Route>
          </Route>

          {/* La primera pantalla que se muestra siempre es el Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
