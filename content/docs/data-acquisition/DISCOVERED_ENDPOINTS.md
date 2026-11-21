# Discovered Data Endpoints

Status reflects tests made during the 2026-11-09/10 REA reconnaissance. A route observed in a website is not automatically a supported production API.

## Public structured interfaces

| Provider | Method and endpoint | Authentication observed | Result and fields | Limits / evidence |
|---|---|---|---|---|
| NWDP / Bihar Water Department | `GET https://nwdp.nwic.gov.in/api/3/action/datastore_search?resource_id=a169bbc1-0b1b-4c90-beaa-18948460407c&limit=5` | None for tested request | HTTP 200; JSON; `success=true`, `total=103814`. Fields include `_id`, `Station`, `Agency`, `State`, `District`, `River`, coordinates, `RL_of_zeroGauge`, `MeanSeaLevel`, `Data Acquisition Time`, and `River Water Level Telemetry Hourly (meter)`. | Public read confirmed. Tested resource is 2026–2030. No paging/limit ceiling or service SLA assessed. Evidence `ev_6eee359e723d90044bcdf9905d733c7cf22d624211ce4ed8a87e8f57ab379e97`. |
| NWDP / Bihar Water Department | `GET https://nwdp.nwic.gov.in/api/3/action/datastore_search?resource_id=a169bbc1-0b1b-4c90-beaa-18948460407c&sort=_id%20desc&limit=5` | None for tested request | HTTP 200; most recent returned row by `_id` was Tarabari_1, Kishanganj, `47.81` m at `08-11-2026 23:00`; river `-`; datum fields `0`; discharge availability `No`. | Sort-by-ID is not a guaranteed time sort; timestamp timezone and datum are unknown. Evidence `ev_8cccf2e2a217466f48ccb25662e92eae5966cb157b8a9429b0068828448ce580`. |
| NWDP / Bihar Water Department | `GET https://nwdp.nwic.gov.in/api/3/action/datastore_search?resource_id=a169bbc1-0b1b-4c90-beaa-18948460407c&filters=%7B%22Station%22%3A%22Gandhi%20Ghat%22%7D&limit=5` (same pattern tested for seven names) | None for tested request | HTTP 200 JSON; `total=0` for Gandhi Ghat, Gandhighat, Digha Ghat, Hathidah, Buxar, Hajipur, and Sripalpur. | Exact filter only against this one resource. Evidence `ev_10ee9a4d2ecd1b19d404cef696b775d3a3449861d555d3c6eaca0109bb3a2f68`. |
| NWDP / Bihar Water Department | `GET https://nwdp.nwic.gov.in/dataset/a9f05d4d-aa2e-4671-baff-b461760ec89e/resource/a169bbc1-0b1b-4c90-beaa-18948460407c/download/rwl_tel_hr_bihar_999_2026_2030.csv` | None for tested HEAD | CSV download URL is advertised on the resource page; HEAD returned HTTP 200. | Full CSV body was not downloaded in this reconnaissance. Evidence `ev_3e714e7bba32fbeb6aec6b6477c6bb344ddee9405c7a237de4e634fe823f90b2`, `ev_597641842bf13b4beb964dee700a26a3d52f935badbe5f6e184d1ae8cdac5094`. |
| NWDP portal | `GET https://nwdp.nwic.gov.in/api/i18n/en` | None for observed page request | HTTP 200 JSON localization payload; not hydrological data. | Excluded from ingestion candidates. Evidence `ev_9a7ff1b46286666489d972fd4f8593faacf377873f0e6ca266e77e8f5cdb9d63`. |
| NWDP / Bihar Water Department | `GET https://nwdp.nwic.gov.in/api/3/action/package_show?id=a9f05d4d-aa2e-4671-baff-b461760ec89e` | None for tested public GET | Package metadata identifies four CSV resources: 1961–1990 (1,901 bytes), 1991–2020 (27,143 bytes), 2021–2025 (98,028,425 bytes), and 2026–2030 (12,228,387 bytes). All report datastore active; the 2021–2025 resource says its datastore does not contain all source-file records. | Metadata only; do not equate listed size with downloadable payload or completeness. Evidence `ev_c01d42d9ac9c89181ce224de9d6869179ef7442452d4b80c198e87d58193f693`. |
| NWDP / Bihar Water Department | `GET https://nwdp.nwic.gov.in/api/3/action/datastore_search` against resources `cff78f20-321e-4413-bf68-4ec8dae9ca12` (1991–2020) and `9a38ae73-cdea-451d-a431-538fa2e3ac09` (2021–2025), with bounded `q` searches for Gandhi, Digha, Hathidah, Buxar, Hajipur, and Sripalpur | None for tested public GETs | Each query returned `success=true`, `total=0`. Exact `Station=Gandhighat` filter also returned 0 in the 1961–1990 and 1991–2020 resources. | Search terms and fields are bounded; no claim of universal absence or alias coverage. Evidence IDs are in `REA_RECONNAISSANCE_REPORT.md`. |

## CWC Flood Forecasting System

All routes below are same-origin `GET` requests observed from `https://ffs.india-water.gov.in/`. The public page requested these without a visible login flow. Keep them provisional until CWC confirms they are supported for reuse.

