import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, e as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-U8ZYFczC.css";
function createSupabaseClient() {
  const SUPABASE_URL = "https://qahezflmcaqmyclsqyxy.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaGV6ZmxtY2FxbXljbHNxeXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5ODg3NjMsImV4cCI6MjA5NDU2NDc2M30.wpGPJ3XL_AF3ieOzuAO-FRLubIqlXYOvvvr2c4Nt7ZQ";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const client = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  supabase
}, Symbol.toStringTag, { value: "Module" }));
const Ctx = reactExports.createContext({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {
  }
});
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx.Provider,
    {
      value: {
        session,
        user: session?.user ?? null,
        loading,
        signOut: async () => {
          await supabase.auth.signOut();
        }
      },
      children
    }
  );
}
const useAuth = () => reactExports.useContext(Ctx);
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$8 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SIKOPI — Sistem Informasi Keperawatan Ortopedi Praktik Independen" },
      { name: "description", content: "SIKOPI adalah aplikasi sistem informasi keperawatan ortopedi untuk praktik mandiri keperawatan." },
      { name: "author", content: "SIKOPI" },
      { property: "og:title", content: "SIKOPI — Sistem Informasi Keperawatan Ortopedi Praktik Independen" },
      { property: "og:description", content: "SIKOPI adalah aplikasi sistem informasi keperawatan ortopedi untuk praktik mandiri keperawatan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@SIKOPI" },
      { name: "twitter:title", content: "SIKOPI — Sistem Informasi Keperawatan Ortopedi Praktik Independen" },
      { name: "twitter:description", content: "Clinic Compass is a desktop web application for managing small independent clinics." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a73c78b9-26a7-4913-b456-986c11997e7a/id-preview-f06c6b67--b1c770a5-667c-404d-bfd0-668c61b33c5e.lovable.app-1778993567202.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a73c78b9-26a7-4913-b456-986c11997e7a/id-preview-f06c6b67--b1c770a5-667c-404d-bfd0-668c61b33c5e.lovable.app-1778993567202.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$8.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) });
}
const $$splitComponentImporter$7 = () => import("./login-BKNrXja8.mjs");
const Route$7 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("../_authenticated-C6B-QIqj.mjs");
const Route$6 = createFileRoute("/_authenticated")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-DARjHIP2.mjs");
const Route$5 = createFileRoute("/_authenticated/")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./reports-BZUgnw9M.mjs");
const Route$4 = createFileRoute("/_authenticated/reports")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./patients.index-ClDyXrHk.mjs");
const Route$3 = createFileRoute("/_authenticated/patients/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./patients.new-DEYHrN9d.mjs");
const Route$2 = createFileRoute("/_authenticated/patients/new")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./patients._id-C1Y3Vv1t.mjs");
const Route$1 = createFileRoute("/_authenticated/patients/$id")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./patients._id.visits.new-PfQj3MlA.mjs");
const Route = createFileRoute("/_authenticated/patients/$id/visits/new")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const LoginRoute = Route$7.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$8
});
const AuthenticatedRoute = Route$6.update({
  id: "/_authenticated",
  getParentRoute: () => Route$8
});
const AuthenticatedIndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedReportsRoute = Route$4.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedPatientsIndexRoute = Route$3.update({
  id: "/patients/",
  path: "/patients/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedPatientsNewRoute = Route$2.update({
  id: "/patients/new",
  path: "/patients/new",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedPatientsIdRoute = Route$1.update({
  id: "/patients/$id",
  path: "/patients/$id",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedPatientsIdVisitsNewRoute = Route.update({
  id: "/visits/new",
  path: "/visits/new",
  getParentRoute: () => AuthenticatedPatientsIdRoute
});
const AuthenticatedPatientsIdRouteChildren = {
  AuthenticatedPatientsIdVisitsNewRoute
};
const AuthenticatedPatientsIdRouteWithChildren = AuthenticatedPatientsIdRoute._addFileChildren(
  AuthenticatedPatientsIdRouteChildren
);
const AuthenticatedRouteChildren = {
  AuthenticatedReportsRoute,
  AuthenticatedIndexRoute,
  AuthenticatedPatientsIdRoute: AuthenticatedPatientsIdRouteWithChildren,
  AuthenticatedPatientsNewRoute,
  AuthenticatedPatientsIndexRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$1 as R,
  Route as a,
  client as c,
  router as r,
  supabase as s,
  useAuth as u
};
