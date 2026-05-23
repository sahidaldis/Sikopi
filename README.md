# SIKOPI - Sistem Informasi Klinik Pratama

Sikopi adalah aplikasi sistem informasi klinik berbasis web modern yang dirancang untuk mengelola data pasien, riwayat kunjungan medis, serta pembuatan dokumen klinis secara otomatis dan terintegrasi. Aplikasi ini dikembangkan menggunakan teknologi terkini untuk memastikan performa yang cepat, aman, dan mudah digunakan.

## 🚀 Fitur Utama

- **Manajemen Pasien**: Pencatatan data demografi pasien, termasuk pekerjaan, kontak, dan riwayat rekam medis.
- **Dokumentasi Klinis (Kunjungan)**: Pencatatan anamnesa, pemeriksaan tanda-tanda vital (Suhu, Nadi, Respirasi, SpO2), diagnosis keperawatan/medis, intervensi, dan terapi/obat.
- **Generator Dokumen Medis**: Pembuatan dan cetak dokumen secara otomatis seperti:
  - Surat Keterangan Sakit (Sick Leave Certificate)
  - Surat Rujukan (Referral Letter)
- **Dashboard & Analitik**: Visualisasi data kunjungan dan metrik klinik menggunakan grafik interaktif.
- **Sistem Keamanan Data**: Autentikasi dan otorisasi menggunakan Supabase dengan *Row-Level Security* (RLS) untuk melindungi rekam medis pasien.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun dengan arsitektur modern menggunakan:

**Frontend / Client:**
- **Framework**: [React 19](https://react.dev/) dengan [TanStack Start](https://tanstack.com/start) & [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Komponen UI**: [shadcn/ui](https://ui.shadcn.com/) (dibangun di atas [Radix UI](https://www.radix-ui.com/))
- **Manajemen State/Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Form & Validasi**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Visualisasi & Export**: [Recharts](https://recharts.org/), `jspdf`, `xlsx`

**Backend / Database:**
- **BaaS**: [Supabase](https://supabase.com/) (PostgreSQL, Authentication, RLS Policies)

## 📋 Prasyarat

Sebelum memulai pengembangan, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- Paket manajer seperti `npm` atau `bun`
- Akun dan proyek [Supabase](https://supabase.com/)

## ⚙️ Instalasi dan Setup

1. **Kloning Repositori**
   ```bash
   git clone <repository-url>
   cd myortoclinic
   ```

2. **Instalasi Dependensi**
   ```bash
   npm install
   # atau jika menggunakan bun:
   # bun install
   ```

3. **Konfigurasi Environment Variables**
   Buat file `.env` di root direktori berdasarkan `.env.example` (jika ada) atau tambahkan variabel berikut yang terhubung ke proyek Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Jalankan Aplikasi Mode Development**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal (biasanya di `http://localhost:5173`).

## 📜 Skrip Tersedia

Di dalam direktori proyek, Anda dapat menjalankan perintah-perintah berikut:

- `npm run dev`: Menjalankan server pengembangan (Vite).
- `npm run build`: Melakukan proses *build* aplikasi untuk produksi.
- `npm run preview`: Meninjau hasil *build* produksi secara lokal.
- `npm run lint`: Menjalankan ESLint untuk memeriksa masalah pada kode.
- `npm run format`: Menjalankan Prettier untuk merapikan format kode.

## 📂 Struktur Proyek

```text
├── src/
│   ├── components/      # Komponen UI React (shadcn/ui, form klinik, dll)
│   ├── hooks/           # Custom React hooks (misal: untuk fetch data)
│   ├── integrations/    # Konfigurasi layanan pihak ketiga (Supabase types/client)
│   ├── lib/             # Utility functions dan library helpers
│   ├── routes/          # Konfigurasi routing TanStack Router & Halaman
│   ├── styles.css       # File CSS global (Tailwind)
│   ├── router.tsx       # Setup utama TanStack Router
│   ├── start.ts         # Entry point aplikasi (TanStack Start)
│   └── server.ts        # Server entry point
├── supabase/            # Konfigurasi dan migrasi database Supabase
├── public/              # Aset statis yang dapat diakses publik
└── package.json         # Konfigurasi dependensi dan skrip proyek
```

## 🔒 Panduan Supabase & Database

Aplikasi ini menggunakan **Supabase** sebagai sumber kebenaran data (*source of truth*).

- **Tipe Data (Typescript)**: Tipe data database dihasilkan langsung dari Supabase ke dalam direktori `src/integrations/supabase/types.ts`. Jika Anda melakukan perubahan skema di Supabase, pastikan untuk menggenerate ulang tipe ini.
- **Row-Level Security (RLS)**: Pastikan semua tabel baru yang dibuat di Supabase telah mengaktifkan RLS dan memiliki policy yang sesuai agar aplikasi dapat melakukan operasi Read/Write dengan benar.
- **Migrasi**: Semua perubahan skema penting disimpan di dalam folder `supabase/migrations/` sebagai file `.sql`.

## 🎨 Panduan Pengembangan (Styling)

Aplikasi menggunakan pendekatan desain modern:
- Gunakan komponen dari direktori `src/components/ui` yang berbasis `shadcn/ui` untuk konsistensi.
- Gunakan *utility classes* dari Tailwind CSS v4 untuk *styling* kustom.
- Prioritaskan antarmuka yang bersih, responsif, dan mudah digunakan oleh tenaga kesehatan.

---
*Dokumentasi ini dibuat secara otomatis untuk memudahkan onboarding dan pengembangan aplikasi SIKOPI.*
