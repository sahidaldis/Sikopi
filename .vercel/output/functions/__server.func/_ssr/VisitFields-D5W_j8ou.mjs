import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
const getLocalDatetimeString = () => {
  const now = /* @__PURE__ */ new Date();
  const offset = now.getTimezoneOffset() * 6e4;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};
const emptyVisit = () => ({
  visited_at: getLocalDatetimeString(),
  main_complaint: "",
  anamnesis: "",
  physical_exam: "",
  subjective: "",
  objective: "",
  assessment: "",
  planning: "",
  medication: "",
  procedures: "",
  instructions: "",
  final_diagnosis: "",
  discharge_condition: "",
  followup: "",
  tariff: "0"
});
function Section({ title, num, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border bg-card p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center", children: num }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children })
  ] });
}
function VisitFields({
  state,
  set,
  startSection = 2,
  allergySection
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { num: startSection, title: "Clinical Notes", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Examination Date & Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: state.visited_at, onChange: (e) => set({ visited_at: e.target.value }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Main Complaint" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: state.main_complaint, onChange: (e) => set({ main_complaint: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Anamnesis / Medical History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: state.anamnesis, onChange: (e) => set({ anamnesis: e.target.value }) })
      ] })
    ] }),
    allergySection,
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { num: startSection + 2, title: "Physical Examination", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 5, value: state.physical_exam, onChange: (e) => set({ physical_exam: e.target.value }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { num: startSection + 3, title: "Diagnosis and Management (CPPT — SOAP)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subjective (S)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: state.subjective, onChange: (e) => set({ subjective: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Objective (O)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: state.objective, onChange: (e) => set({ objective: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Assessment (A)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: state.assessment, onChange: (e) => set({ assessment: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Planning (P)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: state.planning, onChange: (e) => set({ planning: e.target.value }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { num: startSection + 4, title: "Medication and Actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Edukasi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: state.instructions, onChange: (e) => set({ instructions: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Medikasi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: state.medication, onChange: (e) => set({ medication: e.target.value }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { num: startSection + 5, title: "Medical Resume / Discharge Summary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Final Diagnosis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: state.final_diagnosis, onChange: (e) => set({ final_diagnosis: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Patient Condition at Discharge" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: state.discharge_condition, onChange: (e) => set({ discharge_condition: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Follow-up Instructions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: state.followup, onChange: (e) => set({ followup: e.target.value }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { num: startSection + 6, title: "Billing", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Manual Tariff (IDR)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", step: "1000", value: state.tariff, onChange: (e) => set({ tariff: e.target.value }) })
    ] }) })
  ] });
}
async function persistVisit(opts) {
  const { supabase } = await import("./router-BrMXvL0y.mjs").then((n) => n.c);
  const v = opts.state;
  const tariff = Number(v.tariff) || 0;
  const { data: visit, error } = await supabase.from("visits").insert({
    patient_id: opts.patient_id,
    visited_at: new Date(v.visited_at).toISOString(),
    main_complaint: v.main_complaint || null,
    anamnesis: v.anamnesis || null,
    physical_exam: v.physical_exam || null,
    medication: v.medication || null,
    procedures: v.procedures || null,
    instructions: v.instructions || null,
    final_diagnosis: v.final_diagnosis || null,
    discharge_condition: v.discharge_condition || null,
    followup: v.followup || null,
    tariff
  }).select("id").single();
  if (error) throw error;
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("cppt_records").insert({
      visit_id: visit.id,
      subjective: v.subjective || null,
      objective: v.objective || null,
      assessment: v.assessment || null,
      planning: v.planning || null
    }),
    supabase.from("billing").insert({ visit_id: visit.id, amount: tariff })
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  return visit.id;
}
export {
  VisitFields as V,
  emptyVisit as e,
  persistVisit as p
};
