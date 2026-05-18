import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as Route, s as supabase } from "./router-BrMXvL0y.mjs";
import { e as emptyVisit, V as VisitFields, p as persistVisit } from "./VisitFields-D5W_j8ou.mjs";
import { a as ArrowLeft } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./label-Brw405F4.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "./input-DwaGuH4D.mjs";
import "./textarea-BBisE2jS.mjs";
function AddVisitPage() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = reactExports.useState(false);
  const [v, setV] = reactExports.useState(emptyVisit());
  const [patientName, setPatientName] = reactExports.useState("");
  reactExports.useEffect(() => {
    supabase.from("patients").select("full_name, mrn").eq("id", id).single().then(({
      data
    }) => {
      if (data) setPatientName(`${data.full_name} · ${data.mrn}`);
    });
  }, [id]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await persistVisit({
        patient_id: id,
        state: v
      });
      toast.success("Visit saved");
      navigate({
        to: "/patients/$id",
        params: {
          id
        }
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/patients/$id", params: {
        id
      }, className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " Back"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold mt-1", children: "Add Visit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: patientName })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 text-sm text-muted-foreground", children: "Recording a new examination for an existing patient." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VisitFields, { state: v, set: (patch) => setV({
      ...v,
      ...patch
    }), startSection: 1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 sticky bottom-0 bg-background/80 backdrop-blur py-4 -mx-6 px-6 border-t", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", asChild: true, disabled: busy, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/patients/$id", params: {
        id
      }, children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving…" : "Save Visit" })
    ] })
  ] });
}
export {
  AddVisitPage as component
};
