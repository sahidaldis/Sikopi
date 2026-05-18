import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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
}: {
  state: VisitFieldsState;
  set: (patch: Partial<VisitFieldsState>) => void;
  startSection?: number;
  allergySection?: React.ReactNode;
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
          <Label>Anamnesis / Medical History</Label>
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
                <label className="flex items-center gap-2.5 min-w-[160px] cursor-pointer text-sm">
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
                <label className="flex items-center gap-2.5 min-w-[160px] cursor-pointer text-sm">
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
                <label className="flex items-center gap-2.5 min-w-[160px] cursor-pointer text-sm">
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
                <label className="flex items-center gap-2.5 min-w-[160px] cursor-pointer text-sm">
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
            <Label className="text-sm font-semibold mb-2 block text-primary">Nursing Diagnosis</Label>
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
          <div className="md:col-span-2">
            <Label>Planning (P)</Label>
            <Textarea rows={3} value={state.planning} onChange={(e) => set({ planning: e.target.value })} />
          </div>
        </div>
      </Section>

      <Section num={startSection + 4} title="Medication and Actions">
        <div>
          <Label>Edukasi</Label>
          <Textarea rows={3} value={state.instructions} onChange={(e) => set({ instructions: e.target.value })} />
        </div>
        <div>
          <Label>Medikasi</Label>
          <Textarea rows={2} value={state.medication} onChange={(e) => set({ medication: e.target.value })} />
        </div>
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
          <Label>Follow-up Instructions</Label>
          <Textarea rows={2} value={state.followup} onChange={(e) => set({ followup: e.target.value })} />
        </div>
      </Section>

      <Section num={startSection + 6} title="Billing">
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
      tariff,
    })
    .select("id")
    .single();
  if (error) throw error;

  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("cppt_records").insert({
      visit_id: visit.id,
      subjective: v.subjective || null,
      objective: v.objective || null,
      assessment: v.assessment || null,
      planning: v.planning || null,
    }),
    supabase.from("billing").insert({ visit_id: visit.id, amount: tariff }),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  return visit.id;
}