| Endpoint | Observed parameters/response | Status |
|---|---|---|
| `/iam/api/new-entry-data-aggregate/specification/` | `specification` is URL-encoded JSON; filter `id.datatypeCode == "HHS"`, station type `Level`, and exact `id.stationCode`. | HTTP 200. Gandhi Ghat (`003-MGD5PTN`) returned `latestDataValue=45.14`, `latestDataTime=2026-11-09T13:00:00`. Hathidah 38.15, Buxar 52.42, Hajipur 46.41, and Sripalpur 46.70 were also returned at that timestamp. Query output omits unit, timezone, and datum. Evidence `ev_82c08eec0290b2b9363314714e951e525ba23f1916904653e459a37a5b5f7494`, `ev_4f69b5a4bdeaa861fb0a11d5c176c9d9c9b39b97ee04c72d50ce42aea9c26166`. |
| `/iam/api/layer-station/specification/` | Encoded JSON specification; exact station-name query. | HTTP 200 station metadata verified: `Gandhighat` (`003-MGD5PTN`, unique code `CW1GAN000020`) and `Dighaghat` (`002-MGD5PTN`, unique code `CW1GAN000226`), both operational and telemetric. Evidence `ev_889ca41770f7aaec5549d9bbe7a20522d04f443e2566b5a689639353ca5f92b4`, `ev_b2742ec1d115ddc25d4c8547e38947e9d079ee162ee21caf952b5afd052f5484`. |
| `/iam/api/layer-station-geo/specification/` | Encoded JSON specification filters geographic layer stations of type `Level` or `Inflow`. | Page request observed; not enough retained content to validate records. |
| `/iam/api/flood-forecast-static/specification/` | Encoded JSON specification filtered to Gandhi Ghat code `003-MGD5PTN`, type `Level`. | HTTP 200; warning 47.6, danger 48.6, highest flow level 50.58 dated 2026-09-06. Unit omitted; not approved for threshold comparisons. Evidence `ev_a02065f0cd21b1f8de69637b783a7fb6cfc70597cb014e82b1d527fdbfbc28e7`. |
| `/iam/api/new-forecasted-entry-data/specification/` | Page request filters forecast date later than capture time; separate request used station-code and forecast-field filters. | HTTP 200, empty JSON array for the later-than-now query. |
| `/wims-messaging/api/inflow-forecast-station/` | JSON array, 28 objects; fields observed include station code/name, location, district, river, basin, telemetry, and operational metadata. | HTTP 200, 55,436-byte response. No target gauge names matched. |
| `/ffm/api/station-water-level-above-warning/` | JSON. | HTTP 200 with empty array at capture. |
| `/ffm/api/message/` | JSON. | HTTP 200 with empty array at capture. |
| `/ffm/ws/info` and `/wims-messaging/ws/info` | Socket.IO/WebSocket transport info requests. | HTTP 200 handshake metadata observed; no WebSocket message stream or sensor payload verified. |

Evidence: `ev_4c8263a5236f997685e1922bde143c0e1d849a8f1ef1bb7ee2752a7ee8a27d5d`, `ev_177972005ca8ca24b566204a5efee791df8e898fbbdfb055257262e5886d2203`, and `ev_cf8f3ba6bcc7f856157df1a43506af4616b01aeb269452bb555e01cf20797791`.

## Other inspected interfaces

| Provider | Endpoint/page | Observation | Evidence |
|---|---|---|---|
| Bihar FMISC / WRD | `https://www.fmiscwrdbihar.gov.in/` | Official public page links to RTDAS, River Watch, CWC, MODIS status, and other tools. River Watch link uses a login route. | `ev_242ee717baba22b297f0272b930a2bdae7e75692857a0cf206a1966494be8a76` |
| Bihar RTDAS | `http://180.149.240.71:88/home` | Public map UI; clicking `Downloads` redirected to `/login` in an isolated browser. No protected route or credentials were tested; no observation download was obtained. | `ev_2791af6ce29eed454ea9edb78c030deb558cde22c6d770eb5018b56f409f37d8`, `ev_2bf5c99221c554ff3199a8e5e1b4c4d1fb6a28815aa3ab775a4b259ad37bda4c` |
| Bihar WRD | `https://wrd.bihar.gov.in/rivers/2026/displayDischarge.php` | Controlled browser received an HTTP 500 error page. | `ev_f73a90b23c2df3e2e8927a27a50cadbc226b96b003a86a75135c8aa910a49890` |
| WRD-labelled barrage dashboard | `https://irrigation.befiqr.in/state/table/barrages` | Server-rendered table includes SCADA-labelled discharge snapshots; no reusable JSON/CSV request observed in the page load. Non-government domain. | `ev_2c70532d6a7595c5f48cf0a0cd3a5f1ef021ecdd90d81d44130cb9976152fdc6` |
| IMD API Management | `https://api.imd.gov.in/public/` and `/public/api_reference.html` | Official portal links registration, login, and API reference. Prior no-token data calls returned HTTP 401. | `ev_5e855dfa117bdae7d7fe8d333166540384edb4518471f5a9c23980e9c7a1d545`; earlier access probe documented in repository implementation notes. |
| Nepal Flood Forecasting Division | `https://hydrology.gov.np/#/rainfall_watch` | Visible rainfall table; public `/cm/api-public/...` fetches; `/gss/socket.io/` request. Table payload route and socket events not isolated. | `ev_cb9b910878ada057d7b5e436974e1bcdb756540c3a06ac5999381d219c0aed02` |

## Not yet established

- Stable production API contracts, pagination rules, rate limits, terms of use, refresh guarantees, and SLAs.
- A fresh, unit/datum/timezone-validated structured stage for any named gauge. CWC returned a Gandhi Ghat stage row, but not a verified current/live reading.
- Station IDs, gauge datum, datum offset, and timezone mapping for Bihar telemetry observations.
- A supported public data route from RTDAS, the Bihar government discharge display, or the non-government barrage page.
- A validated rainfall or discharge route from Nepal DHM suitable for SURAKSHA ingestion.
