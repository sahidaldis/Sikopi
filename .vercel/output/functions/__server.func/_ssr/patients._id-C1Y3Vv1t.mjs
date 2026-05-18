import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, u as useLocation, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { R as Route$1, s as supabase } from "./router-BrMXvL0y.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DdVpvAyP.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, b as DialogFooter } from "./dialog-FI0wxeE3.mjs";
import { S as Skeleton } from "./skeleton-F-7As_y7.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as ageFromDob, f as formatDate, b as formatDateTime, c as formatIDR } from "./format-BOBLGkWK.mjs";
import { a as ArrowLeft, P as Pencil, g as FileText, i as Plus } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const ppniLogoUrl = "/assets/ppni-logo-Cx0Z-BS4.png";
const formatIndonesianDate$1 = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
const numberToWordsIndonesian = (num) => {
  const words = [
    "nol",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas"
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
const getAgeFromDob$1 = (dobStr) => {
  if (!dobStr) return null;
  const birthDate = new Date(dobStr);
  const today = /* @__PURE__ */ new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
    age--;
  }
  return age;
};
function SickLeaveDialog({
  open,
  onClose,
  patient,
  latestDiagnosis = "",
  latestAnamnesis = ""
}) {
  const [duration, setDuration] = reactExports.useState(3);
  const [startDate, setStartDate] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
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
      returnDate: ret
    };
  };
  const { endDate } = getEndAndReturnDates();
  const age = getAgeFromDob$1(patient.dob);
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
          <script src="https://cdn.tailwindcss.com"><\/script>
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
          <\/script>
        </body>
      </html>
    `);
    doc.close();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] flex flex-col md:flex-row gap-6 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-6 overflow-y-auto pr-2 flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Buat Surat Sakit" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "Informasi Dokter & Klinik (Otomatis):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Pemeriksa: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: doctorName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "SIP: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: sipNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Alamat: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Klegen Rt. 002 Rw. 015, Planggu, Trucuk - Klaten" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "duration", className: "font-semibold text-foreground", children: "Durasi Istirahat (Hari)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "duration",
                type: "number",
                min: 1,
                max: 30,
                value: duration,
                onChange: (e) => setDuration(Math.max(1, parseInt(e.target.value) || 1)),
                className: "mt-1"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "start_date", className: "font-semibold text-foreground", children: "Mulai Tanggal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "start_date",
                type: "date",
                value: startDate,
                onChange: (e) => setStartDate(e.target.value),
                className: "mt-1"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex justify-end gap-2 pt-6 border-t mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Batal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handlePrint, className: "bg-primary text-primary-foreground", children: "Cetak Surat" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-muted p-4 rounded-lg overflow-y-auto hidden md:block max-h-[80vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold", children: "Live Preview Surat" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "printable-sick-leave", className: "bg-white text-black p-8 font-serif shadow-md border rounded text-xs aspect-[1/1.41] flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 border-b-2 border-black pb-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ppniLogoUrl, alt: "PPNI Logo", className: "h-12 w-12 sm:h-14 sm:w-14 object-contain shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center pr-12 font-serif", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs sm:text-sm font-bold uppercase tracking-wide", children: "PRAKTIK MANDIRI PERAWAT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] leading-tight text-gray-700", children: "Klegen Rt. 002 Rw. 015, Planggu, Trucuk - Klaten" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold underline uppercase tracking-wider", children: "SURAT KETERANGAN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8px] text-gray-500", children: [
              "Nomor : SKS/$",
              (/* @__PURE__ */ new Date()).getFullYear(),
              "/$",
              patient.mrn.replace("MR-", "")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 leading-relaxed text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Yang bertanda tangan di bawah ini menerangkan bahwa:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full ml-4 text-[10px] my-3 border-collapse", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-24 align-top", children: "Nama" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-4 align-top", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-bold uppercase align-top", children: patient.full_name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "Umur" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: age !== null ? `${age} Tahun` : "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "Pekerjaan" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "Alamat" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: patient.address || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "Anamnesa" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: latestAnamnesis || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "Diagnosa keperawatan" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top font-semibold", children: latestDiagnosis || "—" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pt-2", children: [
              "Oleh sebab itu kami menyarankan untuk beristirahat selama ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: duration }),
              " (",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: durationText }),
              ") hari, mulai tanggal ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: formatIndonesianDate$1(startDate) }),
              " s/d ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: formatIndonesianDate$1(endDate) }),
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pt-2", children: "Demikian surat keterangan ini dibuat dengan sebenarnya dan untuk dipergunakan sebagaimana mestinya." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex justify-between items-start text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center w-52 space-y-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Klaten, ",
              formatIndonesianDate$1(/* @__PURE__ */ new Date()),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "Perawat,"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold underline uppercase", children: doctorName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8px] text-gray-500", children: [
                "SIP. ",
                sipNumber
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
const getAgeFromDob = (dobStr) => {
  if (!dobStr) return null;
  const birthDate = new Date(dobStr);
  const today = /* @__PURE__ */ new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
    age--;
  }
  return age;
};
function ReferralLetterDialog({
  open,
  onClose,
  patient,
  latestDiagnosis = "",
  latestAnamnesis = "",
  latestMedication = "",
  latestPhysicalExam = ""
}) {
  const [targetHospital, setTargetHospital] = reactExports.useState("Rumah Sakit Umum Daerah");
  const [targetSpecialty, setTargetSpecialty] = reactExports.useState("Spesialis Bedah / Orthopedi");
  const [diagnosis, setDiagnosis] = reactExports.useState(latestDiagnosis);
  const [anamnesis, setAnamnesis] = reactExports.useState(latestAnamnesis);
  const [therapy, setTherapy] = reactExports.useState(latestMedication);
  const [physicalExam, setPhysicalExam] = reactExports.useState(latestPhysicalExam);
  reactExports.useState(() => {
    setDiagnosis(latestDiagnosis);
    setAnamnesis(latestAnamnesis);
    setTherapy(latestMedication);
    setPhysicalExam(latestPhysicalExam);
  });
  const doctorName = "PARYANTO, S.Kep., Ns.";
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
          <script src="https://cdn.tailwindcss.com"><\/script>
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
          <\/script>
        </body>
      </html>
    `);
    doc.close();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-5xl max-h-[95vh] flex flex-col md:flex-row gap-6 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-4 overflow-y-auto pr-2 flex flex-col justify-between max-h-[85vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: "Buat Surat Rujukan Pasien" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "Informasi Dokter & Klinik (Otomatis):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Pemberi Rujukan: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: doctorName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "SIP: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: sipNumber })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "target_hospital", className: "font-semibold text-foreground", children: "RS / Faskes Rujukan Tujuan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "target_hospital",
                  value: targetHospital,
                  onChange: (e) => setTargetHospital(e.target.value),
                  placeholder: "Nama Rumah Sakit Tujuan",
                  className: "mt-1 text-xs"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "target_specialty", className: "font-semibold text-foreground", children: "Spesialis / Poli Rujukan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "target_specialty",
                  value: targetSpecialty,
                  onChange: (e) => setTargetSpecialty(e.target.value),
                  placeholder: "Spesialis / Poli",
                  className: "mt-1 text-xs"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "anamnesis", className: "font-semibold text-foreground", children: "Keluhan & Anamnesa Singkat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "anamnesis",
                rows: 2,
                value: anamnesis,
                onChange: (e) => setAnamnesis(e.target.value),
                className: "mt-1 text-xs",
                placeholder: "Keluhan subjektif pasien..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "physical_exam", className: "font-semibold text-foreground", children: "Pemeriksaan Fisik / TTV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "physical_exam",
                rows: 2,
                value: physicalExam,
                onChange: (e) => setPhysicalExam(e.target.value),
                className: "mt-1 text-xs",
                placeholder: "Tekanan darah, nadi, suhu, dll..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "diagnosis", className: "font-semibold text-foreground", children: "Diagnosis Rujukan (Sementara)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "diagnosis",
                value: diagnosis,
                onChange: (e) => setDiagnosis(e.target.value),
                className: "mt-1 text-xs",
                placeholder: "Diagnosis utama"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "therapy", className: "font-semibold text-foreground", children: "Tindakan / Terapi Sementara yang Diberikan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "therapy",
                rows: 2,
                value: therapy,
                onChange: (e) => setTherapy(e.target.value),
                className: "mt-1 text-xs",
                placeholder: "Obat-obatan atau penanganan awal..."
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex justify-end gap-2 pt-4 border-t mt-4 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, size: "sm", children: "Batal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handlePrint, className: "bg-primary text-primary-foreground", size: "sm", children: "Cetak Rujukan" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-muted p-4 rounded-lg overflow-y-auto hidden md:block max-h-[85vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold", children: "Live Preview Surat Rujukan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "printable-referral-letter", className: "bg-white text-black p-8 font-serif shadow-md border rounded text-[10px] aspect-[1/1.41] flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 border-b-2 border-black pb-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ppniLogoUrl, alt: "PPNI Logo", className: "h-12 w-12 sm:h-14 sm:w-14 object-contain shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center pr-12 font-serif", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs sm:text-sm font-bold uppercase tracking-wide", children: "PRAKTIK MANDIRI PERAWAT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] leading-tight text-gray-700", children: "Klegen Rt. 002 Rw. 015, Planggu, Trucuk - Klaten" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4 text-[9px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Hal : ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Rujukan Pasien" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Lampiran : —" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Klaten, ",
              formatIndonesianDate(/* @__PURE__ */ new Date())
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 text-[9px] leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Kepada Yth." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
              "Teman Sejawat Dokter ",
              targetSpecialty || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Di ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: targetHospital || "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-[9px]", children: "Dengan hormat," }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-[9px] leading-relaxed", children: "Mohon pemeriksaan dan penanganan lebih lanjut terhadap pasien di bawah ini:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full ml-2 text-[9px] my-3 border-collapse leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-24 align-top", children: "Nama Pasien" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-3 align-top", children: ":" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-bold uppercase align-top", children: patient.full_name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "Umur / Tgl Lahir" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "align-top", children: [
                age !== null ? `${age} Tahun` : "—",
                " / ",
                formatIndonesianDate(patient.dob)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "Jenis Kelamin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: patient.gender || "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "No. Rekam Medis" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top font-mono text-[8px]", children: patient.mrn })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "h-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: "Alamat Pasien" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: ":" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "align-top", children: patient.address || "—" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mt-4 text-[9px] leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold underline", children: "Keluhan & Anamnesa Singkat:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pl-2 text-gray-700 italic", children: anamnesis || "—" })
            ] }),
            physicalExam && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold underline", children: "Pemeriksaan Fisik / Tanda-Tanda Vital:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pl-2 text-gray-700", children: physicalExam })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold underline", children: "Diagnosis Keperawatan Rujukan:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pl-2 text-gray-800 font-medium", children: diagnosis || "—" })
            ] }),
            therapy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold underline", children: "Terapi / Tindakan Sementara yang Diberikan:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pl-2 text-gray-700", children: therapy })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[9px] leading-relaxed", children: "Demikian surat rujukan ini kami buat untuk penanganan medis pasien lebih lanjut. Atas kerja sama dan bantuan sejawat, kami ucapkan terima kasih." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex justify-between items-start text-[9px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center w-52 space-y-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Salam Sejawat,",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "Perawat Pemeriksa,"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold underline uppercase", children: doctorName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8px] text-gray-500", children: [
                "SIP. ",
                sipNumber
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function PatientDetailPage() {
  const {
    id
  } = Route$1.useParams();
  useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname.endsWith("/visits/new");
  const [patient, setPatient] = reactExports.useState(null);
  const [visits, setVisits] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [editing, setEditing] = reactExports.useState(false);
  const [sickLeaveOpen, setSickLeaveOpen] = reactExports.useState(false);
  const [referralOpen, setReferralOpen] = reactExports.useState(false);
  const [activeDiagnosis, setActiveDiagnosis] = reactExports.useState("");
  const [activeAnamnesis, setActiveAnamnesis] = reactExports.useState("");
  const [activeMedication, setActiveMedication] = reactExports.useState("");
  const [activePhysicalExam, setActivePhysicalExam] = reactExports.useState("");
  const load = async () => {
    setLoading(true);
    const [{
      data: p
    }, {
      data: v
    }] = await Promise.all([supabase.from("patients").select("*").eq("id", id).single(), supabase.from("visits").select("*, cppt_records(subjective, objective, assessment, planning)").eq("patient_id", id).order("visited_at", {
      ascending: false
    })]);
    setPatient(p);
    setVisits(v ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, [id]);
  if (isChildRoute) return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full" }) });
  if (!patient) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Patient not found." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/patients", className: "text-primary", children: "Back to list" })
  ] });
  const age = ageFromDob(patient.dob);
  const totalBilled = visits.reduce((s, v) => s + Number(v.tariff || 0), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/patients", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Back to patients"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-muted-foreground", children: patient.mrn }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold mt-1", children: patient.full_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Gender: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: patient.gender ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "DOB: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
              formatDate(patient.dob),
              age !== null ? ` (${age} yrs)` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Phone: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: patient.phone ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "National ID: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: patient.national_id ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            "Address: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: patient.address ?? "—" })
          ] }),
          patient.allergy_flag && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 mt-2 rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm", children: [
            "Allergy: ",
            patient.allergy_details || "Not specified"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setEditing(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4 mr-2" }),
          " Edit"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700", onClick: () => {
          setActiveDiagnosis(visits[0]?.final_diagnosis || "");
          setActiveAnamnesis(visits[0]?.anamnesis || "");
          setSickLeaveOpen(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 mr-2" }),
          " Surat Sakit"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700", onClick: () => {
          setActiveDiagnosis(visits[0]?.final_diagnosis || "");
          setActiveAnamnesis(visits[0]?.anamnesis || "");
          setActiveMedication(visits[0]?.medication || "");
          setActivePhysicalExam(visits[0]?.physical_exam || "");
          setReferralOpen(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 mr-2" }),
          " Surat Rujukan"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/patients/$id/visits/new", params: {
          id
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
          " Add Visit"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "timeline", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "timeline", children: "Timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "cppt", children: "CPPT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "meds", children: "Medications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "billing", children: "Billing" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "timeline", className: "space-y-3 mt-4", children: visits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "No visits yet." }) : visits.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2 flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: formatDateTime(v.visited_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 px-2", onClick: () => {
              setActiveDiagnosis(v.final_diagnosis || "");
              setActiveAnamnesis(v.anamnesis || "");
              setSickLeaveOpen(true);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3" }),
              " Surat Sakit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1 px-2", onClick: () => {
              setActiveDiagnosis(v.final_diagnosis || "");
              setActiveAnamnesis(v.anamnesis || "");
              setActiveMedication(v.medication || "");
              setActivePhysicalExam(v.physical_exam || "");
              setReferralOpen(true);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3" }),
              " Surat Rujukan"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: formatIDR(v.tariff) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
          v.main_complaint && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Complaint:" }),
            " ",
            v.main_complaint
          ] }),
          v.final_diagnosis && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Diagnosis:" }),
            " ",
            v.final_diagnosis
          ] }),
          v.physical_exam && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Exam:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: v.physical_exam })
          ] }),
          v.medication && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Medication:" }),
            " ",
            v.medication
          ] }),
          v.followup && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Follow-up:" }),
            " ",
            v.followup
          ] })
        ] })
      ] }, v.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "cppt", className: "space-y-3 mt-4", children: visits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "No CPPT records." }) : visits.map((v) => {
        const c = Array.isArray(v.cppt_records) ? v.cppt_records[0] : v.cppt_records;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-2", children: formatDateTime(v.visited_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "S:" }),
              " ",
              c?.subjective || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "O:" }),
              " ",
              c?.objective || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "A:" }),
              " ",
              c?.assessment || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "P:" }),
              " ",
              c?.planning || "—"
            ] })
          ] })
        ] }, v.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "meds", className: "space-y-3 mt-4", children: visits.filter((v) => v.medication || v.procedures).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "No medication history." }) : visits.filter((v) => v.medication || v.procedures).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 text-sm space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: formatDateTime(v.visited_at) }),
        v.medication && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Medication:" }),
          " ",
          v.medication
        ] }),
        v.procedures && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Procedures:" }),
          " ",
          v.procedures
        ] }),
        v.instructions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Instructions:" }),
          " ",
          v.instructions
        ] })
      ] }, v.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "billing", className: "space-y-3 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Total billed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: formatIDR(totalBilled) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y", children: [
          visits.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: formatDateTime(v.visited_at) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: formatIDR(v.tariff) })
          ] }, v.id)),
          visits.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground py-2", children: "No billing yet." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditPatientDialog, { open: editing, onClose: () => setEditing(false), patient, onSaved: () => {
      setEditing(false);
      load();
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SickLeaveDialog, { open: sickLeaveOpen, onClose: () => setSickLeaveOpen(false), patient, latestDiagnosis: activeDiagnosis, latestAnamnesis: activeAnamnesis }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReferralLetterDialog, { open: referralOpen, onClose: () => setReferralOpen(false), patient, latestDiagnosis: activeDiagnosis, latestAnamnesis: activeAnamnesis, latestMedication: activeMedication, latestPhysicalExam: activePhysicalExam })
  ] });
}
function EmptyState({
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-10 text-center text-sm text-muted-foreground", children: text });
}
function EditPatientDialog({
  open,
  onClose,
  patient,
  onSaved
}) {
  const [form, setForm] = reactExports.useState(patient);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setForm(patient);
  }, [patient]);
  const save = async () => {
    setBusy(true);
    const {
      error
    } = await supabase.from("patients").update({
      full_name: form.full_name,
      national_id: form.national_id || null,
      dob: form.dob || null,
      gender: form.gender || null,
      address: form.address || null,
      phone: form.phone || null,
      allergy_flag: form.allergy_flag,
      allergy_details: form.allergy_flag ? form.allergy_details : null
    }).eq("id", patient.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Patient updated");
      onSaved();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit patient" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.full_name, onChange: (e) => setForm({
          ...form,
          full_name: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "National ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.national_id ?? "", onChange: (e) => setForm({
          ...form,
          national_id: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date of Birth" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: form.dob ?? "", onChange: (e) => setForm({
          ...form,
          dob: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Gender" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.gender ?? "", onChange: (e) => setForm({
          ...form,
          gender: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone ?? "", onChange: (e) => setForm({
          ...form,
          phone: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: form.address ?? "", onChange: (e) => setForm({
          ...form,
          address: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", id: "allergy", checked: form.allergy_flag, onChange: (e) => setForm({
          ...form,
          allergy_flag: e.target.checked
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "allergy", children: "Has allergies" })
      ] }),
      form.allergy_flag && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Allergy details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: form.allergy_details ?? "", onChange: (e) => setForm({
          ...form,
          allergy_details: e.target.value
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, disabled: busy, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: busy, children: busy ? "Saving…" : "Save" })
    ] })
  ] }) });
}
export {
  PatientDetailPage as component
};
