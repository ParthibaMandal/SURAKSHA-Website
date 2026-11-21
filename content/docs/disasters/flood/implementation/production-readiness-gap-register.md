# Flood subsystem production readiness gap register

This register separates code changes in the current integration pass from the
external evidence and engineering work still required before operational use.
Credentials alone do not make the current warning pipeline production-ready.

## Completed in the current integration pass

- CWC/NWDP CSV and authenticated IMD current-weather adapters preserve source,
  station, timestamps, units, and record IDs; provider failures do not create
  synthetic observations.
- Provider rows are checked for parseable timestamps, freshness, future times,
  broad physical stage range, station identity, and level datum configuration.
- The scheduler rejects unknown stations, non-finite/negative measurements,
  stale/future records, and duplicate/out-of-order readings. Its stop event can
  interrupt the wait rather than waiting for the full hourly poll interval.
- API pipeline requests use an explicit station registry entry and either
  supplied stage or a fresh configured observation. Missing provider data yields
  HTTP 503; unknown stations yield 404. Input ranges and request fields are
  validated.
- Production CORS requires explicit origins, and operator write endpoints
  require a bearer key in production. Health reports configuration only and
  does not claim the providers are live.
- Polling stays disabled by default and fails fast at startup if enabled without
  valid source files, verified datum configuration, and a rainfall source.
- Open-Meteo/GloFAS is available through a separate cached read-only endpoint;
  its daily discharge remains labelled modelled and is not substituted for gauge
  data or used automatically to trigger alerts.

## Required before connecting real data

1. **Confirm a target station.** The CWC hourly level catalogue reviewed for
   this project does not list the Ganga. NWDP lists a Bihar Water Department
   hourly telemetry level dataset. Verify that its resource contains Gandhi
   Ghat/Patna (or choose an explicitly approved equivalent) and establish exact
   upstream station IDs. Do not infer station equivalence from river/district.
2. **Confirm source metadata.** Inspect actual CSV fields, source timestamps and
   timezone, unit, vertical datum, station aliases, update cadence, license, and
   historical-vs-current coverage. Verify the local warning/danger marks and
   `zero_datum_m` against an authoritative source; do not copy values from a
   different gauge.
3. **Obtain feed access.** The current NWDP adapter reads local CSV files. It
   does not implement the portal's advertised machine API or refresh files. Get
   the supported endpoint/authentication and availability guarantees from NWIC
   or Bihar WRD before implementing a remote polling adapter. IMD current
   rainfall needs the user's registered API credential, accepted auth format,
   and a verified station ID.
   Open-Meteo's public Flood API needs no key for eligible non-commercial use,
   but production must preserve CC BY 4.0 attribution, stay within the published
   call limits, and validate that the 5 km cell represents the target river.
4. **Configure secrets outside source control.** Use deployment secrets for
   IMD credentials and the SURAKSHA operator key; configure station/file paths,
   aliases, timezone, vertical datum/offset, CORS origins, and poll interval in
   the deployment environment. Never commit real values to `.env.example`.

## Remaining code and model work

- The flood workflow still contains illustrative/fallback values outside the
  provider layer. Examples include the forecast extrapolation fallback in
  `agents/forecast_agent.py`, fixed risk features in `agents/risk_agent.py`,
  and a default inundation extent/shelter inventory in `agents/impact_agent.py`.
  These need to be replaced with trained, station-specific, traceable inputs or
  explicitly unavailable outputs before any risk score, forecast consequence,
  or public alert is represented as operational.
- Training/validation data, model versioning, calibration and hindcast evidence
  have not been verified in this integration pass. A token cannot replace these
  requirements.
- The scheduler's histories and alert recommendations are in memory. A
  restart-safe store, retry/backoff policy, monitoring/metrics, and operator
  acknowledgement/audit trail are still needed for a deployed 24/7 service.
- CAP output is restricted to a draft recommendation and now requires a real
  stage, danger mark, and forecast. Authorized human review, actual
  distribution through the approved alerting channel, delivery receipts, and
  correction/cancellation procedures are not connected here.
- Deployment-level TLS, secret rotation, abuse/rate limits, data retention and
  privacy controls, backup/restore, and disaster-recovery procedures need to be
  configured and reviewed for the chosen host.

## Release gate

Do not label this subsystem operational or enable public warning automation
until station and threshold provenance are signed off, live feed reachability
and freshness are observed, model validation is documented, stale/provider
failure behavior is exercised, and the authorized alerting workflow is reviewed.
