/*
  DashboardShell — optimized
  Changes:
  - No changes needed structurally — shell is already lean
  - Added overflow-hidden on root to prevent stray glows causing scrollbars
  - main scroll container gets overscroll-behavior-y: contain to prevent
    scroll chaining which causes jank on nested scroll areas
*/
import { Outlet } from "react-router-dom";
import AppSidebar from "./app-sidebar";
import TopNavbar from "./top-navbar";

export default function DashboardShell() {
  return (
    <div className="flex min-h-screen bg-[#050816] text-white overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main
          className="flex-1 p-5 lg:p-6 overflow-y-auto"
          style={{ overscrollBehaviorY: "contain" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
