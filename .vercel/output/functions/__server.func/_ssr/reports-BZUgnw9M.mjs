import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DdVpvAyP.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BdRDhspm.mjs";
import { S as Skeleton } from "./skeleton-F-7As_y7.mjs";
import { s as supabase } from "./router-BrMXvL0y.mjs";
import { a as ageFromDob, f as formatDate, c as formatIDR } from "./format-BOBLGkWK.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { a as autoTable } from "../_libs/jspdf-autotable.mjs";
import { u as utils, w as writeFileSync } from "../_libs/xlsx.mjs";
import "../_libs/sonner.mjs";
import { j as Printer, F as FileSpreadsheet, D as Download } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, d as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, c as Line, a as BarChart, B as Bar, e as PieChart, P as Pie, b as Cell, L as Legend } from "../_libs/recharts.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function rangeBounds(r, custom) {
  const now = /* @__PURE__ */ new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (r === "weekly") start.setDate(start.getDate() - 6);
  else if (r === "monthly") start.setDate(start.getDate() - 29);
  else if (r === "custom") {
    if (custom.from) start.setTime(new Date(custom.from).setHours(0, 0, 0, 0));
    if (custom.to) end.setTime(new Date(custom.to).setHours(23, 59, 59, 999));
  }
  return {
    start,
    end
  };
}
function ReportsPage() {
  const [range, setRange] = reactExports.useState("monthly");
  const [custom, setCustom] = reactExports.useState({
    from: "",
    to: ""
  });
  const [loading, setLoading] = reactExports.useState(true);
  const [visits, setVisits] = reactExports.useState([]);
  const [patients, setPatients] = reactExports.useState([]);
  const bounds = reactExports.useMemo(() => rangeBounds(range, custom), [range, custom]);
  reactExports.useEffect(() => {
    setLoading(true);
    Promise.all([supabase.from("visits").select("id, visited_at, tariff, patient_id, final_diagnosis").gte("visited_at", bounds.start.toISOString()).lte("visited_at", bounds.end.toISOString()).order("visited_at"), supabase.from("patients").select("id, gender, dob, created_at")]).then(([v, p]) => {
      setVisits(v.data ?? []);
      setPatients(p.data ?? []);
      setLoading(false);
    });
  }, [bounds.start.getTime(), bounds.end.getTime()]);
  const totalRevenue = visits.reduce((s, v) => s + Number(v.tariff || 0), 0);
  const uniquePatients = new Set(visits.map((v) => v.patient_id)).size;
  const avgPerPatient = uniquePatients ? totalRevenue / uniquePatients : 0;
  const byDay = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const v of visits) {
      const k = v.visited_at.slice(0, 10);
      const e = map.get(k) ?? {
        date: k,
        revenue: 0,
        visits: 0
      };
      e.revenue += Number(v.tariff || 0);
      e.visits += 1;
      map.set(k, e);
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [visits]);
  const diagnosisCount = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const v of visits) {
      const d = (v.final_diagnosis || "").trim();
      if (!d) continue;
      m.set(d, (m.get(d) ?? 0) + 1);
    }
    return Array.from(m.entries()).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [visits]);
  const gender = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const p of patients) {
      const k = p.gender || "Unknown";
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return Array.from(m.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [patients]);
  const ageBuckets = reactExports.useMemo(() => {
    const buckets = [{
      name: "0-17",
      value: 0
    }, {
      name: "18-29",
      value: 0
    }, {
      name: "30-44",
      value: 0
    }, {
      name: "45-59",
      value: 0
    }, {
      name: "60+",
      value: 0
    }];
    for (const p of patients) {
      const a = ageFromDob(p.dob);
      if (a == null) continue;
      const i = a < 18 ? 0 : a < 30 ? 1 : a < 45 ? 2 : a < 60 ? 3 : 4;
      buckets[i].value += 1;
    }
    return buckets;
  }, [patients]);
  const newPatients = patients.filter((p) => new Date(p.created_at) >= bounds.start && new Date(p.created_at) <= bounds.end).length;
  const returning = uniquePatients - patients.filter((p) => new Date(p.created_at) >= bounds.start && new Date(p.created_at) <= bounds.end && visits.some((v) => v.patient_id === p.id)).length;
  const COLORS = ["hsl(220 80% 60%)", "hsl(180 60% 50%)", "hsl(160 60% 50%)", "hsl(40 80% 60%)", "hsl(320 60% 60%)"];
  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Clinic Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Period: ${formatDate(bounds.start)} – ${formatDate(bounds.end)}`, 14, 26);
    doc.text(`Revenue: ${formatIDR(totalRevenue)}  ·  Visits: ${visits.length}  ·  Patients: ${uniquePatients}`, 14, 32);
    autoTable(doc, {
      startY: 40,
      head: [["Date", "Visits", "Revenue"]],
      body: byDay.map((d) => [d.date, String(d.visits), formatIDR(d.revenue)])
    });
    doc.save("clinic-report.pdf");
  };
  const exportXlsx = () => {
    const wb = utils.book_new();
    utils.book_append_sheet(wb, utils.json_to_sheet(byDay.map((d) => ({
      Date: d.date,
      Visits: d.visits,
      Revenue: d.revenue
    }))), "Daily");
    utils.book_append_sheet(wb, utils.json_to_sheet(diagnosisCount), "Diagnoses");
    writeFileSync(wb, "clinic-report.xlsx");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          formatDate(bounds.start),
          " – ",
          formatDate(bounds.end)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.print(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-1" }),
          " Print"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: exportXlsx, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-4 mr-1" }),
          " Excel"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: exportPdf, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-1" }),
          " PDF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["daily", "weekly", "monthly", "custom"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: range === r ? "default" : "outline", onClick: () => setRange(r), className: "capitalize", children: r }, r)) }),
      range === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "From" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: custom.from, onChange: (e) => setCustom({
            ...custom,
            from: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: custom.to, onChange: (e) => setCustom({
            ...custom,
            to: e.target.value
          }) })
        ] })
      ] })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-80 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "financial", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "financial", children: "Financial" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "diagnoses", children: "Top Diagnoses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "patients", children: "Patient Stats" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "visits", children: "Visits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "billing", children: "Billing" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "financial", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total Revenue", value: formatIDR(totalRevenue) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total Transactions", value: String(visits.length) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Avg Revenue / Patient", value: formatIDR(avgPerPatient) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium mb-3", children: "Revenue trend" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: byDay, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", fontSize: 11 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 11 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => formatIDR(v) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "hsl(220 80% 55%)", strokeWidth: 2 })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Visits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Revenue" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
            byDay.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: d.date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: d.visits }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: formatIDR(d.revenue) })
            ] }, d.date)),
            byDay.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 3, className: "text-center text-muted-foreground py-6", children: "No data." }) })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "diagnoses", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium mb-3", children: "Top diagnoses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: diagnosisCount, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.3 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", fontSize: 10 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 11 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", fill: "hsl(220 80% 55%)" })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium mb-3", children: "Distribution" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: diagnosisCount, dataKey: "count", nameKey: "name", outerRadius: 90, label: true, children: diagnosisCount.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {})
            ] }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Diagnosis" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Count" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
            diagnosisCount.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: d.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: d.count })
            ] }, d.name)),
            diagnosisCount.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 3, className: "text-center text-muted-foreground py-6", children: "No diagnoses recorded." }) })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "patients", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total Patients", value: String(patients.length) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "New (period)", value: String(newPatients) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Returning", value: String(Math.max(0, returning)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Active (period)", value: String(uniquePatients) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium mb-3", children: "Gender" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: gender, dataKey: "value", nameKey: "name", innerRadius: 50, outerRadius: 90, label: true, children: gender.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {})
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium mb-3", children: "Age distribution" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: ageBuckets, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.3 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", fontSize: 11 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 11 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", fill: "hsl(180 60% 45%)" })
            ] }) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "visits", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total Examinations", value: String(visits.length) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Avg Visits / Patient", value: (uniquePatients ? visits.length / uniquePatients : 0).toFixed(1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Busiest Day", value: byDay.length ? byDay.reduce((a, b) => a.visits > b.visits ? a : b).date : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium mb-3", children: "Visits per day" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: byDay, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", fontSize: 11 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 11 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "visits", stroke: "hsl(160 60% 45%)", strokeWidth: 2 })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "billing", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total Tariff Collected", value: formatIDR(totalRevenue) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Transactions", value: String(visits.length) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Visits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Revenue" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
            byDay.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: d.date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: d.visits }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: formatIDR(d.revenue) })
            ] }, d.date)),
            byDay.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 3, className: "text-center text-muted-foreground py-6", children: "No billing in period." }) })
          ] })
        ] }) }) })
      ] })
    ] })
  ] });
}
function KpiCard({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold mt-1", children: value })
  ] });
}
export {
  ReportsPage as component
};
