import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowUpDown, Eye, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/patients/")({
  component: PatientsListPage,
});

type Row = {
  id: string; mrn: string; full_name: string; gender: string | null;
  phone: string | null; last_visit: string | null;
};

const PAGE_SIZE = 10;
type SortKey = "full_name" | "mrn" | "last_visit";

function PatientsListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "full_name", dir: "asc" });
  const [confirm, setConfirm] = useState<Row | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const load = async () => {
    setLoading(true);
    const { data: patients, error } = await supabase
      .from("patients")
      .select("id, mrn, full_name, gender, phone");
    if (error) { toast.error(error.message); setLoading(false); return; }
    const ids = (patients ?? []).map((p) => p.id);
    let lastByPatient = new Map<string, string>();
    if (ids.length) {
      const { data: visits } = await supabase
        .from("visits")
        .select("patient_id, visited_at")
        .in("patient_id", ids)
        .order("visited_at", { ascending: false });
      for (const v of visits ?? []) {
        if (!lastByPatient.has(v.patient_id)) lastByPatient.set(v.patient_id, v.visited_at);
      }
    }
    setRows((patients ?? []).map((p) => ({ ...p, last_visit: lastByPatient.get(p.id) ?? null })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    const arr = term
      ? rows.filter((r) => r.full_name.toLowerCase().includes(term) || r.mrn.toLowerCase().includes(term) || (r.phone ?? "").toLowerCase().includes(term))
      : rows;
    const sorted = [...arr].sort((a, b) => {
      const va = (a[sort.key] ?? "") as string;
      const vb = (b[sort.key] ?? "") as string;
      const cmp = va.localeCompare(vb);
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [rows, debounced, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  const toggleSort = (k: SortKey) => setSort((s) => ({ key: k, dir: s.key === k && s.dir === "asc" ? "desc" : "asc" }));

  const remove = async () => {
    if (!confirm) return;
    const { error } = await supabase.from("patients").delete().eq("id", confirm.id);
    if (error) toast.error(error.message);
    else { toast.success("Patient deleted"); setConfirm(null); load(); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Patients</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} record{filtered.length === 1 ? "" : "s"}</p>
        </div>
        <Button onClick={() => navigate({ to: "/patients/new" })}><UserPlus className="size-4 mr-2" /> New Patient</Button>
      </div>

      <Card className="p-4 space-y-4">
        <Input placeholder="Search by name, MRN, or phone…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />

        <div className="rounded-md border overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><button onClick={() => toggleSort("mrn")} className="inline-flex items-center gap-1">MRN <ArrowUpDown className="size-3" /></button></TableHead>
                <TableHead><button onClick={() => toggleSort("full_name")} className="inline-flex items-center gap-1">Name <ArrowUpDown className="size-3" /></button></TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead><button onClick={() => toggleSort("last_visit")} className="inline-flex items-center gap-1">Last Visit <ArrowUpDown className="size-3" /></button></TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No patients found.</TableCell></TableRow>
              ) : (
                pageRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.mrn}</TableCell>
                    <TableCell className="font-medium">{r.full_name}</TableCell>
                    <TableCell>{r.gender?.toLowerCase() === 'male' ? 'Laki-Laki' : r.gender?.toLowerCase() === 'female' ? 'Perempuan' : r.gender || "—"}</TableCell>
                    <TableCell>{r.phone ?? "—"}</TableCell>
                    <TableCell>{formatDate(r.last_visit)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" asChild><Link to="/patients/$id" params={{ id: r.id }}><Eye className="size-4" /></Link></Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirm(r)}><Trash2 className="size-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Page {page} of {totalPages}</div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete patient?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {confirm?.full_name} and all their visit records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
