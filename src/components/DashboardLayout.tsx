import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F1EA] font-sans text-[#0B0E0C]">
      {/* Sidebar dinámico replegable */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar superior */}
        <Topbar />

        {/* Área de trabajo con scroll independiente sobre fondo Crema claro (#F3F1EA) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F3F1EA]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
