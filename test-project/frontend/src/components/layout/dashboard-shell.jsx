import { Outlet } from "react-router-dom";

import AppSidebar from "./app-sidebar";

import TopNavbar from "./top-navbar";

export default function DashboardShell() {
  return (
    <div
      className="
        flex
        min-h-screen
        bg-[#050816]
        text-white
      "
    >
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <TopNavbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
