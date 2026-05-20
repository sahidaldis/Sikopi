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

  const doctorName = "Paryanto, S.Kep., Ns. MM";
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
            body {
              font-family: 'Times New Roman', Times, serif;
              background: white;
              color: black;
              padding: 2cm;
              box-sizing: border-box;
            }
            .font-sans {
              font-family: Arial, Helvetica, sans-serif !important;
            }
            @page {
              size: A4;
              margin: 0;
            }
          </style>
        </head>
        <body class="bg-white">
          <div class="w-[210mm] min-h-[297mm] mx-auto text-[12pt] p-8">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.parent.document.body.removeChild(window.frameElement);
                }, 1000);
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Form Controls */}
        <div className="w-full md:w-1/3 space-y-6 overflow-y-auto pr-2 flex flex-col justify-between">
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Buat Surat Sakit</DialogTitle>
            </DialogHeader>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary space-y-1">
              <p className="font-semibold">Informasi Dokter & Klinik (Otomatis):</p>
              <p>Pemeriksa: <span className="font-medium text-foreground">{doctorName}</span></p>
              <p>SIPP: <span className="font-medium text-foreground">{sipNumber}</span></p>
              <p>Alamat: <span className="font-medium text-foreground">Dusun Klegen 02/XV, Desa Planggu, Kecamatan Trucuk, Kabupaten Klaten</span></p>
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
        <div className="flex-1 bg-muted p-4 rounded-lg overflow-auto hidden md:block max-h-[80vh]">
          <div className="text-xs text-muted-foreground mb-4 text-center uppercase tracking-wider font-semibold sticky top-0 bg-muted/80 backdrop-blur z-10 py-2">Live Preview Surat</div>
          
          <div className="flex justify-center origin-top" style={{ transform: 'scale(0.85)' }}>
            <div id="printable-sick-leave" className="bg-white text-black p-12 shadow-xl border w-[210mm] min-h-[297mm] flex flex-col" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt' }}>
              <div>
                {/* Kop Surat (Header) */}
                <div className="flex items-center gap-6 border-b-[3px] border-black pb-4 mb-6">
                  <img src={ppniLogoUrl} alt="PPNI Logo" className="h-24 w-24 object-contain shrink-0" />
                  <div className="flex-1 text-left font-sans">
                    <h2 className="text-[16pt] font-bold uppercase tracking-wide mb-1 text-black font-sans">PRAKTIK MANDIRI PERAWAT</h2>
                    <p className="text-[11pt] leading-snug text-black font-sans">Dusun Klegen 02/XV, Desa Planggu, Kecamatan Trucuk, Kabupaten Klaten</p>
                    <p className="text-[11pt] leading-snug text-black font-sans">Mobile Phone Number : 0857 4196 5020</p>
                  </div>
                </div>

                {/* Judul Surat */}
                <div className="text-center mb-8">
                  <h3 className="text-[14pt] font-bold underline uppercase tracking-wider inline-block">SURAT KETERANGAN SAKIT</h3>
                  <p className="text-[12pt] mt-1">Nomor : SKS/..../..../2026</p>
                </div>

                {/* Isi Surat */}
                <div className="space-y-4 leading-relaxed text-[12pt]">
                  <p>Yang bertanda tangan dibawah ini, menerangkan bahwa :</p>

                  <table className="w-full ml-8 my-4 border-collapse">
                    <tbody>
                      <tr className="h-8">
                        <td className="w-40 align-top">Nama</td>
                        <td className="w-4 align-top">:</td>
                        <td className="align-top">{patient.full_name}</td>
                      </tr>
                      <tr className="h-8">
                        <td className="align-top">Jenis Kelamin</td>
                        <td className="align-top">:</td>
                        <td className="align-top">{patient.gender?.toLowerCase() === 'male' ? 'Laki-Laki' : patient.gender?.toLowerCase() === 'female' ? 'Perempuan' : patient.gender || '—'}</td>
                      </tr>
                      <tr className="h-8">
                        <td className="align-top">Umur</td>
                        <td className="align-top">:</td>
                        <td className="align-top">{age !== null ? `${age} Tahun` : "—"}</td>
                      </tr>
                      <tr className="h-8">
                        <td className="align-top">Pekerjaan</td>
                        <td className="align-top">:</td>
                        <td className="align-top">—</td>
                      </tr>
                      <tr className="h-8">
                        <td className="align-top">Alamat</td>
                        <td className="align-top">:</td>
                        <td className="align-top">{patient.address || "—"}</td>
                      </tr>
                      <tr className="h-8">
                        <td className="align-top">Anamnese</td>
                        <td className="align-top">:</td>
                        <td className="align-top">{latestAnamnesis || "—"}</td>
                      </tr>
                      <tr className="h-8">
                        <td className="align-top">Dx. Keperawatan</td>
                        <td className="align-top">:</td>
                        <td className="align-top">{latestDiagnosis || "—"}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="pt-2">
                    Oleh sebab itu kami menyarankan untuk istirahat selama <b>{duration}</b> (<b>{durationText}</b>) hari, mulai tanggal <b>{formatIndonesianDate(startDate)}</b> s/d <b>{formatIndonesianDate(endDate)}</b>.
                  </p>

                  <p className="pt-2">Demikian Surat Keterangan ini dibuat dengan sebenarnya dan untuk dipergunakan sebagaimana mestinya.</p>
                </div>
              </div>

              {/* Tanda Tangan */}
              <div className="mt-16 flex justify-end text-[12pt]">
                <div className="text-left w-64 space-y-20">
                  <div>
                    <p>Trucuk, {formatIndonesianDate(new Date())}</p>
                    <p className="mt-2">Perawat Pemeriksa,</p>
                  </div>
                  <div>
                    <p className="font-bold underline">{doctorName}</p>
                    <p>SIPP : {sipNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

