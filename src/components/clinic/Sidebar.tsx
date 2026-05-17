import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, BarChart3, Stethoscope, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
] as const;

export function ClinicSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="px-6 py-5 border-b flex items-center gap-3">
        <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
          <Stethoscope className="size-5" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">Clinic Suite</div>
          <div className="text-xs text-muted-foreground">Private Practice</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ to, label, icon: Icon, exact }) => {
          const active = isActive(to, exact);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3 space-y-2">
        <div className="px-3 text-xs text-muted-foreground truncate">{user?.email}</div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={async () => {
            await signOut();
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4 mr-2" /> Sign out
        </Button>
      </div>
    </aside>
  );
}
