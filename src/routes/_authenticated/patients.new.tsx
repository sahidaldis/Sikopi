import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VisitFields, emptyVisit, persistVisit, type VisitFieldsState } from "@/components/clinic/VisitFields";

export const Route = createFileRoute("/_authenticated/patients/new")({
  component: NewPatientPage,
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

function NewPatientPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const [p, setP] = useState({
    full_name: "",
    national_id: "",
    dob: "",
    gender: "",
    address: "",
    phone: "",
    education: "",
    allergy_flag: "no",
    allergy_details: "",
  });
  const [v, setV] = useState<VisitFieldsState>(emptyVisit());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.full_name.trim()) return toast.error("Full name is required");
    setBusy(true);
    try {
      const { data: patient, error } = await supabase
        .from("patients")
        .insert({
          full_name: p.full_name.trim(),
          national_id: p.national_id || null,
          dob: p.dob || null,
          gender: p.gender || null,
          address: p.address || null,
          phone: p.phone || null,
          education: p.education || null,
          allergy_flag: p.allergy_flag === "yes",
          allergy_details: p.allergy_flag === "yes" ? p.allergy_details || null : null,
        })
        .select("id, mrn")
        .single();
      if (error) throw error;

      await persistVisit({ patient_id: patient.id, state: v });

      toast.success(`Patient saved · ${patient.mrn}`);
      navigate({ to: "/patients" });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || (typeof err === "string" ? err : "Save failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="size-4" /> Back
          </Link>
          <h1 className="text-2xl font-semibold mt-1">New Patient Registration</h1>
        </div>
      </div>

      <Section num={1} title="Patient Identity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name *</Label>
            <Input value={p.full_name} onChange={(e) => setP({ ...p, full_name: e.target.value })} required />
          </div>
          <div>
            <Label>National ID (No. KTP)</Label>
            <Input value={p.national_id} onChange={(e) => setP({ ...p, national_id: e.target.value })} />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input type="date" value={p.dob} onChange={(e) => setP({ ...p, dob: e.target.value })} />
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={p.gender} onValueChange={(val) => setP({ ...p, gender: val })}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                <SelectItem value="Perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pendidikan Terakhir</Label>
            <Select value={p.education} onValueChange={(val) => setP({ ...p, education: val })}>
              <SelectTrigger><SelectValue placeholder="Pilih pendidikan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TK">TK</SelectItem>
                <SelectItem value="SD">SD</SelectItem>
                <SelectItem value="SMP">SMP</SelectItem>
                <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
                <SelectItem value="Sarjana">Sarjana</SelectItem>
                <SelectItem value="Lain-lain">Lain-lain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea rows={2} value={p.address} onChange={(e) => setP({ ...p, address: e.target.value })} />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} />
          </div>
        </div>
      </Section>

      <VisitFields
        state={v}
        set={(patch) => setV({ ...v, ...patch })}
        startSection={2}
        allergySection={
          <Section num={3} title="Allergy Information">
            <RadioGroup value={p.allergy_flag} onValueChange={(v) => setP({ ...p, allergy_flag: v })} className="flex gap-6">
              <label className="flex items-center gap-2"><RadioGroupItem value="no" /> No</label>
              <label className="flex items-center gap-2"><RadioGroupItem value="yes" /> Yes</label>
            </RadioGroup>
            {p.allergy_flag === "yes" && (
              <div>
                <Label>Allergy Details</Label>
                <Textarea rows={2} value={p.allergy_details} onChange={(e) => setP({ ...p, allergy_details: e.target.value })} />
              </div>
            )}
          </Section>
        }
      />

      <div className="flex justify-end gap-3 sticky bottom-0 bg-background/80 backdrop-blur py-4 -mx-6 px-6 border-t">
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })} disabled={busy}>Cancel</Button>
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save Patient Record"}</Button>
      </div>
    </form>
  );
}
