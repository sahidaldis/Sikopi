import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ClinicSidebar } from "@/components/clinic/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { session, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!session) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground">
        <ClinicSidebar />
      </div>

      {/* Mobile sidebar overlay drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative flex w-64 max-w-xs flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300">
            {/* Close button */}
            <div className="absolute right-2 top-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent size-8"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            {/* Render Sidebar inside */}
            <div className="flex-1 overflow-y-auto">
              <ClinicSidebar onItemClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card/60 backdrop-blur flex items-center px-4 sm:px-6 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-3 shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <h2 className="text-sm font-semibold text-primary truncate">
            SIKOPI — Sistem Informasi Keperawatan Ortopedi Praktik Independen
          </h2>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
