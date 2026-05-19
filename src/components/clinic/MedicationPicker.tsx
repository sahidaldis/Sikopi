import { useState, useMemo, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, Search, X, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// ── Drug master list ──────────────────────────────────────────────────────────
const DRUG_LIST = [
  "Acifar Salf", "Alleron", "Alofar 100 mg", "Alofar 300 mg", "Alpara",
  "Bioplacenton Salf", "Biropyron 500 mg", "Brochifar Plus", "Bronchifar",
  "Broncytin Syrup", "Bronex 5 mg", "Calcifar Plus", "Cavicur", "Caviplex",
  "Chlorampecort H Salf", "Curviplex Syrup", "Dapyrin 500 mg",
  "Dexametason 0,5 mg", "Dexteem plus", "Dexymox 500", "Elkana", "Enakur",
  "Enbatic Salf", "Erlamicetin Tetes Mata", "Erlamicetin Tetes Telinga",
  "Esperigen 10 mg", "Farsifen 200 mg", "Flamigra 50 mg", "Flasicox 10 mg",
  "Floxigra 500", "Glucosamin Medicon", "Grafazol 500 mg", "Grantusif",
  "Helixime 100", "HICO Salf", "Histigen 6 mg", "Hufabethamin Syrup",
  "Hufadin", "Hufamag plus", "Infalgin 500 mg", "Intunal F", "Laxana 5 mg",
  "Lerzin", "Linogra 100 mg", "Loperamid Hcl 2 mg", "Lostacef 500",
  "Mecobalamin 500 mg", "Mefinal 500 mg", "Megatic Salf", "Neprholit",
  "Neuralgin 500 mg", "Neurodex", "Neurpyron 500 mg", "Nexitra 500 mg",
  "Nifedipine 5 mg", "Norvom 10 mg", "Novabiotic 500 mg", "Omeprazole 20 mg",
  "Oraprofen Syrup", "Remafar 10 mg", "Renabetic 5 mg", "Samcorbex C",
  "Samcovask 10 mg", "Sanorine Obat Kumur", "Seremig 10 mg",
  "Sevoltam 400 mg", "Sevoltam 800 mg", "Solinfec 200 mg", "Spasminal 500 mg",
  "Stanza 500 mg", "Sucralfat syr", "Teosal", "Tyalisin Kalk", "Tyalisin Plus",
  "Vesperum", "Vosea 10 mg", "Xelona 50 mg", "Zemoxyl Syrup", "Zenicol 500",
  "Zetamol Syrup", "Zevask 5 mg", "Zidalev 500 mg",
];

const FREQ_OPTIONS = [
  "1 x 1", "2 x 1", "3 x 1", "1 x 1/2", "2 x 1/2", "3 x 1/2",
  "1 x 2", "2 x 2", "3 x 2", "4 x 1", "Jika perlu (k/p)", "Lainnya",
];

// ── Storage format: "DrugName || freq | DrugName2 || freq2" ──────────────────
const SEP = " ‖ "; // entry separator
const KV = " :: "; // name::freq separator

type MedEntry = { name: string; freq: string; customFreq?: string };

function parse(raw: string): MedEntry[] {
  if (!raw.trim()) return [];
  return raw.split(SEP).map((part) => {
    const [name, freqRaw = ""] = part.split(KV);
    const freq = FREQ_OPTIONS.includes(freqRaw) ? freqRaw : freqRaw ? "Lainnya" : "1 x 1";
    const customFreq = !FREQ_OPTIONS.includes(freqRaw) && freqRaw ? freqRaw : undefined;
    return { name: name.trim(), freq, customFreq };
  }).filter(e => e.name);
}

function serialize(entries: MedEntry[]): string {
  return entries
    .map((e) => `${e.name}${KV}${e.freq === "Lainnya" ? (e.customFreq || "Lainnya") : e.freq}`)
    .join(SEP);
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function MedicationPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<MedEntry[]>(() => parse(value));
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync incoming value → local state when dialog opens
  const handleOpen = () => {
    setEntries(parse(value));
    setSearch("");
    setOpen(true);
  };

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 80);
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? DRUG_LIST.filter((d) => d.toLowerCase().includes(q)) : DRUG_LIST;
  }, [search]);

  const isSelected = (name: string) => entries.some((e) => e.name === name);

  const toggle = (name: string, checked: boolean) => {
    if (checked) {
      setEntries((prev) => [...prev, { name, freq: "1 x 1" }]);
    } else {
      setEntries((prev) => prev.filter((e) => e.name !== name));
    }
  };

  const updateFreq = (name: string, freq: string) => {
    setEntries((prev) =>
      prev.map((e) => e.name === name ? { ...e, freq, customFreq: freq !== "Lainnya" ? undefined : e.customFreq } : e)
    );
  };

  const updateCustomFreq = (name: string, customFreq: string) => {
    setEntries((prev) =>
      prev.map((e) => e.name === name ? { ...e, customFreq } : e)
    );
  };

  const removePill = (name: string) => {
    const next = entries.filter((e) => e.name !== name);
    onChange(serialize(next));
  };

  const done = () => {
    onChange(serialize(entries));
    setOpen(false);
  };

  const displayPills = parse(value);

  return (
    <div className="space-y-2">
      <Label>Medikasi</Label>

      {/* Trigger field */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full min-h-[42px] flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background text-sm text-left hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Pill className="size-4 text-primary shrink-0" />
        {displayPills.length === 0 ? (
          <span className="text-muted-foreground">Klik untuk pilih obat…</span>
        ) : (
          <span className="text-foreground">{displayPills.length} obat dipilih</span>
        )}
        <ChevronDown className="size-4 text-muted-foreground ml-auto shrink-0" />
      </button>

      {/* Pills of selected drugs */}
      {displayPills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {displayPills.map((e) => {
            const freqLabel = e.freq === "Lainnya" ? (e.customFreq || "Lainnya") : e.freq;
            return (
              <Badge
                key={e.name}
                variant="secondary"
                className="flex items-center gap-1 pr-1 text-xs font-normal"
              >
                <span className="font-medium">{e.name}</span>
                <span className="opacity-70">{freqLabel}</span>
                <button
                  type="button"
                  onClick={() => removePill(e.name)}
                  className="ml-0.5 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-3 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Pill className="size-5 text-primary" />
              Pilih Obat
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="px-4 py-3 border-b shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                placeholder="Cari nama obat…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Drug list */}
          <div className="overflow-y-auto flex-1 px-2 py-2 space-y-0.5">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Obat tidak ditemukan.</p>
            )}
            {filtered.map((drug) => {
              const checked = isSelected(drug);
              const entry = entries.find((e) => e.name === drug);
              return (
                <div
                  key={drug}
                  className={`rounded-lg px-3 py-2 transition-colors ${checked ? "bg-primary/8 border border-primary/20" : "hover:bg-muted/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => toggle(drug, !!v)}
                      id={`drug-${drug}`}
                    />
                    <label
                      htmlFor={`drug-${drug}`}
                      className="flex-1 text-sm cursor-pointer select-none font-medium"
                    >
                      {drug}
                    </label>
                    {checked && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Select value={entry?.freq || "1 x 1"} onValueChange={(v) => updateFreq(drug, v)}>
                          <SelectTrigger className="h-7 text-xs w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FREQ_OPTIONS.map((f) => (
                              <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {entry?.freq === "Lainnya" && (
                          <Input
                            className="h-7 text-xs w-[90px]"
                            placeholder="mis. 4x1"
                            value={entry?.customFreq || ""}
                            onChange={(e) => updateCustomFreq(drug, e.target.value)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t shrink-0 flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {entries.length} obat dipilih
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Batal</Button>
              <Button size="sm" onClick={done}>Simpan Pilihan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
