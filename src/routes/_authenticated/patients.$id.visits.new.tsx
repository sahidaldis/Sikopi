import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VisitFields, emptyVisit, persistVisit, type VisitFieldsState } from "@/components/clinic/VisitFields";

export const Route = createFileRoute("/_authenticated/patients/$id/visits/new")({
  component: AddVisitPage,
});

function AddVisitPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState<VisitFieldsState>(emptyVisit());
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    supabase.from("patients").select("full_name, mrn").eq("id", id).single().then(({ data }) => {
      if (data) setPatientName(`${data.full_name} · ${data.mrn}`);
    });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await persistVisit({ patient_id: id, state: v });
      toast.success("Visit saved");
      navigate({ to: "/patients/$id", params: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-5xl mx-auto space-y-6">
      <div>
        <Link to="/patients/$id" params={{ id }} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <h1 className="text-2xl font-semibold mt-1">Add Visit</h1>
        <p className="text-sm text-muted-foreground">{patientName}</p>
      </div>

      <Card className="p-4 text-sm text-muted-foreground">Recording a new examination for an existing patient.</Card>

      <VisitFields state={v} set={(patch) => setV({ ...v, ...patch })} startSection={1} />

      <div className="flex justify-end gap-3 sticky bottom-0 bg-background/80 backdrop-blur py-4 -mx-6 px-6 border-t">
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/patients/$id", params: { id } })} disabled={busy}>Cancel</Button>
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save Visit"}</Button>
      </div>
    </form>
  );
}
