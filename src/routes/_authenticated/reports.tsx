import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend } from "recharts";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ageFromDob, formatDate, formatIDR } from "@/lib/format";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

type Range = "daily" | "weekly" | "monthly" | "custom";

function rangeBounds(r: Range, custom: { from: string; to: string }) {
  const now = new Date();
  const end = new Date(now); end.setHours(23, 59, 59, 999);
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  if (r === "weekly") start.setDate(start.getDate() - 6);
  else if (r === "monthly") start.setDate(start.getDate() - 29);
  else if (r === "custom") {
    if (custom.from) start.setTime(new Date(custom.from).setHours(0, 0, 0, 0));
    if (custom.to) end.setTime(new Date(custom.to).setHours(23, 59, 59, 999));
  }
  return { start, end };
}

type VisitRow = { id: string; visited_at: string; tariff: number; patient_id: string; final_diagnosis: string | null };
type PatientRow = { id: string; gender: string | null; dob: string | null; created_at: string };

function ReportsPage() {
  const [range, setRange] = useState<Range>("monthly");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [patients, setPatients] = useState<PatientRow[]>([]);

  const bounds = useMemo(() => rangeBounds(range, custom), [range, custom]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from("visits").select("id, visited_at, tariff, patient_id, final_diagnosis").gte("visited_at", bounds.start.toISOString()).lte("visited_at", bounds.end.toISOString()).order("visited_at"),
      supabase.from("patients").select("id, gender, dob, created_at"),
    ]).then(([v, p]) => {
      setVisits((v.data ?? []) as VisitRow[]);
      setPatients((p.data ?? []) as PatientRow[]);
      setLoading(false);
    });
  }, [bounds.start.getTime(), bounds.end.getTime()]);

  // Aggregations
  const totalRevenue = visits.reduce((s, v) => s + Number(v.tariff || 0), 0);
  const uniquePatients = new Set(visits.map((v) => v.patient_id)).size;
  const avgPerPatient = uniquePatients ? totalRevenue / uniquePatients : 0;

  const byDay = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; visits: number }>();
    for (const v of visits) {
      const k = v.visited_at.slice(0, 10);
      const e = map.get(k) ?? { date: k, revenue: 0, visits: 0 };
      e.revenue += Number(v.tariff || 0);
      e.visits += 1;
      map.set(k, e);
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [visits]);

  const diagnosisCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of visits) {
      const d = (v.final_diagnosis || "").trim();
      if (!d) continue;
      m.set(d, (m.get(d) ?? 0) + 1);
    }
    return Array.from(m.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [visits]);

  const gender = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of patients) {
      const k = p.gender || "Unknown";
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [patients]);

  const ageBuckets = useMemo(() => {
    const buckets = [
      { name: "0-17", value: 0 }, { name: "18-29", value: 0 },
      { name: "30-44", value: 0 }, { name: "45-59", value: 0 }, { name: "60+", value: 0 },
    ];
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

  // Exports
  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("Clinic Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Period: ${formatDate(bounds.start)} – ${formatDate(bounds.end)}`, 14, 26);
    doc.text(`Revenue: ${formatIDR(totalRevenue)}  ·  Visits: ${visits.length}  ·  Patients: ${uniquePatients}`, 14, 32);
    autoTable(doc, {
      startY: 40,
      head: [["Date", "Visits", "Revenue"]],
      body: byDay.map((d) => [d.date, String(d.visits), formatIDR(d.revenue)]),
    });
    doc.save("clinic-report.pdf");
  };

  const exportXlsx = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(byDay.map((d) => ({ Date: d.date, Visits: d.visits, Revenue: d.revenue }))), "Daily");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(diagnosisCount), "Diagnoses");
    XLSX.writeFile(wb, "clinic-report.xlsx");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">{formatDate(bounds.start)} – {formatDate(bounds.end)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="size-4 mr-1" /> Print</Button>
          <Button variant="outline" size="sm" onClick={exportXlsx}><FileSpreadsheet className="size-4 mr-1" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={exportPdf}><Download className="size-4 mr-1" /> PDF</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex gap-1">
            {(["daily", "weekly", "monthly", "custom"] as Range[]).map((r) => (
              <Button key={r} size="sm" variant={range === r ? "default" : "outline"} onClick={() => setRange(r)} className="capitalize">{r}</Button>
            ))}
          </div>
          {range === "custom" && (
            <>
              <div><Label className="text-xs">From</Label><Input type="date" value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} /></div>
              <div><Label className="text-xs">To</Label><Input type="date" value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} /></div>
            </>
          )}
        </div>
      </Card>

      {loading ? <Skeleton className="h-80 w-full" /> : (
        <Tabs defaultValue="financial">
          <TabsList>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="diagnoses">Top Diagnoses</TabsTrigger>
            <TabsTrigger value="patients">Patient Stats</TabsTrigger>
            <TabsTrigger value="visits">Visits</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard label="Total Revenue" value={formatIDR(totalRevenue)} />
              <KpiCard label="Total Transactions" value={String(visits.length)} />
              <KpiCard label="Avg Revenue / Patient" value={formatIDR(avgPerPatient)} />
            </div>
            <Card className="p-5">
              <h3 className="font-medium mb-3">Revenue trend</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={byDay}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip formatter={(v: number) => formatIDR(v)} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(220 80% 55%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Visits</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {byDay.map((d) => (
                      <TableRow key={d.date}><TableCell>{d.date}</TableCell><TableCell>{d.visits}</TableCell><TableCell className="text-right">{formatIDR(d.revenue)}</TableCell></TableRow>
                    ))}
                    {byDay.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No data.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="diagnoses" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-medium mb-3">Top diagnoses</h3>
                <div className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={diagnosisCount}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(220 80% 55%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-medium mb-3">Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={diagnosisCount} dataKey="count" nameKey="name" outerRadius={90} label>
                        {diagnosisCount.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <Card className="p-5">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Diagnosis</TableHead><TableHead className="text-right">Count</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {diagnosisCount.map((d, i) => (<TableRow key={d.name}><TableCell>{i + 1}</TableCell><TableCell>{d.name}</TableCell><TableCell className="text-right">{d.count}</TableCell></TableRow>))}
                    {diagnosisCount.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No diagnoses recorded.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiCard label="Total Patients" value={String(patients.length)} />
              <KpiCard label="New (period)" value={String(newPatients)} />
              <KpiCard label="Returning" value={String(Math.max(0, returning))} />
              <KpiCard label="Active (period)" value={String(uniquePatients)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-medium mb-3">Gender</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={gender} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
                        {gender.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Legend /><Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-medium mb-3">Age distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <BarChart data={ageBuckets}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
                      <Bar dataKey="value" fill="hsl(180 60% 45%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard label="Total Examinations" value={String(visits.length)} />
              <KpiCard label="Avg Visits / Patient" value={(uniquePatients ? visits.length / uniquePatients : 0).toFixed(1)} />
              <KpiCard label="Busiest Day" value={byDay.length ? byDay.reduce((a, b) => a.visits > b.visits ? a : b).date : "—"} />
            </div>
            <Card className="p-5">
              <h3 className="font-medium mb-3">Visits per day</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={byDay}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="hsl(160 60% 45%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KpiCard label="Total Tariff Collected" value={formatIDR(totalRevenue)} />
              <KpiCard label="Transactions" value={String(visits.length)} />
            </div>
            <Card className="p-5">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Visits</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {byDay.map((d) => (<TableRow key={d.date}><TableCell>{d.date}</TableCell><TableCell>{d.visits}</TableCell><TableCell className="text-right">{formatIDR(d.revenue)}</TableCell></TableRow>))}
                    {byDay.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No billing in period.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </Card>
  );
}
