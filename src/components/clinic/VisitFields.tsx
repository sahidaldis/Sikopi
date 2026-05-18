import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
          <div>
            <Label>Assessment (A)</Label>
            <Textarea rows={3} value={state.assessment} onChange={(e) => set({ assessment: e.target.value })} />
          </div>
          <div>
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
          <Label>Final Diagnosis</Label>
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
