-- Bring the live Supabase project from the audited permissive policy set to
-- the least-privilege access model used by the website. This migration is
-- intentionally scoped to the six verified public tables and known policies.
-- Review the live policy inventory before applying: it aborts if drift is
-- detected, rather than silently deleting an unreviewed policy.

DO $migration_guard$
DECLARE
  actual_policies text[];
  expected_legacy text[] := ARRAY[
    'citizen_sos_reports.sos_insert_all',
    'citizen_sos_reports.sos_select_all',
    'citizen_sos_reports.sos_update_auth',
    'flood_alerts.alerts_select_all',
    'flood_alerts.alerts_write_auth',
    'monitoring_stations.stations_select_all',
    'monitoring_stations.stations_write_auth',
    'profiles.profiles_insert_own',
    'profiles.profiles_select_all',
    'profiles.profiles_update_own',
    'stage_observations.observations_select_all',
    'supervisory_gates.gates_select_all'
  ];
  expected_final text[] := ARRAY[
    'citizen_sos_reports.sos_insert_own',
    'citizen_sos_reports.sos_select_own',
    'citizen_sos_reports.sos_select_staff',
    'flood_alerts.alerts_select_published',
    'flood_alerts.alerts_select_staff',
    'monitoring_stations.stations_select_public',
    'profiles.profiles_select_own',
    'stage_observations.observations_select_public',
    'supervisory_gates.gates_select_public'
  ];
BEGIN
  IF to_regclass('public.profiles') IS NULL
     OR to_regclass('public.monitoring_stations') IS NULL
     OR to_regclass('public.stage_observations') IS NULL
     OR to_regclass('public.flood_alerts') IS NULL
     OR to_regclass('public.supervisory_gates') IS NULL
     OR to_regclass('public.citizen_sos_reports') IS NULL THEN
    RAISE EXCEPTION 'SURAKSHA schema mismatch: one or more expected public tables are missing';
  END IF;

  SELECT array_agg(format('%s.%s', tablename, policyname) ORDER BY tablename, policyname)
    INTO actual_policies
    FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename = ANY (ARRAY[
       'profiles', 'monitoring_stations', 'stage_observations',
       'flood_alerts', 'supervisory_gates', 'citizen_sos_reports'
     ]);

  IF actual_policies IS DISTINCT FROM expected_legacy
     AND actual_policies IS DISTINCT FROM expected_final THEN
    RAISE EXCEPTION 'SURAKSHA RLS policy drift detected. Expected the audited policy set or this migration''s final policy set; found: %', actual_policies;
  END IF;
END
$migration_guard$;

-- Remove the audited permissive policies and converge safely on the final set
-- if this migration is re-run after a partial/manual application.
DROP POLICY IF EXISTS sos_insert_all ON public.citizen_sos_reports;
DROP POLICY IF EXISTS sos_select_all ON public.citizen_sos_reports;
DROP POLICY IF EXISTS sos_update_auth ON public.citizen_sos_reports;
DROP POLICY IF EXISTS alerts_select_all ON public.flood_alerts;
DROP POLICY IF EXISTS alerts_write_auth ON public.flood_alerts;
DROP POLICY IF EXISTS stations_select_all ON public.monitoring_stations;
DROP POLICY IF EXISTS stations_write_auth ON public.monitoring_stations;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_select_all ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
DROP POLICY IF EXISTS observations_select_all ON public.stage_observations;
DROP POLICY IF EXISTS gates_select_all ON public.supervisory_gates;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS stations_select_public ON public.monitoring_stations;
DROP POLICY IF EXISTS observations_select_public ON public.stage_observations;
DROP POLICY IF EXISTS alerts_select_published ON public.flood_alerts;
DROP POLICY IF EXISTS alerts_select_staff ON public.flood_alerts;
DROP POLICY IF EXISTS gates_select_public ON public.supervisory_gates;
DROP POLICY IF EXISTS sos_select_own ON public.citizen_sos_reports;
DROP POLICY IF EXISTS sos_select_staff ON public.citizen_sos_reports;
DROP POLICY IF EXISTS sos_insert_own ON public.citizen_sos_reports;

-- Use a non-exposed schema for role checks. SECURITY DEFINER avoids recursive
-- profile RLS evaluation; the fixed search_path and qualified references keep
-- object resolution safe. The helper returns only a boolean for auth.uid().
CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA app_private TO authenticated;

