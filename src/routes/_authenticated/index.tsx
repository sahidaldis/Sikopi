import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserPlus, UserSearch, Users, Activity, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

type PatientLite = { id: string; mrn: string; full_name: string; address: string | null; phone: string | null; dob: string | null };

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<PatientLite[]>([]);
  const [stats, setStats] = useState({ patients: 0, visitsToday: 0 });

  useEffect(() => {
    (async () => {
      const { count: pc } = await supabase.from("patients").select("id", { count: "exact", head: true });
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { count: vc } = await supabase.from("visits").select("id", { count: "exact", head: true }).gte("visited_at", start.toISOString());
      setStats({ patients: pc ?? 0, visitsToday: vc ?? 0 });
    })();
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      const term = q.trim();
      let query = supabase.from("patients").select("id, mrn, full_name, address, phone, dob").order("full_name").limit(20);
      if (term) query = query.or(`mrn.ilike.%${term}%,full_name.ilike.%${term}%,address.ilike.%${term}%`);
      const { data } = await query;
      setResults(data ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [q, open]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-1">Choose an action to begin a patient session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate({ to: "/patients/new" })}
          className="group text-left rounded-2xl border-2 border-transparent bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <div className="size-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
            <UserPlus className="size-6" />
          </div>
          <div className="text-2xl font-semibold">New Patient</div>
          <p className="text-sm opacity-90 mt-2">Register a new patient and record their first examination.</p>
        </button>

        <button
          onClick={() => setOpen(true)}
          className="group text-left rounded-2xl border-2 border-border bg-card p-8 shadow-sm hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 transition-all"
        >
          <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
            <UserSearch className="size-6" />
          </div>
          <div className="text-2xl font-semibold">Existing Patient</div>
          <p className="text-sm text-muted-foreground mt-2">Search by medical record number, name, or address.</p>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Users className="size-5" /></div>
          <div>
            <div className="text-xs text-muted-foreground">Total Patients</div>
            <div className="text-2xl font-semibold">{stats.patients}</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="size-10 rounded-lg bg-chart-2/15 text-chart-2 flex items-center justify-center"><Activity className="size-5" /></div>
          <div>
            <div className="text-xs text-muted-foreground">Visits Today</div>
            <div className="text-2xl font-semibold">{stats.visitsToday}</div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Quick links</div>
          <div className="mt-2 flex gap-3 text-sm">
            <Link to="/patients" className="text-primary hover:underline">All patients</Link>
            <Link to="/reports" className="text-primary hover:underline">Reports</Link>
          </div>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Find existing patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Input
                autoFocus
                placeholder="Search by MRN, name, or address…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {q && (
                <button onClick={() => setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="max-h-[420px] overflow-auto rounded-md border divide-y">
              {results.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No patients found.</div>
              ) : (
                results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: "/patients/$id", params: { id: p.id } });
                    }}
                    className="w-full text-left p-3 hover:bg-accent flex justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium">{p.full_name}</div>
                      <div className="text-xs text-muted-foreground">{p.mrn} · {p.phone ?? "—"} · DOB {formatDate(p.dob)}</div>
                      <div className="text-xs text-muted-foreground truncate">{p.address}</div>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
