import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ppniLogoUrl from "@/ppni-logo.png";

type Patient = {
  mrn: string;
  full_name: string;
  dob: string | null;
  gender: string | null;
  address: string | null;
};

type SickLeaveDialogProps = {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  latestDiagnosis?: string;
  latestAnamnesis?: string;
};

const formatIndonesianDate = (dateStr: string | Date | null) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const numberToWordsIndonesian = (num: number): string => {
  const words = [
    "nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"
  ];
  if (num < 12) return words[num];
  if (num < 20) return numberToWordsIndonesian(num - 10) + " belas";
  if (num < 100) {
    const double = Math.floor(num / 10);
    const remainder = num % 10;
    return words[double] + " puluh" + (remainder ? " " + words[remainder] : "");
  }
  return num.toString();
};

const getAgeFromDob = (dobStr: string | null): number | null => {
  if (!dobStr) return null;
  const birthDate = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export function SickLeaveDialog({
  open,
  onClose,
  patient,
  latestDiagnosis = "",
  latestAnamnesis = "",
}: SickLeaveDialogProps) {
  const [duration, setDuration] = useState(3);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);

  const doctorName = "PARYANTO, S.Kep., Ns.";
  const sipNumber = "500.16.7.2/361/2024";

  const getEndAndReturnDates = () => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + Math.max(1, duration) - 1);

    const ret = new Date(end);
    ret.setDate(end.getDate() + 1);

    return {
      endDate: end,
      returnDate: ret,
    };
  };

  const { endDate } = getEndAndReturnDates();
  const age = getAgeFromDob(patient.dob);
  const durationText = numberToWordsIndonesian(duration);

  const handlePrint = () => {
    const printContent = document.getElementById("printable-sick-leave");
    if (!printContent) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Surat Keterangan Sakit - ${patient.full_name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Playfair Display', Georgia, serif;
              background: white;
              color: black;
              padding: 1.5cm;
              box-sizing: border-box;
            }
            .font-sans {
              font-family: 'Inter', system-ui, sans-serif;
            }
            @page {
              size: A4;
              margin: 0;
            }
          </style>
        </head>
        <body class="bg-white">
          <div class="max-w-2xl mx-auto">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 1000);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Form Controls */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-2 flex flex-col justify-between">
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Buat Surat Sakit</DialogTitle>
            </DialogHeader>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary space-y-1">
              <p className="font-semibold">Informasi Dokter & Klinik (Otomatis):</p>
              <p>Pemeriksa: <span className="font-medium text-foreground">{doctorName}</span></p>
              <p>SIP: <span className="font-medium text-foreground">{sipNumber}</span></p>
              <p>Alamat: <span className="font-medium text-foreground">Klegen Rt. 002 Rw. 015, Planggu, Trucuk - Klaten</span></p>
            </div>

            <div className="space-y-4 text-sm pt-2">
              <div>
                <Label htmlFor="duration" className="font-semibold text-foreground">Durasi Istirahat (Hari)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={30}
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="start_date" className="font-semibold text-foreground">Mulai Tanggal</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-6 border-t mt-4">
            <Button variant="outline" onClick={onClose}>Batal</Button>
            <Button onClick={handlePrint} className="bg-primary text-primary-foreground">Cetak Surat</Button>
          </DialogFooter>
        </div>

        {/* Live Preview Pane */}
        <div className="flex-1 bg-muted p-4 rounded-lg overflow-y-auto hidden md:block max-h-[80vh]">
          <div className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold">Live Preview Surat</div>
          
          <div id="printable-sick-leave" className="bg-white text-black p-8 font-serif shadow-md border rounded text-xs aspect-[1/1.41] flex flex-col justify-between">
            <div>
              {/* Kop Surat (Header) */}
              <div className="flex items-center gap-4 border-b-2 border-black pb-2 mb-4">
                <img src={ppniLogoUrl} alt="PPNI Logo" className="h-12 w-12 sm:h-14 sm:w-14 object-contain shrink-0" />
                <div className="flex-1 text-center pr-12 font-serif">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wide">PRAKTIK KEPERAWATAN</h2>
                  <p className="text-[8px] leading-tight text-gray-700">Klegen Rt. 002 Rw. 015, Planggu, Trucuk - Klaten</p>
                </div>
              </div>

              {/* Judul Surat */}
              <div className="text-center mb-4">
                <h3 className="text-xs font-bold underline uppercase tracking-wider">SURAT KETERANGAN</h3>
                <p className="text-[8px] text-gray-500">Nomor : SKS/${new Date().getFullYear()}/${patient.mrn.replace("MR-", "")}</p>
              </div>

              {/* Isi Surat */}
              <div className="space-y-2 leading-relaxed text-[10px]">
                <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>

                <table className="w-full ml-4 text-[10px] my-3 border-collapse">
                  <tbody>
                    <tr className="h-5">
                      <td className="w-24 align-top">Nama</td>
                      <td className="w-4 align-top">:</td>
                      <td className="font-bold uppercase align-top">{patient.full_name}</td>
                    </tr>
                    <tr className="h-5">
                      <td className="align-top">Umur</td>
                      <td className="align-top">:</td>
                      <td className="align-top">{age !== null ? `${age} Tahun` : "—"}</td>
                    </tr>
                    <tr className="h-5">
                      <td className="align-top">Pekerjaan</td>
                      <td className="align-top">:</td>
                      <td className="align-top">—</td>
                    </tr>
                    <tr className="h-5">
                      <td className="align-top">Alamat</td>
                      <td className="align-top">:</td>
                      <td className="align-top">{patient.address || "—"}</td>
                    </tr>
                    <tr className="h-5">
                      <td className="align-top">Anamnesa</td>
                      <td className="align-top">:</td>
                      <td className="align-top">{latestAnamnesis || "—"}</td>
                    </tr>
                    <tr className="h-5">
                      <td className="align-top">Diagnosa keperawatan</td>
                      <td className="align-top">:</td>
                      <td className="align-top font-semibold">{latestDiagnosis || "—"}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="pt-2">
                  Oleh sebab itu kami menyarankan untuk beristirahat selama <b>{duration}</b> (<b>{durationText}</b>) hari, mulai tanggal <b>{formatIndonesianDate(startDate)}</b> s/d <b>{formatIndonesianDate(endDate)}</b>.
                </p>

                <p className="pt-2">Demikian surat keterangan ini dibuat dengan sebenarnya dan untuk dipergunakan sebagaimana mestinya.</p>
              </div>
            </div>

            {/* Tanda Tangan */}
            <div className="mt-8 flex justify-between items-start text-[10px]">
              <div></div>
              <div className="text-center w-52 space-y-12">
                <p>Klaten, {formatIndonesianDate(new Date())}<br />Perawat,</p>
                <div>
                  <p className="font-bold underline uppercase">{doctorName}</p>
                  <p className="text-[8px] text-gray-500">SIP. {sipNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
