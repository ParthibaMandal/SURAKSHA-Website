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

Application-level route checks do not mitigate permissive direct database access. Prioritize RLS policy tightening, immutable/privileged role administration, a safe trigger search path, least-privilege function grants, and indexes via reviewed migrations. Then test with anonymous, citizen, operator, and admin sessions.

## Change management

Do not apply ad hoc production SQL. Create versioned migrations in the repository, inspect the exact SQL, validate against a disposable or staging project, and confirm the intended production target and rollback approach before applying. Record resulting migration state. Do not introduce service-role credentials into browser code.