CREATE OR REPLACE FUNCTION app_private.user_has_any_role(allowed_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT EXISTS (
    SELECT 1
      FROM public.profiles AS profile
     WHERE profile.id = (SELECT auth.uid())
       AND profile.role = ANY (allowed_roles)
  );
$function$;
REVOKE ALL ON FUNCTION app_private.user_has_any_role(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app_private.user_has_any_role(text[]) TO authenticated;

-- New profiles are always citizens. User-editable auth metadata must never
-- assign an application role. Existing role assignments are left unchanged
-- for explicit, trusted review rather than silently demoting staff accounts.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
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
$function$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- The browser uses the public data only for reads. SOS is the only direct
-- authenticated write supported by the current website contract.
REVOKE ALL PRIVILEGES ON TABLE
  public.profiles,
  public.monitoring_stations,
  public.stage_observations,
  public.flood_alerts,
  public.supervisory_gates,
  public.citizen_sos_reports
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.monitoring_stations, public.stage_observations, public.supervisory_gates
  TO anon, authenticated;
GRANT SELECT ON public.flood_alerts TO anon, authenticated;
GRANT SELECT, INSERT ON public.citizen_sos_reports TO authenticated;

CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY stations_select_public ON public.monitoring_stations
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY observations_select_public ON public.stage_observations
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY alerts_select_published ON public.flood_alerts
  FOR SELECT TO anon, authenticated
  USING (state = 'DISPATCHED');

CREATE POLICY alerts_select_staff ON public.flood_alerts
  FOR SELECT TO authenticated
  USING ((SELECT app_private.user_has_any_role(ARRAY['admin', 'hydrologist', 'operator']::text[])));

CREATE POLICY gates_select_public ON public.supervisory_gates
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY sos_select_own ON public.citizen_sos_reports
  FOR SELECT TO authenticated
  USING (citizen_id = (SELECT auth.uid()));

CREATE POLICY sos_select_staff ON public.citizen_sos_reports
  FOR SELECT TO authenticated
  USING ((SELECT app_private.user_has_any_role(ARRAY['admin', 'operator']::text[])));

CREATE POLICY sos_insert_own ON public.citizen_sos_reports
  FOR INSERT TO authenticated
  WITH CHECK (
    citizen_id = (SELECT auth.uid())
    AND status = 'OPEN'
    AND (SELECT app_private.user_has_any_role(ARRAY['citizen']::text[]))
  );

-- The observed FK columns had no supporting indexes. Tables are small today;
-- normal CREATE INDEX avoids requiring a special non-transactional deploy path.
CREATE INDEX IF NOT EXISTS idx_stage_observations_station_id
  ON public.stage_observations (station_id);
CREATE INDEX IF NOT EXISTS idx_flood_alerts_authorized_by
  ON public.flood_alerts (authorized_by);
CREATE INDEX IF NOT EXISTS idx_citizen_sos_reports_citizen_id
  ON public.citizen_sos_reports (citizen_id);

-- Fail the migration transaction if the access boundary differs from what was
-- intended. These checks cover SQL grants in addition to the row policies.
DO $postcondition$
BEGIN
  IF NOT (
    has_table_privilege('authenticated', 'public.profiles', 'SELECT')
    AND NOT has_table_privilege('anon', 'public.profiles', 'SELECT')
    AND NOT has_table_privilege('authenticated', 'public.profiles', 'UPDATE')
    AND NOT has_table_privilege('authenticated', 'public.profiles', 'INSERT')
    AND has_table_privilege('authenticated', 'public.citizen_sos_reports', 'SELECT')
    AND has_table_privilege('authenticated', 'public.citizen_sos_reports', 'INSERT')
    AND NOT has_table_privilege('anon', 'public.citizen_sos_reports', 'SELECT')
    AND NOT has_table_privilege('anon', 'public.citizen_sos_reports', 'INSERT')
    AND NOT has_table_privilege('authenticated', 'public.citizen_sos_reports', 'UPDATE')
    AND NOT has_table_privilege('authenticated', 'public.monitoring_stations', 'INSERT')
    AND NOT has_table_privilege('authenticated', 'public.flood_alerts', 'UPDATE')
    AND NOT has_function_privilege('anon', 'public.handle_new_user()', 'EXECUTE')
    AND NOT has_function_privilege('authenticated', 'public.handle_new_user()', 'EXECUTE')
  ) THEN
    RAISE EXCEPTION 'SURAKSHA privilege postcondition failed';
  END IF;

  IF EXISTS (
    SELECT 1
      FROM (VALUES
        ('profiles'::text),
        ('monitoring_stations'),
        ('stage_observations'),
        ('flood_alerts'),
        ('supervisory_gates'),
        ('citizen_sos_reports')
      ) AS target(table_name)
     WHERE NOT EXISTS (
       SELECT 1
         FROM pg_class c
         JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relname = target.table_name
          AND c.relrowsecurity
     )
  ) THEN
    RAISE EXCEPTION 'SURAKSHA RLS postcondition failed: RLS must remain enabled on each application table';
  END IF;
END
$postcondition$;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Creates citizen-only profiles for new Supabase Auth users; application roles require trusted provisioning.';
