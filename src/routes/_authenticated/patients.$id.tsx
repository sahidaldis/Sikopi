import { createFileRoute, Link, useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Pencil, FileText } from "lucide-react";
import { toast } from "sonner";
import { SickLeaveDialog } from "@/components/clinic/SickLeaveDialog";
import { ReferralLetterDialog } from "@/components/clinic/ReferralLetterDialog";
import { ageFromDob, formatDate, formatDateTime, formatIDR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/patients/$id")({
  component: PatientDetailPage,
});

type Patient = {
  id: string; mrn: string; full_name: string; national_id: string | null;
  dob: string | null; gender: string | null; address: string | null;
  phone: string | null; allergy_flag: boolean; allergy_details: string | null;
};
type Visit = {
  id: string; visited_at: string; main_complaint: string | null; anamnesis: string | null;
  physical_exam: string | null; medication: string | null; procedures: string | null;
  instructions: string | null; final_diagnosis: string | null; discharge_condition: string | null;
  followup: string | null; tariff: number;
  cppt_records: { subjective: string | null; objective: string | null; assessment: string | null; planning: string | null } | { subjective: string | null; objective: string | null; assessment: string | null; planning: string | null }[] | null;
};

function PatientDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname.endsWith("/visits/new");

  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [sickLeaveOpen, setSickLeaveOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState("");
  const [activeAnamnesis, setActiveAnamnesis] = useState("");
  const [activeMedication, setActiveMedication] = useState("");
  const [activePhysicalExam, setActivePhysicalExam] = useState("");

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: v }] = await Promise.all([
      supabase.from("patients").select("*").eq("id", id).single(),
      supabase.from("visits").select("*, cppt_records(subjective, objective, assessment, planning)").eq("patient_id", id).order("visited_at", { ascending: false }),
    ]);
    setPatient(p as Patient | null);
    setVisits((v ?? []) as unknown as Visit[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  if (isChildRoute) return <Outlet />;

  if (loading) return <div className="max-w-6xl mx-auto"><Skeleton className="h-40 w-full" /></div>;
  if (!patient) return <div className="max-w-6xl mx-auto"><p>Patient not found.</p><Link to="/patients" className="text-primary">Back to list</Link></div>;

  const age = ageFromDob(patient.dob);
  const totalBilled = visits.reduce((s, v) => s + Number(v.tariff || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/patients" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft className="size-4" /> Back to patients
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-muted-foreground">{patient.mrn}</div>
            <h1 className="text-2xl font-semibold mt-1">{patient.full_name}</h1>
            <div className="text-sm text-muted-foreground mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              <div>Gender: <span className="text-foreground">{patient.gender ?? "—"}</span></div>
              <div>DOB: <span className="text-foreground">{formatDate(patient.dob)}{age !== null ? ` (${age} yrs)` : ""}</span></div>
              <div>Phone: <span className="text-foreground">{patient.phone ?? "—"}</span></div>
              <div>National ID: <span className="text-foreground">{patient.national_id ?? "—"}</span></div>
              <div className="sm:col-span-2">Address: <span className="text-foreground">{patient.address ?? "—"}</span></div>
              {patient.allergy_flag && (
                <div className="sm:col-span-2 mt-2 rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm">
                  Allergy: {patient.allergy_details || "Not specified"}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="size-4 mr-2" /> Edit</Button>
            <Button
              variant="outline"
              className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              onClick={() => {
                setActiveDiagnosis(visits[0]?.final_diagnosis || "");
                setActiveAnamnesis(visits[0]?.anamnesis || "");
                setSickLeaveOpen(true);
              }}
            >
              <FileText className="size-4 mr-2" /> Surat Sakit
            </Button>
            <Button
              variant="outline"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => {
                setActiveDiagnosis(visits[0]?.final_diagnosis || "");
                setActiveAnamnesis(visits[0]?.anamnesis || "");
                setActiveMedication(visits[0]?.medication || "");
                setActivePhysicalExam(visits[0]?.physical_exam || "");
                setReferralOpen(true);
              }}
            >
              <FileText className="size-4 mr-2" /> Surat Rujukan
            </Button>
            <Button asChild>
              <Link to="/patients/$id/visits/new" params={{ id }}>
                <Plus className="size-4 mr-2" /> Add Visit
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="cppt">CPPT</TabsTrigger>
          <TabsTrigger value="meds">Medications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-3 mt-4">
          {visits.length === 0 ? <EmptyState text="No visits yet." /> : visits.map((v) => (
            <Card key={v.id} className="p-5">
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <div className="font-medium">{formatDateTime(v.visited_at)}</div>
                <div className="text-sm text-muted-foreground">{formatIDR(v.tariff)}</div>
              </div>
              <div className="text-sm space-y-1">
                {v.main_complaint && <div><b>Complaint:</b> {v.main_complaint}</div>}
                {v.final_diagnosis && <div><b>Diagnosis:</b> {v.final_diagnosis}</div>}
                {v.physical_exam && <div><b>Exam:</b> <span className="text-muted-foreground">{v.physical_exam}</span></div>}
                {v.medication && <div><b>Medication:</b> {v.medication}</div>}
                {v.followup && <div><b>Follow-up:</b> {v.followup}</div>}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cppt" className="space-y-3 mt-4">
          {visits.length === 0 ? <EmptyState text="No CPPT records." /> : visits.map((v) => {
            const c = Array.isArray(v.cppt_records) ? v.cppt_records[0] : v.cppt_records;
            return (
              <Card key={v.id} className="p-5">
                <div className="font-medium mb-2">{formatDateTime(v.visited_at)}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><b>S:</b> {c?.subjective || "—"}</div>
                  <div><b>O:</b> {c?.objective || "—"}</div>
                  <div><b>A:</b> {c?.assessment || "—"}</div>
                  <div><b>P:</b> {c?.planning || "—"}</div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="meds" className="space-y-3 mt-4">
          {visits.filter((v) => v.medication || v.procedures).length === 0 ? <EmptyState text="No medication history." /> :
            visits.filter((v) => v.medication || v.procedures).map((v) => (
              <Card key={v.id} className="p-5 text-sm space-y-1">
                <div className="font-medium">{formatDateTime(v.visited_at)}</div>
                {v.medication && <div><b>Medication:</b> {v.medication}</div>}
                {v.procedures && <div><b>Procedures:</b> {v.procedures}</div>}
                {v.instructions && <div><b>Instructions:</b> {v.instructions}</div>}
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="billing" className="space-y-3 mt-4">
          <Card className="p-5">
            <div className="flex justify-between mb-3">
              <div className="font-medium">Total billed</div>
              <div className="font-semibold">{formatIDR(totalBilled)}</div>
            </div>
            <div className="divide-y">
              {visits.map((v) => (
                <div key={v.id} className="flex justify-between py-2 text-sm">
                  <div>{formatDateTime(v.visited_at)}</div>
                  <div>{formatIDR(v.tariff)}</div>
                </div>
              ))}
              {visits.length === 0 && <div className="text-sm text-muted-foreground py-2">No billing yet.</div>}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <EditPatientDialog open={editing} onClose={() => setEditing(false)} patient={patient} onSaved={() => { setEditing(false); load(); }} />
      <SickLeaveDialog open={sickLeaveOpen} onClose={() => setSickLeaveOpen(false)} patient={patient} latestDiagnosis={activeDiagnosis} latestAnamnesis={activeAnamnesis} />
      <ReferralLetterDialog
        open={referralOpen}
        onClose={() => setReferralOpen(false)}
        patient={patient}
        latestDiagnosis={activeDiagnosis}
        latestAnamnesis={activeAnamnesis}
        latestMedication={activeMedication}
        latestPhysicalExam={activePhysicalExam}
      />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <Card className="p-10 text-center text-sm text-muted-foreground">{text}</Card>;
}

function EditPatientDialog({ open, onClose, patient, onSaved }: { open: boolean; onClose: () => void; patient: Patient; onSaved: () => void }) {
  const [form, setForm] = useState(patient);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setForm(patient); }, [patient]);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("patients").update({
      full_name: form.full_name,
      national_id: form.national_id || null,
      dob: form.dob || null,
      gender: form.gender || null,
      address: form.address || null,
      phone: form.phone || null,
      allergy_flag: form.allergy_flag,
      allergy_details: form.allergy_flag ? form.allergy_details : null,
    }).eq("id", patient.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Patient updated"); onSaved(); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Edit patient</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div><Label>National ID</Label><Input value={form.national_id ?? ""} onChange={(e) => setForm({ ...form, national_id: e.target.value })} /></div>
          <div><Label>Date of Birth</Label><Input type="date" value={form.dob ?? ""} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></div>
          <div><Label>Gender</Label><Input value={form.gender ?? ""} onChange={(e) => setForm({ ...form, gender: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Address</Label><Textarea rows={2} value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="md:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="allergy" checked={form.allergy_flag} onChange={(e) => setForm({ ...form, allergy_flag: e.target.checked })} />
            <Label htmlFor="allergy">Has allergies</Label>
          </div>
          {form.allergy_flag && (
            <div className="md:col-span-2"><Label>Allergy details</Label><Textarea rows={2} value={form.allergy_details ?? ""} onChange={(e) => setForm({ ...form, allergy_details: e.target.value })} /></div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
