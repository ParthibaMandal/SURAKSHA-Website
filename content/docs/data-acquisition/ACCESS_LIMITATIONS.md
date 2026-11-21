# Access Limitations and Safe Use

These are the observed limits from SURAKSHA’s REA reconnaissance on 2026-11-09. See [REA_RECONNAISSANCE_REPORT.md](/docs?doc=05-data-engineering--rea-reconnaissance-report) and [DISCOVERED_ENDPOINTS.md](/docs?doc=05-data-engineering--discovered-endpoints) for evidence IDs and endpoint details.

## Authentication and access boundaries

- **NWDP:** The listed Bihar CSV and the tested CKAN `datastore_search` read returned HTTP 200 without credentials. This confirms public read access for the tested route, not a reuse license, rate limit, freshness guarantee, or production support commitment. No write or administrative routes were tested.
- **CWC FFS:** Its public UI made same-origin API GET calls that returned HTTP 200 without a visible login flow. These are reverse-engineered routes, not a documented contract. Do not probe write methods or assume route stability. Confirm permitted automation and API terms with CWC.
- **CWC stage metadata:** Station-specific HTTP 200 aggregate rows are now captured for Gandhi Ghat and four nearby gauges, but values omit unit and timezone. Gandhi's station record reports `reducedLevelOfZeroGauge: null` and `zeroRl: 0`, which does not establish an absolute gauge datum. Latest captured row is timestamped `2026-11-09T13:00:00` with no timezone; it cannot be labelled live on Nov 10.
- **FMISC RTDAS:** Clicking the public map's `Downloads` link redirected to `/login` in an isolated browser. No credentials were attempted and no protected data was accessed. The published RTDAS URL uses plain HTTP at an IP address. Do not send credentials, personal information, or operational data through that route. Ask FMISC/WRD for a secure HTTPS interface and an authorized data export.
- **FMISC River Watch:** The FMISC home page links through a `login.aspx` route. No login was attempted and no protected data was inspected.
- **Bihar WRD official display:** The requested page returned a 500 error in the capture. This is an availability failure at capture time, not evidence that the service or data has been retired.
- **Barrage table:** `irrigation.befiqr.in` is not a government domain even though the page identifies WRD Bihar and labels a source as SCADA. Treat as third-party corroboration only until WRD independently confirms provenance, endpoint access, and reuse terms.
- **IMD:** The official portal presents registration/login and API-reference links. Earlier unauthenticated calls to IMD data endpoints returned HTTP 401. Do not evade authentication; obtain account approval and credentials through IMD, then configure secrets outside source control.
- **Nepal DHM:** The public rainfall-watch page and selected public fetches were observed. Socket.IO payloads, data ownership/terms, and station suitability for Bihar were not established. One malformed `https://https/socket.io/` URL failed; it was not treated as a feed.

## REA observation limits

- Browser captures record only the declared page/action window. Missing requests are not proof that no endpoint exists.
- CWC responses include a 248,678-byte aggregate body that exceeded the initial 65,536-byte response-retention limit. A later targeted request did not produce a retained body; therefore no CWC target values were extracted.
- Some CWC response bodies were evicted from the inspector cache before REA could retain them. Request metadata and HTTP status remain useful, but do not provide the missing record contents.
- The RTDAS page showed browser errors involving DataTables and event handlers. The visible map/control state may be incomplete in the isolated Chromium run.
- NWDP exact filters and full-text searches covered one 2026–2030 resource and the tested spellings. They do not cover other date-range resources, aliases, provider station codes, or other departments.
- The NWDP historical-resource follow-up is still incomplete; prior report identifies 1961–1990, 1991–2020, and 2021–2025 resources, but no named target was confirmed in those resources in this pass.
- NWDP’s 2026–2030 resource is labeled “Hourly”, but sample row timestamps are five minutes apart. Its source timezone, observation-vs-acquisition semantics, datum, update schedule, request limits, and availability guarantees remain unknown.
- The latest NWDP row was selected by descending record `_id`; `_id` is not documented as a chronological key. Confirm using the timestamp field before production.
- No connector, scheduler, automatic polling job, or database write was created during this reconnaissance.

## Operational safeguards

1. Keep credentials and API keys in the deployment secret store or ignored local environment file; never add captured cookies, tokens, or request secrets to these reports.
2. Treat any endpoint that requires a login, token, subscription, VPN, or access approval as unavailable until that authorization is granted. Do not bypass it.
3. Before scheduling reads, obtain the provider’s permitted request frequency, API/data reuse terms, data-retention rules, and contact for outages.
4. Mark data `LIVE` only using an agreed reporting interval and confirmed timezone; otherwise label it `DELAYED`, `STALE`, or `UNKNOWN` and show source time.
5. Do not mix gauge-zero-relative stage with MSL thresholds unless the provider supplies the approved datum offset for that station.
6. Do not substitute modeled GloFAS/Open-Meteo discharge or another station’s reading for Gandhi Ghat stage. Keep modeled forecasts separately labeled.
