import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-FI0wxeE3.mjs";
import { s as supabase } from "./router-BrMXvL0y.mjs";
import { f as formatDate } from "./format-BOBLGkWK.mjs";
import "../_libs/sonner.mjs";
import { U as UserPlus, k as UserSearch, l as Users, A as Activity, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState({
    patients: 0,
    visitsToday: 0
  });
  reactExports.useEffect(() => {
    (async () => {
      const {
        count: pc
      } = await supabase.from("patients").select("id", {
        count: "exact",
        head: true
      });
      const start = /* @__PURE__ */ new Date();
      start.setHours(0, 0, 0, 0);
      const {
        count: vc
      } = await supabase.from("visits").select("id", {
        count: "exact",
        head: true
      }).gte("visited_at", start.toISOString());
      setStats({
        patients: pc ?? 0,
        visitsToday: vc ?? 0
      });
    })();
  }, []);
  reactExports.useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      const term = q.trim();
      let query = supabase.from("patients").select("id, mrn, full_name, address, phone, dob").order("full_name").limit(20);
      if (term) query = query.or(`mrn.ilike.%${term}%,full_name.ilike.%${term}%,address.ilike.%${term}%`);
      const {
        data
      } = await query;
      setResults(data ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [q, open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Choose an action to begin a patient session." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
        to: "/patients/new"
      }), className: "group text-left rounded-2xl border-2 border-transparent bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-white/15 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: "New Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-90 mt-2", children: "Register a new patient and record their first examination." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "group text-left rounded-2xl border-2 border-border bg-card p-8 shadow-sm hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserSearch, { className: "size-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: "Existing Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Search by medical record number, name, or address." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total Patients" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.patients })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-chart-2/15 text-chart-2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Visits Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.visitsToday })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Quick links" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/patients", className: "text-primary hover:underline", children: "All patients" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reports", className: "text-primary hover:underline", children: "Reports" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Find existing patient" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { autoFocus: true, placeholder: "Search by MRN, name, or address…", value: q, onChange: (e) => setQ(e.target.value) }),
          q && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQ(""), className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[420px] overflow-auto rounded-md border divide-y", children: results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: "No patients found." }) : results.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setOpen(false);
          navigate({
            to: "/patients/$id",
            params: {
              id: p.id
            }
          });
        }, className: "w-full text-left p-3 hover:bg-accent flex justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: p.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              p.mrn,
              " · ",
              p.phone ?? "—",
              " · DOB ",
              formatDate(p.dob)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: p.address })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Open" })
        ] }, p.id)) })
      ] })
    ] }) })
  ] });
}
export {
  Dashboard as component
};
