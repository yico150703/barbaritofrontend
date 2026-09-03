import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* Sidebar dinámico replegable */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar superior */}
        <Topbar />

        {/* Área de trabajo con scroll independiente */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
