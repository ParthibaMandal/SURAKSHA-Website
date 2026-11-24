-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'citizen',
  jurisdiction_sector TEXT DEFAULT 'Patna Reach',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Monitoring Stations Table
CREATE TABLE IF NOT EXISTS public.monitoring_stations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  river TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  warning_level DOUBLE PRECISION NOT NULL,
  danger_level DOUBLE PRECISION NOT NULL,
  current_stage DOUBLE PRECISION NOT NULL,
  trend TEXT NOT NULL DEFAULT '+0.00 m / 6h',
  status TEXT NOT NULL DEFAULT 'NOMINAL',
  data_source TEXT NOT NULL DEFAULT 'CWC Telemetry',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Stage Observations Table
CREATE TABLE IF NOT EXISTS public.stage_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id TEXT NOT NULL REFERENCES public.monitoring_stations(id) ON DELETE CASCADE,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  stage_value DOUBLE PRECISION NOT NULL,
  discharge_cumecs DOUBLE PRECISION,
  quality_flag TEXT DEFAULT 'VERIFIED'
);

-- 4. Flood Alerts Table (CAP v1.2 Protocol)
CREATE TABLE IF NOT EXISTS public.flood_alerts (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  sender TEXT NOT NULL DEFAULT 'SURAKSHA Central Command',
  status TEXT NOT NULL DEFAULT 'Actual',
  msg_type TEXT NOT NULL DEFAULT 'Alert',
  scope TEXT NOT NULL DEFAULT 'Public',
  severity TEXT NOT NULL DEFAULT 'Moderate',
  urgency TEXT NOT NULL DEFAULT 'Expected',
  certainty TEXT NOT NULL DEFAULT 'Observed',
  event TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  instruction TEXT,
  area_desc TEXT NOT NULL,
  authorized_by UUID REFERENCES public.profiles(id),
  state TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Supervisory Verification Gates Table
CREATE TABLE IF NOT EXISTS public.supervisory_gates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PASSED',
  metric_label TEXT NOT NULL,
  metric_value TEXT NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Citizen SOS Emergency Reports Table
CREATE TABLE IF NOT EXISTS public.citizen_sos_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  citizen_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  urgency TEXT NOT NULL DEFAULT 'HIGH',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flood_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisory_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_sos_reports ENABLE ROW LEVEL SECURITY;

-- Roles are provisioned by a trusted operator; a user's editable auth metadata
-- must never assign their own elevated role.
CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA app_private TO authenticated;

CREATE OR REPLACE FUNCTION app_private.user_has_any_role(allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS profile
    WHERE profile.id = (SELECT auth.uid())
      AND profile.role = ANY (allowed_roles)
  );
$$;
REVOKE ALL ON FUNCTION app_private.user_has_any_role(TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app_private.user_has_any_role(TEXT[]) TO authenticated;

-- Profiles are private to their owner. Writes to role/email are reserved for
-- trusted server-side provisioning and the auth trigger.
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));

-- Monitoring Stations Policies
CREATE POLICY "stations_select_public" ON public.monitoring_stations
  FOR SELECT TO anon, authenticated USING (true);

-- Stage Observations Policies
CREATE POLICY "observations_select_public" ON public.stage_observations
  FOR SELECT TO anon, authenticated USING (true);

-- Flood Alerts Policies
CREATE POLICY "alerts_select_published" ON public.flood_alerts
  FOR SELECT TO anon, authenticated USING (state = 'DISPATCHED');
CREATE POLICY "alerts_select_staff" ON public.flood_alerts
  FOR SELECT TO authenticated USING (app_private.user_has_any_role(ARRAY['admin', 'hydrologist', 'operator']));
CREATE POLICY "alerts_update_admin" ON public.flood_alerts
  FOR UPDATE TO authenticated
  USING (app_private.user_has_any_role(ARRAY['admin']) AND state = 'PENDING_REVIEW')
  WITH CHECK (app_private.user_has_any_role(ARRAY['admin']) AND state IN ('APPROVED', 'REJECTED'));

-- Supervisory Gates Policies
CREATE POLICY "gates_select_public" ON public.supervisory_gates
  FOR SELECT TO anon, authenticated USING (true);

-- Citizen SOS Reports Policies
CREATE POLICY "sos_select_own" ON public.citizen_sos_reports
  FOR SELECT TO authenticated USING (citizen_id = (SELECT auth.uid()));
CREATE POLICY "sos_select_staff" ON public.citizen_sos_reports
  FOR SELECT TO authenticated USING (app_private.user_has_any_role(ARRAY['admin', 'operator']));
