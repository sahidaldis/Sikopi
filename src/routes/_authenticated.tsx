import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { ClinicSidebar } from "@/components/clinic/Sidebar";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { session, loading } = useAuth();

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
      <ClinicSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card/60 backdrop-blur flex items-center px-6 sticky top-0 z-10">
          <h2 className="text-sm font-medium text-muted-foreground">Clinic Management System</h2>
        </header>
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
