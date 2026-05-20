import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ppniLogoUrl from "@/ppni-logo.png";

type Patient = {
  mrn: string;
  full_name: string;
  dob: string | null;
  gender: string | null;
  address: string | null;
};

type ReferralLetterDialogProps = {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  latestDiagnosis?: string;
  latestAnamnesis?: string;
  latestMedication?: string;
  latestPhysicalExam?: string;
  latestMedicalDiagnosis?: string;
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

export function ReferralLetterDialog({
  open,
  onClose,
  patient,
  latestDiagnosis = "",
  latestAnamnesis = "",
  latestMedication = "",
  latestPhysicalExam = "",
  latestMedicalDiagnosis = "",
}: ReferralLetterDialogProps) {
  const [targetHospital, setTargetHospital] = useState("Rumah Sakit Umum Daerah");
  const [targetSpecialty, setTargetSpecialty] = useState("Spesialis Bedah / Orthopedi");
  const [diagnosis, setDiagnosis] = useState(latestDiagnosis);
  const [medicalDiagnosis, setMedicalDiagnosis] = useState(latestMedicalDiagnosis);
  const [anamnesis, setAnamnesis] = useState(latestAnamnesis);
  const [therapy, setTherapy] = useState(latestMedication);
  const [physicalExam, setPhysicalExam] = useState(latestPhysicalExam);

  // Sync state when dialog opens and receives new props
  useEffect(() => {
    if (open) {
      setDiagnosis(latestDiagnosis);
      setAnamnesis(latestAnamnesis);
      setTherapy(latestMedication);
      setPhysicalExam(latestPhysicalExam);
      setMedicalDiagnosis(latestMedicalDiagnosis);
    }
  }, [open, latestDiagnosis, latestAnamnesis, latestMedication, latestPhysicalExam, latestMedicalDiagnosis]);

  const doctorName = "Paryanto, S.Kep., Ns. MM";
  const sipNumber = "500.16.7.2/361/2024";
  const age = getAgeFromDob(patient.dob);

  const handlePrint = () => {
    const printContent = document.getElementById("printable-referral-letter");
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
          <title>Surat Rujukan Pasien - ${patient.full_name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              background: white;
              color: black;
              margin: 0;
              padding: 0;
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
        <body class="bg-white m-0 p-0">
          ${printContent.outerHTML}
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
      <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Form Controls */}
        <div className="w-full md:w-1/3 space-y-4 overflow-y-auto pr-2 flex flex-col justify-between max-h-[85vh]">
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Buat Surat Rujukan Pasien</DialogTitle>
            </DialogHeader>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary space-y-1">
              <p className="font-semibold">Informasi Dokter & Klinik (Otomatis):</p>
              <p>Pemberi Rujukan: <span className="font-medium text-foreground">{doctorName}</span></p>
              <p>SIPP: <span className="font-medium text-foreground">{sipNumber}</span></p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="target_hospital" className="font-semibold text-foreground">RS / Faskes Rujukan Tujuan</Label>
                  <Input
                    id="target_hospital"
                    value={targetHospital}
                    onChange={(e) => setTargetHospital(e.target.value)}
                    placeholder="Nama Rumah Sakit Tujuan"
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="target_specialty" className="font-semibold text-foreground">Spesialis / Poli Rujukan</Label>
                  <Input
                    id="target_specialty"
                    value={targetSpecialty}
                    onChange={(e) => setTargetSpecialty(e.target.value)}
                    placeholder="Spesialis / Poli"
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="anamnesis" className="font-semibold text-foreground">Keluhan & Anamnesa Singkat</Label>
                <Textarea
                  id="anamnesis"
                  rows={2}
                  value={anamnesis}
                  onChange={(e) => setAnamnesis(e.target.value)}
                  className="mt-1 text-xs"
                  placeholder="Keluhan subjektif pasien..."
                />
              </div>

              <div>
                <Label htmlFor="physical_exam" className="font-semibold text-foreground">Pemeriksaan Fisik / TTV</Label>
                <Textarea
                  id="physical_exam"
                  rows={2}
                  value={physicalExam}
                  onChange={(e) => setPhysicalExam(e.target.value)}
                  className="mt-1 text-xs"
                  placeholder="Tekanan darah, nadi, suhu, dll..."
                />
              </div>

              <div>
                <Label htmlFor="diagnosis" className="font-semibold text-foreground">Diagnosis Keperawatan Rujukan</Label>
                <Input
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="mt-1 text-xs"
                  placeholder="Diagnosis keperawatan utama"
                />
              </div>

              <div>
                <Label htmlFor="medical_diagnosis" className="font-semibold text-foreground">Diagnosis Medis Sementara/Suspect</Label>
                <Input
                  id="medical_diagnosis"
                  value={medicalDiagnosis}
                  onChange={(e) => setMedicalDiagnosis(e.target.value)}
                  className="mt-1 text-xs"
                  placeholder="Diagnosis medis"
                />
              </div>

              <div>
                <Label htmlFor="therapy" className="font-semibold text-foreground">Tindakan / Terapi Sementara yang Diberikan</Label>
                <Textarea
                  id="therapy"
                  rows={2}
                  value={therapy}
                  onChange={(e) => setTherapy(e.target.value)}
                  className="mt-1 text-xs"
                  placeholder="Obat-obatan atau penanganan awal..."
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4 border-t mt-4 shrink-0">
            <Button variant="outline" onClick={onClose} size="sm">Batal</Button>
            <Button onClick={handlePrint} className="bg-primary text-primary-foreground" size="sm">Cetak Rujukan</Button>
          </DialogFooter>
        </div>

        {/* Live Preview Pane */}
        <div className="flex-1 bg-muted p-4 rounded-lg overflow-auto hidden md:block max-h-[85vh]">
          <div className="text-xs text-muted-foreground mb-4 text-center uppercase tracking-wider font-semibold sticky top-0 bg-muted/80 backdrop-blur z-10 py-2">Live Preview Surat Rujukan</div>

          <div className="flex justify-center origin-top" style={{ transform: 'scale(0.85)' }}>
            <div id="printable-referral-letter" className="bg-white text-black p-10 shadow-xl border w-[210mm] min-h-[297mm] flex flex-col justify-between" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt' }}>
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

                {/* Tempat & Tanggal Rujukan */}
                <div className="flex justify-between items-start mb-6 text-[12pt]">
                  <div className="space-y-0.5">
                    <p>Hal : <b>Rujukan Pasien</b></p>
                    <p>Lampiran : —</p>
                  </div>
                  <div className="text-right">
                    <p>Trucuk, {formatIndonesianDate(new Date())}</p>
                  </div>
                </div>

                {/* Penerima Rujukan */}
                <div className="mb-6 text-[12pt] leading-relaxed">
                  <p>Kepada Yth.</p>
                  <p className="font-bold">Dokter {targetSpecialty || "—"}</p>
                  <p>Di <span className="font-semibold">{targetHospital || "—"}</span></p>
                </div>

                <p className="mb-3 text-[12pt]">Dengan hormat,</p>
                <p className="mb-4 text-[12pt] leading-relaxed">
                  Mohon pemeriksaan dan penanganan lebih lanjut terhadap pasien di bawah ini:
                </p>

                {/* Data Pasien */}
                <table className="w-full ml-4 text-[12pt] my-4 border-collapse leading-relaxed">
                  <tbody>
                    <tr className="h-6">
                      <td className="w-40 align-top">Nama Pasien</td>
                      <td className="w-4 align-top">:</td>
                      <td className="font-bold uppercase align-top">{patient.full_name}</td>
                    </tr>
                    <tr className="h-6">
                      <td className="align-top">Umur / Tgl Lahir</td>
                      <td className="align-top">:</td>
                      <td className="align-top">
                        {age !== null ? `${age} Tahun` : "—"} / {formatIndonesianDate(patient.dob)}
                      </td>
                    </tr>
                    <tr className="h-6">
                      <td className="align-top">Jenis Kelamin</td>
                      <td className="align-top">:</td>
                      <td className="align-top">{patient.gender?.toLowerCase() === 'male' ? 'Laki-Laki' : patient.gender?.toLowerCase() === 'female' ? 'Perempuan' : patient.gender || '—'}</td>
                    </tr>
                    <tr className="h-6">
                      <td className="align-top">No. Rekam Medis</td>
                      <td className="align-top">:</td>
                      <td className="align-top font-mono">{patient.mrn}</td>
                    </tr>
                    <tr className="h-6">
                      <td className="align-top">Alamat Pasien</td>
                      <td className="align-top">:</td>
                      <td className="align-top">{patient.address || "—"}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Temuan Klinis & Rencana */}
                <div className="space-y-4 mt-6 text-[12pt] leading-relaxed">
                  <div>
                    <p className="font-semibold underline">Keluhan & Anamnesa Singkat:</p>
                    <p className="pl-4 italic">{anamnesis || "—"}</p>
                  </div>
                  {physicalExam && (
                    <div>
                      <p className="font-semibold underline">Pemeriksaan Fisik / Tanda-Tanda Vital:</p>
                      <p className="pl-4">{physicalExam}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold underline">Diagnosis Keperawatan Rujukan:</p>
                    <p className="pl-4 font-medium">{diagnosis || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold underline">Diagnosis Medis Sementara / Suspect:</p>
                    <p className="pl-4 font-medium">{medicalDiagnosis || "—"}</p>
                  </div>
                  {therapy && (
                    <div>
                      <p className="font-semibold underline">Terapi / Tindakan Sementara yang Diberikan:</p>
                      <p className="pl-4">{therapy}</p>
                    </div>
                  )}
                </div>

                <p className="mt-8 text-[12pt] leading-relaxed">
                  Demikian surat rujukan ini kami buat untuk penanganan medis pasien lebih lanjut. Atas kerja sama dan bantuan sejawat, kami ucapkan terima kasih.
                </p>
              </div>

              {/* Tanda Tangan */}
              <div className="mt-10 flex justify-end text-[12pt] break-inside-avoid">
                <div className="text-left w-64 space-y-16">
                  <div>
                    <p>Salam Sejawat,</p>
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
