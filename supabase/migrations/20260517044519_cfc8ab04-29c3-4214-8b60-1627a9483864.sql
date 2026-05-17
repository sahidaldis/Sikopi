
-- MRN sequence
CREATE SEQUENCE IF NOT EXISTS public.mrn_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_mrn()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  n BIGINT;
BEGIN
  n := nextval('public.mrn_seq');
  RETURN 'MR-' || to_char(now(), 'YYYY') || '-' || lpad(n::text, 6, '0');
END;
$$;

-- Patients
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mrn TEXT NOT NULL UNIQUE DEFAULT public.generate_mrn(),
  full_name TEXT NOT NULL,
  national_id TEXT,
  dob DATE,
  gender TEXT,
  address TEXT,
  phone TEXT,
  allergy_flag BOOLEAN NOT NULL DEFAULT false,
  allergy_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER patients_updated_at BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Visits
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  main_complaint TEXT,
  anamnesis TEXT,
  physical_exam TEXT,
  medication TEXT,
  procedures TEXT,
  instructions TEXT,
  final_diagnosis TEXT,
  discharge_condition TEXT,
  followup TEXT,
  tariff NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX visits_patient_idx ON public.visits(patient_id);
CREATE INDEX visits_visited_at_idx ON public.visits(visited_at);

-- CPPT records
CREATE TABLE public.cppt_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL UNIQUE REFERENCES public.visits(id) ON DELETE CASCADE,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  planning TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Billing
CREATE TABLE public.billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL UNIQUE REFERENCES public.visits(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: any authenticated user (single-admin clinic app)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cppt_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth all patients" ON public.patients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth all visits" ON public.visits FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth all cppt" ON public.cppt_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth all billing" ON public.billing FOR ALL TO authenticated USING (true) WITH CHECK (true);
