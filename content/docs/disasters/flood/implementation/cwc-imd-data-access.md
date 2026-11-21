# CWC / IMD Data Access and SURAKSHA Setup

## What the official sites provide

- **NWDP / NWIC** lists CWC hourly level/discharge/rainfall resources and a separate Bihar Water Department hourly level/rainfall feed. The CWC hourly-level catalogue reviewed here does not list the Ganga, while Bihar WRD does publish an hourly level dataset. Verify whether its CSV actually contains the selected Patna/Gandhi Ghat station; dataset presence alone does not prove station coverage. Dataset pages advertise CSV/API resources, but this repository does not yet implement the portal's machine endpoint or have a confirmed refresh/SLA. Do not scrape portal HTML as a production feed.
- **IMD API Management** has registration/login and documents APIs for current weather, rainfall, warnings, and basin quantitative precipitation forecasts. Register and request access; the endpoint requires credentials (an unauthenticated request returned HTTP 401 in the access check). The exact credential/header format should come from your registered portal account.
- **IMD Data Service Portal (DSP)** handles historical station observations. It requires registration and lets the requester choose variables, stations, period, and frequency. Hourly data is only available for selected stations and some requests can be chargeable.
- IMD's **0.25° gridded rainfall archive** is daily historical data suitable for catchment/hindcast work, not an hourly live gauge replacement.
- **Bihar FMISC/WRD** publishes hydrometeorological status and flood forecast products. Ask the department for a supported machine feed before automating those pages.

Official links:

- [NWDP CWC hourly water level](https://nwdp.nwic.gov.in/en/dataset/river-water-level-telemetry-hourly-central-water-commission-cwc)
- [NWDP CWC hourly discharge](https://nwdp.nwic.gov.in/dataset/river-discharge-telemetry-hourly-central-water-commission-cwc)
- [NWDP CWC hourly rainfall](https://nwdp.nwic.gov.in/en/dataset/rainfall-cwc-telemetry-hourly)
- [NWDP Bihar Water Department hourly level](https://nwdp.nwic.gov.in/en/dataset/river-water-level-telemetry-hourly-bihar-water-department)
- [IMD API Management](https://api.imd.gov.in/public/index.php)
- [IMD API reference](https://api.imd.gov.in/public/api_reference.html)
- [IMD Data Service Portal](https://dsp.imdpune.gov.in/)
- [IMD 0.25° daily gridded rainfall](https://www.imdpune.gov.in/cmpg/Griddata/Rainfall_25_NetCDF.html)
- [Bihar FMISC](https://www.fmiscwrdbihar.gov.in/fmis/Default.aspx)

## Set up the local provider adapters

1. On NWDP, begin with the Bihar Water Department telemetry water-level resource and search/download rows for Patna/Gandhi Ghat. Confirm the station exists; the CWC hourly-level catalogue reviewed here does not list Ganga. Use the Bihar WRD rainfall feed or an IMD station only after verifying location and time coverage. The local station registry names `GANGES_PATNA` as Gandhi Ghat, Patna; verify provider spelling/aliases against the CSV.
2. Inspect the CSV header and a few rows. Confirm the time field, units, timestamp timezone, station identifier, and vertical datum. The API must not compare gauge-zero-relative readings against MSL thresholds without the approved offset. Configure the datum only after confirming it with the dataset metadata or provider.
3. Save the CSV resources outside source control and set these local paths in `.env` (or deployment environment):

```dotenv
NWDP_LEVEL_CSV=C:/data/nwdp/bihar_patna_level.csv
NWDP_DISCHARGE_CSV=C:/data/nwdp/patna_discharge.csv
NWDP_RAINFALL_CSV=C:/data/nwdp/bihar_patna_rainfall.csv
NWDP_STATION_ALIASES=Gandhighat,Gandhi Ghat
NWDP_SOURCE_TIMEZONE=Asia/Kolkata
NWDP_LEVEL_DATUM=MSL
```

Use `NWDP_LEVEL_DATUM=MSL` only if the selected CSV value is already referenced to mean sea level. If it is relative to gauge zero, set `NWDP_LEVEL_DATUM=GAUGE_ZERO_RELATIVE` and supply `NWDP_LEVEL_DATUM_OFFSET_M` using the approved datum for that station. Do not guess the offset from another gauge.

4. Register at IMD API Management, subscribe/request the needed API access, and obtain the station identifier for the selected rainfall/weather station. The code reads the IMD API credential server-side:

```dotenv
IMD_STATION_ID=...
IMD_API_TOKEN=...
IMD_API_AUTH_HEADER=Authorization
IMD_API_AUTH_SCHEME=Bearer
```

Adjust header/scheme only to match the instructions from the portal account. Never commit `.env`, print the token, or put it in browser/mobile code.

5. Install the API extra and run the one-shot provider probe from the repository root:

```powershell
python -m pip install -e ".[api]"
python scripts/probe_hydro_providers.py
```

The probe requires both a fresh NWDP stage and fresh rainfall. It returns a record only when it can parse the source; otherwise it reports a sanitized configuration, station, datum, freshness, or provider error. It does not download or scrape the portal itself.

6. Review the API's `/api/v1/flood/health` `provider_configuration` field. It reports configuration only, not live provider health. Polling remains opt-in:

```dotenv
TELEMETRY_POLLING_ENABLED=true
TELEMETRY_POLL_INTERVAL_SECONDS=3600
```

Only enable polling after the CSV refresh mechanism and station/datum mapping are approved. A downloaded NWDP CSV is a static file until something refreshes it. The adapter rejects records older than six hours; stale archived rows will not be treated as live readings. In production, set explicit `CORS_ALLOWED_ORIGINS` and a `SURAKSHA_OPERATOR_API_KEY` of at least 32 characters; operator POST/PUT/PATCH/DELETE calls require `Authorization: Bearer <key>`.

## What this connection currently does and does not provide

The code added in this repository can read explicitly configured NWDP CSV resources and call IMD's authenticated current-weather endpoint for 24-hour rainfall. It can pass a fresh stage/rainfall record into the telemetry scheduler. Polling defaults to off.

This is a first provider integration, not a complete live operational data service:

- NWDP live API onboarding and automatic resource refresh are not configured. The CSV adapter is only live if an approved process refreshes the file. The portal advertises API availability; confirm the supported resource endpoint and access policy with NWIC before implementing polling against it.
- The Bihar WRD file must be checked for exact Gandhi Ghat/Patna and upstream station availability before routing. The code does not infer station equivalence.
- IMD current-weather rainfall gives a 24-hour value, not a 72-hour hourly series. IMD API credentials must be registered and verified; no key is present in this workspace.
- Seven-day rainfall history, discharge coverage, soil moisture, and the model's full 72-hour multivariate feature window are not supplied by this first adapter. Until they are assembled and validated, forecasts must remain explicitly degraded and must not be described as fully live-data-backed.
- A public site or forecast table is not permission to scrape it. Obtain API/feed terms and refresh guarantees from NWIC/CWC, IMD, or Bihar WRD/FMISC for production.
