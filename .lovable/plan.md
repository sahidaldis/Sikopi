# Clinic Management System — Build Plan

A clean, desktop-first web app for a single-doctor private practice. Modern medical UI in white / blue / gray, sticky sidebar, top navbar, fast forms, simple reports.

## 1. Stack & Setup

- React + TanStack Start (project's existing framework) + Tailwind CSS v4 + shadcn/ui
- Lovable Cloud (Supabase) for DB + Auth
- Recharts for charts, react-hook-form + zod for forms, sonner for toasts
- jsPDF + xlsx for export

## 2. Authentication

- Enable Lovable Cloud, email/password auth (single admin account; signup disabled in UI after first user, or pre-seeded)
- `/login` public route
- `_authenticated` layout route guarding all app routes
- Logout in top navbar
- Session restored via `supabase.auth.onAuthStateChange`

## 3. Layout

- `_authenticated.tsx` renders: top navbar (clinic name + user menu + logout) + sticky left sidebar + main content
- Sidebar items: Dashboard, Patients, Reports
- Desktop-optimized widths; tables and forms tuned for >=1280px

## 4. Routes

```text
/login
/                         → Dashboard (two big cards: New Patient / Existing Patient)
/patients/new             → New patient + first visit form (8 sections)
/patients                 → Patients table (search, sort, paginate, edit, delete)
/patients/$id             → Patient detail (demographics, timeline, CPPT, billing, meds)
/patients/$id/visits/new  → Add visit for existing patient (sections 2–8)
/reports                  → Reports dashboard with filters + tabs
```

## 5. Database (Supabase)

```text
patients
  id (uuid pk), mrn (text unique, auto: e.g. MR-2026-000001),
  full_name, national_id, dob (date), gender,
  address, phone, allergy_flag (bool), allergy_details,
  created_at, updated_at

visits
  id (uuid pk), patient_id (fk → patients on delete cascade),
  visited_at (timestamptz),
  main_complaint, anamnesis,
  physical_exam,
  medication, procedures, instructions,
  final_diagnosis, discharge_condition, followup,
  tariff (numeric), created_at

cppt_records
  id, visit_id (fk unique), subjective, objective, assessment, planning

billing
  id, visit_id (fk unique), amount (numeric), created_at
```

RLS: enable on all tables; policy = `auth.uid() IS NOT NULL` (single-admin app, no per-user scoping needed). MRN generated via Postgres sequence + trigger.

## 6. New Patient Flow

Single page with 8 collapsible sections matching spec exactly:
1. Identity  2. Clinical Notes  3. Allergy (conditional details)  4. Physical Exam  5. CPPT (S/O/A/P)  6. Medication & Actions  7. Resume  8. Billing (manual tariff)

On Save: insert `patients` → insert `visits` → insert `cppt_records` + `billing` → toast → redirect to `/patients`. Cancel returns to dashboard.

## 7. Existing Patient Flow

Dashboard "Existing Patient" card opens a search modal (by MRN or by name+address). Selecting a result navigates to `/patients/$id`. Detail page shows demographics card + tabs: Timeline | Examinations | CPPT | Billing | Medications, plus "Add Visit" button.

## 8. Patients Menu

Table with: MRN, Name, Gender, Phone, Last Visit. Debounced search, column sort, pagination (10/page), row actions: View / Edit / Delete (confirm modal).

## 9. Reports

Filter bar: Daily / Weekly / Monthly / Custom range. Tabs:
- **Financial**: KPI cards (Total Revenue, Transactions, Avg/Patient) + revenue line chart + table
- **Top Diagnoses**: bar + pie + ranking table (parsed from `final_diagnosis`)
- **Patient Stats**: totals, new vs returning, gender donut, age distribution, daily visits line
- **Visits**: total, per-day, busiest days, avg visits/patient
- **Billing**: history table, totals per period

Export buttons: PDF (jsPDF), Excel (xlsx), Print (window.print on report area).

## 10. UX Details

Skeletons during loads, empty states with illustrations/icons, sonner toasts on every mutation, confirm dialogs for delete, zod validation with inline errors, debounced search inputs (300ms).

## 11. Design Tokens

`src/styles.css` updated with medical palette in oklch:
- background: near-white
- primary: clinical blue (~#2563EB)
- muted/sidebar: cool gray
- accent + success/destructive tuned for medical context
Typography: Inter (body), slightly tighter for tables.

## Technical Notes

- All Supabase mutations via `createServerFn` with `requireSupabaseAuth` where appropriate; reads from authed components use the browser client directly (RLS allows any logged-in user).
- MRN generation in Postgres trigger to avoid race conditions.
- Charts: Recharts, themed via CSS variables.
- No multi-doctor, no roles table needed (single admin).

## Clarifications (optional — can proceed with defaults)

1. Pre-seed an admin account or allow first-time signup then disable? Default: allow signup once, then hide signup.
2. Language: UI in English (spec is bilingual EN/ID). Default: English with Indonesian field labels where the spec used them (e.g. "No. KTP").
3. Currency for billing: IDR (Rp) formatting. Confirm or specify.

Ready to build on approval.