# Database Notes: Supabase Postgres

This website uses Supabase Auth and Postgres. This document records the tables observed in the live project and known security gaps; it is not a generated schema or migration. No MySQL schema, SQLite fallback, or ORM database described by older documentation is part of this website's current architecture.

## Observed tables

The connected project contains `profiles`, `monitoring_stations`, `stage_observations`, `flood_alerts`, `supervisory_gates`, and `citizen_sos_reports`. The engine may have separate persistence; no shared database contract is established here.

The website currently relies on `profiles.role` for workspace authorization and on `citizen_sos_reports` for citizen submissions and the restricted operations queue. SOS inserts include the session user's ID, contact and location details, urgency, description, and an initial `OPEN` status. See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for route behavior.

## Live security audit findings

The read-only audit found Row Level Security enabled, but broad policies remain and must be treated as unresolved production risks:

- SOS reports had public SELECT and INSERT policies.
- Users could update their own profile broadly, including the role field.
- Any authenticated user could write monitoring stations and flood alerts.
- A trigger function used `SECURITY DEFINER` with a mutable search path and executable permissions that need review.
- Some foreign key columns lacked supporting indexes.
- PostGIS was not enabled, and the project had no Supabase migration history at audit time.

A forward migration is now prepared at `supabase/migrations/20261124090000_lock_down_public_data_access.sql`. It is guarded against unexpected policy drift, fixes the profile creation trigger so auth metadata cannot assign roles, removes broad client grants, applies least-privilege policies, and adds the three missing foreign-key indexes. It has **not** been applied to production or tested against a disposable database. The migration leaves existing profile roles unchanged for trusted review; the read-only check found one citizen profile and no role-bearing user metadata.

Application-level route checks do not mitigate permissive direct database access. Prioritize RLS policy tightening, immutable/privileged role administration, a safe trigger search path, least-privilege function grants, and indexes via reviewed migrations. Then test with anonymous, citizen, operator, and admin sessions.

## Change management

Do not apply ad hoc production SQL. Inspect the exact migration, validate against a disposable or staging project, and confirm the intended production target and rollback approach before applying. Record resulting migration state. The live auth setting for leaked-password protection is a separate dashboard configuration finding and is not changed by the SQL migration. Do not introduce service-role credentials into browser code.
