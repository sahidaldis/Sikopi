import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { N as Navigate, O as Outlet, f as useRouterState, d as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./_ssr/router-BrMXvL0y.mjs";
import { B as Button } from "./_ssr/button-BXrfXN_b.mjs";
import { l as logoUrl } from "./_ssr/logo-Cu87G6Ns.mjs";
import "./_libs/sonner.mjs";
import { X, M as Menu, L as LayoutDashboard, l as Users, C as ChartColumn, h as LogOut } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/reports", label: "Reports", icon: ChartColumn }
];
function ClinicSidebar({ onItemClick }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isActive = (to, exact) => exact ? path === to : path === to || path.startsWith(to + "/");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "h-full w-full flex flex-col bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-b flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoUrl, alt: "SIKOPI Logo", className: "w-40 h-auto object-contain" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 py-4 space-y-1", children: items.map(({ to, label, icon: Icon, exact }) => {
      const active = isActive(to, exact);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to,
          onClick: onItemClick,
          className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
            label
          ]
        },
        to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 text-xs text-muted-foreground truncate", children: user?.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
          onClick: async () => {
            await signOut();
            navigate({ to: "/login" });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4 mr-2" }),
            " Sign out"
          ]
        }
      )
    ] })
  ] });
}
function AuthLayout() {
  const {
    session,
    loading
  } = useAuth();
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" }) });
  }
  if (!session) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:flex sticky top-0 h-screen w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClinicSidebar, {}) }),
    sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-40 flex lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity", onClick: () => setSidebarOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex w-64 max-w-xs flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-2 top-2 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-sidebar-foreground hover:bg-sidebar-accent size-8", onClick: () => setSidebarOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClinicSidebar, { onItemClick: () => setSidebarOpen(false) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-14 border-b bg-card/60 backdrop-blur flex items-center px-4 sm:px-6 sticky top-0 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "lg:hidden mr-3 shrink-0", onClick: () => setSidebarOpen(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-primary truncate", children: "SIKOPI — Sistem Informasi Keperawatan Ortopedi Praktik Independen" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 sm:p-6 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AuthLayout as component
};