CREATE POLICY "sos_insert_own" ON public.citizen_sos_reports
  FOR INSERT TO authenticated
  WITH CHECK (citizen_id IS NOT NULL AND citizen_id = (SELECT auth.uid()));

-- Function and Trigger for Automatic User Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'citizen'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Seed Data: Core Ganga Basin Stations
INSERT INTO public.monitoring_stations (id, name, river, latitude, longitude, warning_level, danger_level, current_stage, trend, status, data_source)
VALUES
  ('STN-PAT-01', 'Patna · Digha Ghat', 'Ganga Mainstream', 25.6322, 85.0934, 50.50, 51.80, 49.82, '+0.42 m / 6h', 'NOMINAL', 'CWC Verified Telemetry'),
  ('STN-PAT-02', 'Patna · Gandhi Ghat', 'Ganga Mainstream', 25.6208, 85.1724, 49.50, 50.80, 48.95, '+0.28 m / 6h', 'NOMINAL', 'CWC Verified Telemetry'),
  ('STN-GAN-01', 'Lalganj Gauge', 'Gandak Tributary', 25.8672, 85.1789, 52.00, 53.20, 52.40, '+1.15 m / 6h', 'WARNING', 'WRD Bihar Sensor Network'),
  ('STN-SON-01', 'Koelwar Reach', 'Son Sub-basin', 25.5861, 84.7967, 53.50, 54.80, 53.12, '+0.85 m / 6h', 'ADVISORY', 'CWC Telemetry Feed'),
  ('STN-PUN-01', 'Sripalpur Gauge', 'Punpun River', 25.5123, 85.1432, 51.00, 52.00, 50.60, '+0.15 m / 6h', 'NOMINAL', 'CWC Verified Telemetry'),
  ('STN-MOK-04', 'Hathidah Downstream', 'Ganga Mainstream', 25.3683, 85.9678, 48.60, 49.80, 47.90, '+0.19 m / 6h', 'NOMINAL', 'CWC Gauge Station')
ON CONFLICT (id) DO NOTHING;

-- Seed Data: Supervisory Verification Gates
INSERT INTO public.supervisory_gates (id, name, description, status, metric_label, metric_value)
VALUES
  ('GATE-01', 'Pre-Run Ingestion Integrity', 'Sensor completeness, spike rejection, and boundary continuity verified across 8 gauges.', 'PASSED', 'Latency', '38s'),
  ('GATE-02', 'Mid-Run Physics & Mass Conservation', 'Mass conservation holds (C=0.82); ensemble spread in Gandak sector within tolerance.', 'REVIEW', 'Spread', '±0.42m'),
  ('GATE-03', 'Post-Run Evidence & Inundation Plausibility', 'Inundation claims cross-checked against DEM terrain constraints and SAR backscatter.', 'PASSED', 'NSE Score', '0.89')
ON CONFLICT (id) DO NOTHING;

-- Seed Data: Initial CAP Alerts
INSERT INTO public.flood_alerts (id, identifier, sender, status, msg_type, scope, severity, urgency, certainty, event, headline, description, instruction, area_desc, state)
VALUES
  ('CAP-2026-PAT-09', 'IN-BH-PAT-2026-09', 'SURAKSHA Middle Ganga Command', 'Actual', 'Alert', 'Public', 'Moderate', 'Expected', 'Likely', 'River Stage Watch', 'River Stage Watch · Patna Lowland Corridor (Wards 01–12)', 'Upstream Sone confluence inflow is raising river stage toward the 50.50 m warning mark over the next 24 hours.', 'Keep ground-floor valuables elevated. Monitor official SURAKSHA public channel.', 'Patna Lowland Corridor (Wards 01–12)', 'APPROVED'),
  ('CAP-2026-204', 'IN-BH-GAN-2026-04', 'SURAKSHA Central Command', 'Actual', 'Alert', 'Public', 'Severe', 'Immediate', 'Observed', 'Tributary Flash Surge', 'Gandak Confluence Rapid Stage Rise Advisory', 'Rapid upstream release detected at Lalganj gauge. Discharge velocity exceeds threshold.', 'Deploy local embankment monitoring teams immediately.', 'Lalganj – Hajipur Sector', 'PENDING_REVIEW'),
  ('CAP-2026-203', 'IN-BH-PAT-2026-03', 'SURAKSHA Central Command', 'Actual', 'Alert', 'Public', 'Moderate', 'Expected', 'Likely', 'Middle Ganga Basin Bulletin', 'Middle Ganga Lowland Watch Bulletin', 'Normal monsoon inflow with controlled dam discharge.', 'Maintain routine gauge readings.', 'Patna Study Area (Digha to Gandhi Ghat)', 'DISPATCHED')
ON CONFLICT (id) DO NOTHING;

