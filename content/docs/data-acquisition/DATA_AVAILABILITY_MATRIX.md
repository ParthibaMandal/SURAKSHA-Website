# Data Availability Matrix

Snapshot from public REA reconnaissance on 2026-11-09/10. “Observed” means visible or returned in the captured public request; it does not certify provider support for production reuse.

| Requested information | NWDP Bihar telemetry | CWC Flood Forecast | FMISC / RTDAS | Bihar WRD / barrage display | IMD / Nepal DHM | Current conclusion |
|---|---|---|---|---|---|---|
| Gandhi Ghat stage | Exact/full-text returned 0 rows in 2026–2030; bounded queries also returned 0 in 1991–2020 and 2021–2025 | `Gandhighat`, `003-MGD5PTN`; 45.14 at `2026-11-09T13:00:00` | Public AWLG UI; Downloads redirects to `/login` | No official government table result; third-party panel is for barrages | Not applicable | CWC row obtained; unit/timezone/datum omitted, freshness unknown; not verified live on Nov 10. |
| Digha Ghat stage | Exact/full-text returned 0 rows in 2026–2030; bounded queries also returned 0 in 1991–2020 and 2021–2025 | Station `Dighaghat`, `002-MGD5PTN`; stage not retrieved | No public observation; Downloads redirects to login | Not applicable | Not applicable | Station identity verified; stage unavailable. |
| Hathidah stage | Exact/full-text returned 0 rows in 2026–2030; bounded queries also returned 0 in 1991–2020 and 2021–2025 | `004-MGD5PTN`; 38.15 at `2026-11-09T13:00:00` | No public observation captured | Not applicable | Not applicable | CWC row obtained; metadata omitted, freshness unknown. |
| Buxar stage | Exact/full-text returned 0 rows in 2026–2030; bounded queries also returned 0 in 1991–2020 and 2021–2025 | `001-MGD5PTN`; 52.42 at `2026-11-09T13:00:00` | No public observation captured | Not applicable | Not applicable | CWC row obtained; metadata omitted, freshness unknown. |
| Hajipur stage | Exact/full-text returned 0 rows in 2026–2030; bounded queries also returned 0 in 1991–2020 and 2021–2025 | `011-MGD5PTN`; 46.41 at `2026-11-09T13:00:00` | No public observation captured | Not applicable | Not applicable | CWC row obtained; metadata omitted, freshness unknown. |
| Sripalpur stage | Exact/full-text returned 0 rows in 2026–2030; bounded queries also returned 0 in 1991–2020 and 2021–2025 | `021-mgd5ptn`; 46.70 at `2026-11-09T13:00:00` | No public observation captured | Not applicable | Not applicable | CWC row obtained; metadata omitted, freshness unknown. |
| Other Bihar water level | Public datastore returned 103,814 rows; latest-by-ID sample Tarabari_1 = 47.81 m, source time 8 Nov 2026 23:00 | Level observation route returned HTTP 200; body too large to retain | UI indicates AWLG layer and downloads, but data feed not isolated | Government page returned 500 | — | Structured readings exist, but station/date/datum fields need validation before use. |
| Indrapuri discharge | Not established from inspected level resource | No discharge value captured | No RTDAS value captured | Third-party-hosted SCADA-labelled 19,065.4 cusec at 2026-11-09 22:28:19 | — | Reconnaissance lead only. |
| Valmikinagar discharge | Not established | No value captured | No value captured | Third-party-hosted SCADA-labelled 416,000 cusec at 2026-09-28 12:00 | Nepal hydrology may provide upstream context, but no linkage validated | Stale/unverified lead. |
| Birpur discharge | Not established | No value captured | No value captured | Third-party table returned `N/A` | — | No reading available. |
| Bihar rainfall observations | Not tested in this resource | CWC map UI has level/inflow layers, not rainfall from observed capture | RTDAS interface includes ARG category; no values retrieved | Third-party nav includes rainfall table links; no data test | IMD requires approved API credentials; Nepal rainfall table is public | Some public rain products exist; no approved Bihar machine feed verified. |
| IMD warnings / forecasts | — | CWC is separate | — | — | — | IMD portal registration/login is visible; unauthenticated API checks previously returned 401. |
| Nepal rainfall | — | — | FMISC links Nepal hydromet products | Third-party navigation links Nepal rainfall | Official page showed 1/3/6/12/24-hour totals and status | Public page data visible; reusable row endpoint and station relevance remain unknown. |
| Satellite flood extent | Not investigated | Map layers only | FMISC links MODIS river status | Not investigated | Flood hazard map navigation exists | No automated ingestion path validated. |

## Freshness and quality observations

- The NWDP dataset resource title says “Telemetry Hourly”, but sample records carry times only five minutes apart. A row’s source timestamp is available, but timezone and refresh SLA are not.
- The latest record was selected by descending `_id`, not by a provider-documented timestamp index. Verify freshness by parsing and sorting the source timestamp after confirming its timezone and monotonicity.
- The NWDP package lists 1961–1990, 1991–2020, 2021–2025, and 2026–2030 resources. Bounded queries for all six target roots returned zero for 1991–2020 and 2021–2025; exact `Gandhighat` returned zero in 1961–1990. Other aliases in 1961–1990 and a complete station inventory remain unverified.
- NWDP returned `River=-` and zeros for gauge-zero/mean-sea-level fields on the sample station. Do not interpret zero as a verified datum.
- CWC station summaries return an unzoned timestamp and a numeric value without unit/datum metadata. The current captured rows are from 2026-11-09 13:00 (timezone not stated); they are not verified live observations for 2026-11-10.
- RTDAS `Downloads` redirected to `/login` in a public isolated session. The captured flow does not establish whether downloads are credential-protected or if another public export exists.
- The barrage dashboard’s Valmikinagar timestamp was 2026-09-28; Birpur had no value. A SCADA label alone is not provenance verification.
- The Nepal rainfall page advertises its own “Last updated” time and rainfall windows, but it is not a Bihar river-stage feed.

## Data required before backend integration

For every observation retain provider, stable station ID, canonical station, parameter, value, unit, source timestamp, timezone, fetched timestamp, datum/reference, quality, and response provenance. Compute LIVE/DELAYED/STALE only after the source cadence and expected refresh interval have been confirmed. Keep missing values null and expose source age to the UI.
