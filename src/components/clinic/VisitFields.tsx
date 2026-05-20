import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MedicationPicker } from "@/components/clinic/MedicationPicker";

export type VisitFieldsState = {
  visited_at: string;
  main_complaint: string;
  anamnesis: string;
  physical_exam: string;
  subjective: string;
  objective: string;
  assessment: string;
  planning: string;
  medication: string;
  procedures: string;
  instructions: string;
  final_diagnosis: string;
  discharge_condition: string;
  followup: string;
  tariff: string;
  nursing_implementation?: string;
  evaluation?: string;
  evaluation_date?: string;
};

const getLocalDatetimeString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

export const emptyVisit = (): VisitFieldsState => ({
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
  tariff: "0",
  nursing_implementation: "",
  evaluation: "",
  evaluation_date: "",
});

function Section({ title, num, children }: { title: string; num: number; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">{num}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function VisitFields({
  state,
  set,
  startSection = 2,
  allergySection,
  showEvaluation = false,
}: {
  state: VisitFieldsState;
  set: (patch: Partial<VisitFieldsState>) => void;
  startSection?: number;
  allergySection?: React.ReactNode;
  showEvaluation?: boolean;
}) {
  const parsedDiagnoses = state.assessment
    ? state.assessment.split(", ").map((d) => d.trim()).filter(Boolean)
    : [];

  const standardDiagnoses = [
    "Nyeri akut",
    "Nyeri kronis",
    "Gangguan mobilitas fisik",
    "Risiko infeksi",
    "Kerusakan integritas kulit",
    "Defisit perawatan diri",
    "Risiko jatuh",
    "Intoleransi aktivitas",
    "Ansietas",
    "Risiko perfusi perifer tidak efektif"
  ];

  const customDiagnosis = parsedDiagnoses.find((d) => !standardDiagnoses.includes(d)) || "";

  const handleDiagnosisToggle = (diag: string, checked: boolean) => {
    let next = [...parsedDiagnoses];
    if (checked) {
      if (!next.includes(diag)) {
        next.push(diag);
      }
    } else {
      next = next.filter((d) => d !== diag);
    }
    
    const sorted: string[] = [];
    standardDiagnoses.forEach((d) => {
      if (next.includes(d)) sorted.push(d);
    });
    const customInNext = next.find((d) => !standardDiagnoses.includes(d));
    if (customInNext) {
      sorted.push(customInNext);
    }

    set({ assessment: sorted.join(", ") });
  };

  const handleCustomDiagnosisChange = (val: string) => {
    let next = parsedDiagnoses.filter((d) => standardDiagnoses.includes(d));
    if (val.trim()) {
      next.push(val.trim());
    }
    set({ assessment: next.join(", ") });
  };

  // Parsing state.planning for Nursing Interventions
  const parsedInterventions = state.planning
    ? state.planning.split(", ").map((i) => i.trim()).filter(Boolean)
    : [];

  const standardInterventions = [
    "Monitor tanda vital",
    "Kaji skala nyeri",
    "Manajemen Nyeri",
    "Edukasi mobilisasi",
    "Latihan ROM",
    "Perawatan luka",
    "Perawatan Cast / Splint",
    "Kompres dingin/hangat",
    "Posisi nyaman",
    "Edukasi penggunaan alat bantu",
    "Kolaborasi terapi obat",
    "Pasang Bandage",
    "Pasang Cast / Splint",
    "Pencegahan jatuh",
    "Edukasi keluarga"
  ];

  const customIntervention = parsedInterventions.find((i) => !standardInterventions.includes(i)) || "";

  const handleInterventionToggle = (interv: string, checked: boolean) => {
    let next = [...parsedInterventions];
    if (checked) {
      if (!next.includes(interv)) {
        next.push(interv);
      }
    } else {
      next = next.filter((i) => i !== interv);
    }
    
    const sorted: string[] = [];
    standardInterventions.forEach((i) => {
      if (next.includes(i)) sorted.push(i);
    });
    const customInNext = next.find((i) => !standardInterventions.includes(i));
    if (customInNext) {
      sorted.push(customInNext);
    }

    set({ planning: sorted.join(", ") });
  };

  const handleCustomInterventionChange = (val: string) => {
    let next = parsedInterventions.filter((i) => standardInterventions.includes(i));
    if (val.trim()) {
      next.push(val.trim());
    }
    set({ planning: next.join(", ") });
  };

  // Parsing state.nursing_implementation for Nursing Implementation
  const rawImplementation = state.nursing_implementation || "";

  type ImplOption = { id: string; label: string; placeholder?: string; subOptions?: string[] };
  const implOptions: ImplOption[] = [
    { id: "vital", label: "Monitoring tanda vital", placeholder: "..." },
    { id: "nyeri", label: "Mengkaji skala nyeri", placeholder: "Isi angka manual" },
    { id: "mobilisasi", label: "Melakukan Edukasi mobilisasi", placeholder: "Contoh: Ankle Pump, Full Up setiap hari sekali" },
    { id: "rom", label: "Mengajarkan Latihan ROM", placeholder: "Isi manual..." },
    { id: "luka", label: "Melakukan Perawatan luka", placeholder: "Isi manual..." },
    { id: "cast_splint_rawat", label: "Melakukan Perawatan Cast / Splint", placeholder: "Isi manual..." },
    { id: "manajemen_nyeri_nf_1", label: "Manajemen Nyeri NF (Manual)", subOptions: ["Kompres dingin/hangat", "Distraksi", "Nafas dalam"] },
    { id: "manajemen_nyeri_nf_2", label: "Manajemen Nyeri NF (Alat)", subOptions: ["TENS", "CRYO", "AKP"] },
    { id: "manajemen_nyeri_f", label: "Manajemen Nyeri F (Analgesik)", placeholder: "Nama analgesik..." },
    { id: "posisi", label: "Membantu dan memposisi pasien dengan nyaman", placeholder: "Posisi..." },
    { id: "alat", label: "Memberikan Edukasi penggunaan alat bantu", subOptions: ["Kruck", "Walker", "Cane", "Kursi Roda"] },
    { id: "obat", label: "Kolaborasi pemberian terapi obat" },
    { id: "bandage", label: "Pemasangan Bandage", placeholder: "Lokasi..." },
    { id: "cast_splint_pasang", label: "Pemasangan Cast / Splint", placeholder: "Lokasi dan Bentuk Cast/Splint" },
    { id: "jatuh", label: "Edukasi Pencegahan jatuh" },
    { id: "keluarga", label: "Edukasi keluarga tentang", placeholder: "Isi manual..." },
    { id: "lainnya", label: "Intervensi lainnya", placeholder: "Isi manual..." },
  ];

  const parsedImplementation = (() => {
    const res: Record<string, { checked: boolean; text: string; vitals?: {t: string, n: string, r: string, s: string}; subSelections?: string[] }> = {};
    implOptions.forEach((opt) => {
      res[opt.id] = { checked: false, text: "", vitals: opt.id === "vital" ? {t: "", n: "", r: "", s: ""} : undefined, subSelections: opt.subOptions ? [] : undefined };
    });
    
    if (!rawImplementation) return res;
    
    const parts = rawImplementation.split(" | ");
    parts.forEach((part) => {
      for (const opt of implOptions) {
        if (part.startsWith(opt.label)) {
          res[opt.id].checked = true;
          if (opt.placeholder !== undefined || opt.subOptions !== undefined) {
            let text = part.substring(opt.label.length).trim();
            if (text.startsWith(":")) text = text.substring(1).trim();
            res[opt.id].text = text;
            
            if (opt.subOptions) {
              res[opt.id].subSelections = text.split(",").map(s => s.trim()).filter(Boolean);
            }
            
            if (opt.id === "vital") {
              const tMatch = text.match(/T:\s*(.*?)(?=\s*mmHg)/);
              const nMatch = text.match(/N:\s*(.*?)(?=\s*x\/Menit)/);
              const rMatch = text.match(/R:\s*(.*?)(?=\s*x\/Menit)/);
              const sMatch = text.match(/S:\s*(.*?)(?=\s*oC)/);
              res[opt.id].vitals = {
                t: tMatch ? tMatch[1].trim() : "",
                n: nMatch ? nMatch[1].trim() : "",
                r: rMatch ? rMatch[1].trim() : "",
                s: sMatch ? sMatch[1].trim() : "",
              };
            }
          }
          break;
        }
      }
    });
    return res;
  })();

  const updateImplementation = (id: string, checked: boolean, text: string, currentItemsObj?: any) => {
    const current = currentItemsObj || { ...parsedImplementation };
    current[id] = { ...current[id], checked, text };
    
    const parts: string[] = [];
    implOptions.forEach((opt) => {
      if (current[opt.id].checked) {
        if (opt.placeholder !== undefined || opt.subOptions !== undefined) {
          parts.push(`${opt.label} : ${current[opt.id].text}`);
        } else {
          parts.push(opt.label);
        }
      }
    });
    set({ nursing_implementation: parts.join(" | ") });
  };

  const toggleSubOption = (id: string, subOpt: string, isChecked: boolean, parentChecked: boolean) => {
    const currentObj = { ...parsedImplementation };
    let currentSubs = [...(currentObj[id].subSelections || [])];
    if (isChecked) {
      if (!currentSubs.includes(subOpt)) currentSubs.push(subOpt);
    } else {
      currentSubs = currentSubs.filter(s => s !== subOpt);
    }
    const newText = currentSubs.join(", ");
    currentObj[id].subSelections = currentSubs;
    
    let newParentChecked = parentChecked;
    if (isChecked && !parentChecked) {
      newParentChecked = true;
    }
    
    updateImplementation(id, newParentChecked, newText, currentObj);
  };

  const updateVital = (field: 't'|'n'|'r'|'s', val: string, isChecked: boolean) => {
    const v = { ...(parsedImplementation["vital"].vitals || {t: "", n: "", r: "", s: ""}) };
    v[field] = val;
    
    let textParts = [];
    if (v.t) textParts.push(`T: ${v.t} mmHg`);
    if (v.n) textParts.push(`N: ${v.n} x/Menit`);
    if (v.r) textParts.push(`R: ${v.r} x/Menit`);
    if (v.s) textParts.push(`S: ${v.s} oC`);
    
    const text = textParts.join("  ");
    
    const current = { ...parsedImplementation };
    current["vital"] = { checked: isChecked, text, vitals: v };
    updateImplementation("vital", isChecked, text, current);
  };

  // Parsing state.evaluation
  const rawEvaluation = state.evaluation || "";
  type EvalOption = { id: string; label: string; placeholder?: string };
  const evalOptions: EvalOption[] = [
    { id: "nyeri", label: "Nyeri menurun", placeholder: "Skala Nyeri..." },
    { id: "mobilitas", label: "Mobilitas membaik" },
    { id: "luka", label: "Luka membaik" },
    { id: "infeksi", label: "Tidak ada tanda infeksi" },
    { id: "edukasi", label: "Pasien memahami edukasi" },
    { id: "stabil", label: "Kondisi stabil" },
    { id: "keluhan", label: "Keluhan masih ada" }
  ];
  
  const parsedEvaluation = (() => {
    const res: Record<string, { checked: boolean; text: string }> = {};
    evalOptions.forEach(opt => res[opt.id] = { checked: false, text: "" });
    let note = "";
    
    if (!rawEvaluation) return { items: res, note };
    
    const parts = rawEvaluation.split(" | ");
    parts.forEach(part => {
      if (part.startsWith("Catatan tambahan:")) {
        note = part.substring("Catatan tambahan:".length).trim();
      } else {
        for (const opt of evalOptions) {
          if (part.startsWith(opt.label)) {
            res[opt.id].checked = true;
            if (opt.placeholder !== undefined) {
              let text = part.substring(opt.label.length).trim();
              if (text.startsWith(":")) text = text.substring(1).trim();
              res[opt.id].text = text;
            }
            break;
          }
        }
      }
    });
    return { items: res, note };
  })();

  const updateEvaluation = (id: string, checked: boolean, text: string) => {
    const currentItems = { ...parsedEvaluation.items };
    currentItems[id] = { checked, text };
    
    const parts: string[] = [];
    evalOptions.forEach(o => {
      if (currentItems[o.id].checked) {
        if (o.placeholder !== undefined) {
          parts.push(`${o.label} : ${currentItems[o.id].text}`);
        } else {
          parts.push(o.label);
        }
      }
    });
    if (parsedEvaluation.note) {
      parts.push(`Catatan tambahan: ${parsedEvaluation.note}`);
    }
    set({ evaluation: parts.join(" | ") });
  };

  const updateEvaluationNote = (val: string) => {
    const parts: string[] = [];
    evalOptions.forEach(o => {
      if (parsedEvaluation.items[o.id].checked) {
        if (o.placeholder !== undefined) {
          parts.push(`${o.label} : ${parsedEvaluation.items[o.id].text}`);
        } else {
          parts.push(o.label);
        }
      }
    });
    if (val.trim()) {
      parts.push(`Catatan tambahan: ${val.trim()}`);
    }
    set({ evaluation: parts.join(" | ") });
  };

  // Parsing state.followup for Follow-up Instructions
  const parsedFollowups = state.followup
    ? state.followup.split(", ").map((f) => f.trim()).filter(Boolean)
    : [];

  const followupOptions = [
    "Kontrol ulang",
    "Home care",
    "Rujuk ke Rumah Sakit",
    "Latihan mandiri di rumah",
    "Edukasi lanjutan"
  ];

  const handleFollowupToggle = (opt: string, checked: boolean) => {
    let next = [...parsedFollowups];
    if (checked) {
      if (!next.includes(opt)) {
        next.push(opt);
      }
    } else {
      next = next.filter((f) => f !== opt);
    }
    
    // Maintain standard order
    const sorted: string[] = [];
    followupOptions.forEach((f) => {
      if (next.includes(f)) sorted.push(f);
    });

    set({ followup: sorted.join(", ") });
  };

  // Parsing state.procedures for Supporting Examinations
  const rawProcedures = state.procedures || "";
  const parsedProcedures = (() => {
    const res = { lab: "", pa: "", rad: "", kultur: "", labChecked: false, paChecked: false, radChecked: false, kulturChecked: false };
    if (!rawProcedures) return res;
    
    const parts = rawProcedures.split(" | ");
    parts.forEach((part) => {
      const idx = part.indexOf(":");
      if (idx === -1) return;
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      
      const cleanVal = val === "—" ? "" : val;
      
      if (key === "Laboratorium") {
        res.lab = cleanVal;
        res.labChecked = true;
      } else if (key === "PA") {
        res.pa = cleanVal;
        res.paChecked = true;
      } else if (key === "Radiologi") {
        res.rad = cleanVal;
        res.radChecked = true;
      } else if (key === "Kultur") {
        res.kultur = cleanVal;
        res.kulturChecked = true;
      }
    });
    return res;
  })();

  const updateProcedureField = (field: "lab" | "pa" | "rad" | "kultur", checked: boolean, val: string) => {
    const current = { ...parsedProcedures };
    if (field === "lab") {
      current.labChecked = checked;
      current.lab = val;
    } else if (field === "pa") {
      current.paChecked = checked;
      current.pa = val;
    } else if (field === "rad") {
      current.radChecked = checked;
      current.rad = val;
    } else if (field === "kultur") {
      current.kulturChecked = checked;
      current.kultur = val;
    }

    const parts: string[] = [];
    if (current.labChecked) parts.push(`Laboratorium: ${current.lab.trim() || "—"}`);
    if (current.paChecked) parts.push(`PA: ${current.pa.trim() || "—"}`);
    if (current.radChecked) parts.push(`Radiologi: ${current.rad.trim() || "—"}`);
    if (current.kulturChecked) parts.push(`Kultur: ${current.kultur.trim() || "—"}`);
    
    set({ procedures: parts.join(" | ") });
  };

  return (
    <>
      <Section num={startSection} title="Clinical Notes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Examination Date & Time</Label>
            <Input type="datetime-local" value={state.visited_at} onChange={(e) => set({ visited_at: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Main Complaint</Label>
          <Textarea rows={2} value={state.main_complaint} onChange={(e) => set({ main_complaint: e.target.value })} />
        </div>
        <div>
          <Label>Riwayat Kesehatan</Label>
          <Textarea rows={3} value={state.anamnesis} onChange={(e) => set({ anamnesis: e.target.value })} />
        </div>
      </Section>

      {allergySection}

      <Section num={startSection + 2} title="Physical Examination">
        <Textarea rows={5} value={state.physical_exam} onChange={(e) => set({ physical_exam: e.target.value })} />
      </Section>

      <Section num={startSection + 3} title="Nursing Care Plan">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Subjective (S)</Label>
            <Textarea rows={3} value={state.subjective} onChange={(e) => set({ subjective: e.target.value })} />
          </div>
          <div>
            <Label>Objective (O)</Label>
            <Textarea rows={3} value={state.objective} onChange={(e) => set({ objective: e.target.value })} />
          </div>

          <div className="md:col-span-2 border-t pt-4 mt-2">
            <Label className="text-sm font-semibold mb-3 block text-primary">Hasil Pemeriksaan Penunjang (Di isi manual)</Label>
            <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
              {/* Laboratorium */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2.5 sm:min-w-[230px] cursor-pointer text-sm">
                  <Checkbox
                    checked={parsedProcedures.labChecked}
                    onCheckedChange={(checked) => updateProcedureField("lab", !!checked, parsedProcedures.lab)}
                  />
                  <span className="font-medium">Laboratorium :</span>
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan hasil laboratorium..."
                  value={parsedProcedures.lab}
                  onChange={(e) => updateProcedureField("lab", parsedProcedures.labChecked, e.target.value)}
                  disabled={!parsedProcedures.labChecked}
                  className="flex-1"
                />
              </div>

              {/* PA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2.5 sm:min-w-[230px] cursor-pointer text-sm">
                  <Checkbox
                    checked={parsedProcedures.paChecked}
                    onCheckedChange={(checked) => updateProcedureField("pa", !!checked, parsedProcedures.pa)}
                  />
                  <span className="font-medium">PA (Patologi Anatomi) :</span>
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan hasil patologi anatomi..."
                  value={parsedProcedures.pa}
                  onChange={(e) => updateProcedureField("pa", parsedProcedures.paChecked, e.target.value)}
                  disabled={!parsedProcedures.paChecked}
                  className="flex-1"
                />
              </div>

              {/* Radiologi */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2.5 sm:min-w-[230px] cursor-pointer text-sm">
                  <Checkbox
                    checked={parsedProcedures.radChecked}
                    onCheckedChange={(checked) => updateProcedureField("rad", !!checked, parsedProcedures.rad)}
                  />
                  <span className="font-medium">Radiologi :</span>
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan hasil radiologi (X-Ray, MRI, dll)..."
                  value={parsedProcedures.rad}
                  onChange={(e) => updateProcedureField("rad", parsedProcedures.radChecked, e.target.value)}
                  disabled={!parsedProcedures.radChecked}
                  className="flex-1"
                />
              </div>

              {/* Kultur */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2.5 sm:min-w-[230px] cursor-pointer text-sm">
                  <Checkbox
                    checked={parsedProcedures.kulturChecked}
                    onCheckedChange={(checked) => updateProcedureField("kultur", !!checked, parsedProcedures.kultur)}
                  />
                  <span className="font-medium">Kultur :</span>
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan hasil kultur..."
                  value={parsedProcedures.kultur}
                  onChange={(e) => updateProcedureField("kultur", parsedProcedures.kulturChecked, e.target.value)}
                  disabled={!parsedProcedures.kulturChecked}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 border-t pt-4 mt-2">
            <Label className="text-sm font-semibold mb-2 block text-primary">DX Keperawatan</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border bg-muted/20">
              {standardDiagnoses.map((diag) => {
                const isChecked = parsedDiagnoses.includes(diag);
                return (
                  <label
                    key={diag}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors text-sm"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => handleDiagnosisToggle(diag, !!checked)}
                      className="mt-0.5"
                    />
                    <span>{diag}</span>
                  </label>
                );
              })}
              <div className="sm:col-span-2 border-t pt-3 mt-1 flex flex-col gap-2">
                <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors text-sm">
                  <Checkbox
                    checked={!!customDiagnosis}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        handleCustomDiagnosisChange("");
                      } else {
                        handleCustomDiagnosisChange("Lainnya");
                      }
                    }}
                  />
                  <span>Lainnya :</span>
                </label>
                <Input
                  type="text"
                  placeholder="Tulis diagnosis keperawatan manual lainnya..."
                  value={customDiagnosis === "Lainnya" ? "" : customDiagnosis}
                  onChange={(e) => handleCustomDiagnosisChange(e.target.value)}
                  className="ml-8 w-full max-w-md"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2 border-t pt-4 mt-2">
            <Label className="text-sm font-semibold mb-2 block text-primary">Nursing Intervention</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border bg-muted/20">
              {standardInterventions.map((interv) => {
                const isChecked = parsedInterventions.includes(interv);
                return (
                  <label
                    key={interv}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors text-sm"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => handleInterventionToggle(interv, !!checked)}
                      className="mt-0.5"
                    />
                    <span>{interv}</span>
                  </label>
                );
              })}
              <div className="sm:col-span-2 border-t pt-3 mt-1 flex flex-col gap-2">
                <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors text-sm">
                  <Checkbox
                    checked={!!customIntervention}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        handleCustomInterventionChange("");
                      } else {
                        handleCustomInterventionChange("Intervensi lainnya");
                      }
                    }}
                  />
                  <span>Intervensi lainnya :</span>
                </label>
                <Input
                  type="text"
                  placeholder="Tulis intervensi manual lainnya..."
                  value={customIntervention === "Intervensi lainnya" ? "" : customIntervention}
                  onChange={(e) => handleCustomInterventionChange(e.target.value)}
                  className="ml-8 w-full max-w-md"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2 border-t pt-4 mt-2">
            <Label className="text-sm font-semibold mb-2 block text-primary">Nursing Implementation</Label>
            <div className="grid grid-cols-1 gap-3 p-4 rounded-xl border bg-muted/20">
              {implOptions.map((opt) => {
                const isChecked = parsedImplementation[opt.id].checked;
                const textVal = parsedImplementation[opt.id].text;
                return (
                  <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-sm sm:min-w-[200px]">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => updateImplementation(opt.id, !!checked, textVal)}
                      />
                      <span className={(opt.placeholder !== undefined || opt.subOptions !== undefined) ? "font-medium" : ""}>
                        {opt.label} {opt.placeholder !== undefined || opt.subOptions !== undefined ? ":" : ""}
                      </span>
                    </label>
                    {opt.placeholder !== undefined && opt.id !== "vital" && (
                      <Input
                        type="text"
                        placeholder={opt.placeholder}
                        value={textVal}
                        onChange={(e) => updateImplementation(opt.id, isChecked, e.target.value)}
                        disabled={!isChecked}
                        className="flex-1"
                      />
                    )}
                    {opt.subOptions && opt.id !== "vital" && (
                      <div className="flex-1 flex flex-wrap gap-3 mt-2 sm:mt-0">
                        {opt.subOptions.map(sub => (
                          <label key={sub} className="flex items-center gap-1.5 cursor-pointer text-sm">
                            <Checkbox
                              checked={parsedImplementation[opt.id].subSelections?.includes(sub)}
                              onCheckedChange={(c) => toggleSubOption(opt.id, sub, !!c, isChecked)}
                              disabled={!isChecked}
                            />
                            <span className="text-muted-foreground">{sub}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {opt.id === "vital" && (
                      <div className="flex-1 flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">T:</span>
                          <Input
                            className="w-16 h-8 text-xs px-2"
                            placeholder="..."
                            value={parsedImplementation["vital"].vitals?.t || ""}
                            onChange={(e) => updateVital("t", e.target.value, isChecked)}
                            disabled={!isChecked}
                          />
                          <span className="text-xs text-muted-foreground">mmHg</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">N:</span>
                          <Input
                            className="w-14 h-8 text-xs px-2"
                            placeholder="..."
                            value={parsedImplementation["vital"].vitals?.n || ""}
                            onChange={(e) => updateVital("n", e.target.value, isChecked)}
                            disabled={!isChecked}
                          />
                          <span className="text-xs text-muted-foreground">x/Menit</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">R:</span>
                          <Input
                            className="w-14 h-8 text-xs px-2"
                            placeholder="..."
                            value={parsedImplementation["vital"].vitals?.r || ""}
                            onChange={(e) => updateVital("r", e.target.value, isChecked)}
                            disabled={!isChecked}
                          />
                          <span className="text-xs text-muted-foreground">x/Menit</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">S:</span>
                          <Input
                            className="w-14 h-8 text-xs px-2"
                            placeholder="..."
                            value={parsedImplementation["vital"].vitals?.s || ""}
                            onChange={(e) => updateVital("s", e.target.value, isChecked)}
                            disabled={!isChecked}
                          />
                          <span className="text-xs text-muted-foreground">oC</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section num={startSection + 4} title="Medication and Actions">
        <div>
          <Label>Edukasi</Label>
          <Textarea rows={3} value={state.instructions} onChange={(e) => set({ instructions: e.target.value })} />
        </div>
        <MedicationPicker
          value={state.medication}
          onChange={(val) => set({ medication: val })}
        />
      </Section>

      <Section num={startSection + 5} title="Medical Resume / Discharge Summary">
        <div>
          <Label>Medical Diagnosis</Label>
          <Input value={state.final_diagnosis} onChange={(e) => set({ final_diagnosis: e.target.value })} />
        </div>
        <div>
          <Label>Patient Condition at Discharge</Label>
          <Input value={state.discharge_condition} onChange={(e) => set({ discharge_condition: e.target.value })} />
        </div>
        <div>
          <Label className="text-sm font-semibold mb-2 block">Follow-up Instructions</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border bg-muted/20">
            {followupOptions.map((opt) => {
              const isChecked = parsedFollowups.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors text-sm"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleFollowupToggle(opt, !!checked)}
                    className="mt-0.5"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      </Section>

      {showEvaluation && (
        <Section num={startSection + 6} title="Evaluation (diisi saat control berikutnya)">
          <div className="space-y-4">
            <div className="max-w-xs">
              <Label className="mb-2 block text-sm font-semibold">Tanggal Evaluasi / Kontrol Berikutnya</Label>
              <Input type="date" value={state.evaluation_date || ""} onChange={(e) => set({ evaluation_date: e.target.value })} />
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Kriteria Evaluasi</Label>
              <div className="grid grid-cols-1 gap-3 p-4 rounded-xl border bg-muted/20">
                {evalOptions.map((opt) => {
                  const isChecked = parsedEvaluation.items[opt.id].checked;
                  const textVal = parsedEvaluation.items[opt.id].text;
                  return (
                    <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="flex items-center gap-2.5 cursor-pointer text-sm sm:min-w-[200px]">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => updateEvaluation(opt.id, !!checked, textVal)}
                        />
                        <span className={opt.placeholder !== undefined ? "font-medium" : ""}>
                          {opt.label} {opt.placeholder !== undefined ? ":" : ""}
                        </span>
                      </label>
                      {opt.placeholder !== undefined && (
                        <Input
                          type="text"
                          placeholder={opt.placeholder}
                          value={textVal}
                          onChange={(e) => updateEvaluation(opt.id, isChecked, e.target.value)}
                          disabled={!isChecked}
                          className="flex-1"
                        />
                      )}
                    </div>
                  );
                })}
                
                <div className="border-t pt-3 mt-1 flex flex-col gap-2">
                  <Label>Catatan tambahan : (Isi manual)</Label>
                  <Textarea
                    rows={2}
                    placeholder="Tulis catatan evaluasi lainnya..."
                    value={parsedEvaluation.note}
                    onChange={(e) => updateEvaluationNote(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section num={startSection + (showEvaluation ? 7 : 6)} title="Billing">
        <div className="max-w-xs">
          <Label>Manual Tariff (IDR)</Label>
          <Input type="number" min="0" step="1000" value={state.tariff} onChange={(e) => set({ tariff: e.target.value })} />
        </div>
      </Section>
    </>
  );
}

export async function persistVisit(opts: {
  patient_id: string;
  state: VisitFieldsState;
}) {
  const { supabase } = await import("@/integrations/supabase/client");
  const v = opts.state;
  const tariff = Number(v.tariff) || 0;
  const { data: visit, error } = await supabase
    .from("visits")
    .insert({
      patient_id: opts.patient_id,
      visited_at: (v.visited_at && !isNaN(new Date(v.visited_at).getTime()) ? new Date(v.visited_at) : new Date()).toISOString(),
      main_complaint: v.main_complaint || null,
      anamnesis: v.anamnesis || null,
      physical_exam: v.physical_exam || null,
      medication: v.medication || null,
      procedures: v.procedures || null,
      instructions: v.instructions || null,
      final_diagnosis: v.final_diagnosis || null,
      discharge_condition: v.discharge_condition || null,
      followup: v.followup || null,
      tariff,
    })
    .select("id")
    .single();
  if (error) throw error;

  const combinedPlanning = [
    v.planning ? `[INTERVENSI]\n${v.planning}` : null,
    v.nursing_implementation ? `[IMPLEMENTASI]\n${v.nursing_implementation.replace(/ \| /g, '\n')}` : null,
    (v.evaluation || v.evaluation_date) ? `[EVALUASI]\n${v.evaluation_date ? `Tanggal: ${v.evaluation_date}\n` : ''}${v.evaluation ? v.evaluation.replace(/ \| /g, '\n') : ''}` : null
  ].filter(Boolean).join("\n\n");

  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("cppt_records").insert({
      visit_id: visit.id,
      subjective: v.subjective || null,
      objective: v.objective || null,
      assessment: v.assessment || null,
      planning: combinedPlanning || null,
    }),
    supabase.from("billing").insert({ visit_id: visit.id, amount: tariff }),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  return visit.id;
}
