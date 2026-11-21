# REA Hydrological Data Reconnaissance

**Project:** SURAKSHA
**Snapshot date:** 2026-11-09/10 (Asia/Kolkata)
**Scope:** Public website and data-interface reconnaissance only. No production connectors were implemented, no authenticated session was used, and no access controls were bypassed.

## Executive summary

1. **NWDP is the best verified public structured source so far.** Its Bihar Water Department telemetry dataset is available through a public CKAN datastore endpoint. The API returned 103,814 rows and a current-period resource. A query for each requested Patna-area gauge name returned zero rows, so this does not currently establish Gandhi Ghat coverage. The latest row by resource record ID was for Tarabari_1 in Kishanganj: 47.81 m at `08-11-2026 23:00` as printed by the source. Its river and vertical datum fields were `-` and `0`, respectively; do not treat it as a Patna observation or as a datum-validated stage.
2. **CWC Flood Forecasting System exposes station-specific stage summaries.** The first unfiltered aggregate response was 248,678 bytes and exceeded REA's initial retention limit, but narrowing the route to one station returned compact HTTP 200 JSON. CWC identifies Gandhi Ghat as `Gandhighat` (`003-MGD5PTN`; unique code `CW1GAN000020`) and Digha Ghat as `Dighaghat` (`002-MGD5PTN`; unique code `CW1GAN000226`). The latest captured Gandhi Ghat HHS/Level row was `45.14` at `2026-11-09T13:00:00`; nearby gauge values are in the station registry. The payload omits unit, timezone, and datum, and this is not a verified live reading for 2026-11-10.
3. **Bihar FMISC RTDAS has a public map interface and download page**, with filters for ARG/AWLG, district, basin/river, and location. The inspected page did not expose a readable observation table in the capture, and JavaScript errors affected some controls. The page uses plain HTTP at the linked IP address. No RTDAS station observation endpoint was confirmed.
4. **A WRD-labelled barrage page displays live-looking SCADA values but is hosted on a non-government domain.** It showed Indrapuri discharge of 19,065.4 cusec at `2026-11-09 22:28:19`; Valmikinagar’s displayed value was dated `2026-09-28`; Birpur was `N/A`. The page made no observed data API call in the capture. These figures are leads, not independently verified official observations.
5. **The Bihar WRD government display URL returned HTTP 500** during the REA page load. **IMD’s official API portal presents registration/login and an API reference**; prior unauthenticated checks of data endpoints returned HTTP 401. **Nepal’s official hydrology site displayed public rainfall totals** and made public fetches, but its upstream real-time data transport and station relevance to Bihar remain unresolved.

## Findings by source

### NWDP / Bihar Water Department

The dataset describes hourly river-water-level telemetry in metres and provides four CSV resources covering 1961–1990, 1991–2020, 2021–2025, and 2026–2030. The 2026–2030 CSV is linked directly from the resource page. A public read-only request to the CKAN route below returned HTTP 200 without an API key:

```text
GET https://nwdp.nwic.gov.in/api/3/action/datastore_search
    ?resource_id=a169bbc1-0b1b-4c90-beaa-18948460407c
    &limit=5
```

The response declared `success: true`, `total: 103814`, and fields including `Station`, `State`, `District`, `River`, `Latitude`, `Longitude`, `RL_of_zeroGauge`, `MeanSeaLevel`, `Data Acquisition Time`, and `River Water Level Telemetry Hourly (meter)`. A latest-by-row-ID query returned Tarabari_1, Kishanganj, coordinates 26.33305556 / 87.94388889, `47.81` m at `08-11-2026 23:00`. The station’s `River` was `-`, `Is_DischargeDataAvailable` was `No`, and datum-related values were both `0`.

Exact filters for Gandhi Ghat, Gandhighat, Digha Ghat, Hathidah, Buxar, Hajipur, and Sripalpur returned zero rows. Full-text queries for the same root names also returned zero. This is a bounded search of the **2026–2030 Bihar Water Department resource**, not proof that the stations are absent from every NWDP resource or provider. The sample rows include 5-minute timestamps (`12:10`, `12:15`, `12:20`, `12:25`), despite the “Hourly” resource label; refresh/reporting cadence needs provider confirmation. The source does not state the timezone in the observed record fields.

Follow-up `package_show` metadata listed four resources: 1961–1990 (1,901 bytes), 1991–2020 (27,143 bytes), 2021–2025 (98,028,425 bytes), and 2026–2030 (12,228,387 bytes). The first two and the current resource report datastore active; the 2021–2025 entry says its datastore does not contain all source-file records. Bounded text searches for Gandhi, Digha, Hathidah, Buxar, Hajipur, and Sripalpur returned zero for each of the 1991–2020 and 2021–2025 resources. An exact `Station=Gandhighat` filter returned zero in 1961–1990. This expands the negative search but still does not prove absence under all aliases, fields, or resource records.

### CWC Flood Forecasting System

The public CWC page exposes `Current Flood Forecast`, `Site`, `Hydrograph`, and `Table View` navigation; a station-search control; and map filters for base, level, inflow-forecast, and flood categories. REA observed these same-origin calls:

- `/iam/api/new-entry-data-aggregate/specification/` — browser request uses `id.datatypeCode = HHS` and `stationCode.floodForecastStaticStationCode.type = Level`; HTTP 200; response body measured at 248,678 bytes in one capture and not retained under the default 65,536-byte body limit.
- `/iam/api/layer-station/specification/` and `/iam/api/flood-forecast-static/specification/` — requested by the public page; one response body was evicted from the inspector cache, another exceeded the default body limit. No station-to-code mapping was retained.
- `/wims-messaging/api/inflow-forecast-station/` — HTTP 200; 55,436-byte JSON body, parsed as 28 station objects. The observed objects include station metadata fields such as station code/name, district, river, basin, coordinates, and operational/telemetry metadata. None matched the target gauge names.
- `/iam/api/new-forecasted-entry-data/specification/` — HTTP 200 with an empty JSON array for a query whose forecast date was later than the page’s current time at capture.

The API paths are observed public-page behavior, not a supported integration contract. Pagination, stable query semantics, rate limits, terms, units, timezone, and datum still need confirmation. Gandhi's static station metadata has `reducedLevelOfZeroGauge: null` and `zeroRl: 0`, so it does not establish an absolute datum. Its static level record lists warning `47.6`, danger `48.6`, and highest flow level `50.58` on `2026-09-06`; the unit is omitted, so do not operationalize comparisons yet.

### Bihar FMISC / RTDAS

The FMISC government site links to CWC Gauges, River Watch, MODIS river status, and RTDAS. River Watch is linked through a `login.aspx` route. The RTDAS target is `http://180.149.240.71:88/home`; REA rendered a map page titled “Kosi” with category, district, basin/river, and location filters. Categories include Automatic Rain Gauge Station (ARG) and Automatic Water Level Gauging Station (AWLG). The page links to `Downloads`, `View Tabular Data`, and `Data View`.

The captured accessible page did not expose station values or table rows. Browser errors included missing DataTables functions and a null event-handler target. A follow-up click on `Downloads` redirected to `/login`; no credentials or protected routes were tested. The capture observed map-tile traffic but did not confirm a hydrological data request from the RTDAS host. Since the RTDAS link is HTTP rather than HTTPS, do not submit credentials or operational data through it without an approved secure access route.

### Bihar WRD and barrage display

`https://wrd.bihar.gov.in/rivers/2026/displayDischarge.php` returned a 500 Internal Server Error in the controlled browser capture. No data or reusable endpoint was obtained from that page.

`https://irrigation.befiqr.in/state/table/barrages` rendered a table with columns for barrage, designed discharge (cusec), current discharge (cusec), difference, timestamp, and source. It displayed:

| Barrage | Designed | Current | Timestamp shown | Source label |
|---|---:|---:|---|---|
| Indrapuri (Sone) | 1,458,000 | 19,065.4 | 2026-11-09 22:28:19 | SCADA |
| Valmikinagar (Gandak) | 850,000 | 416,000 | 2026-09-28 12:00:00 | SCADA |
| Birpur (Kosi) | 950,000 | N/A | N/A | SCADA |

The host is not a Bihar government domain. In the observed 4-second page window, its table was rendered in the page and the only dynamic requests were analytics/device detection; a public JSON or CSV data endpoint was not found. Do not use these values as an official production feed until source, units, timestamp semantics, and provider terms are independently verified.

### IMD and Nepal hydrology

REA confirmed that IMD’s official API Management site exposes registration, login, and API-reference links. Earlier unauthenticated requests to IMD data endpoints returned HTTP 401. Treat IMD data APIs as requiring registered/approved credentials; use the public page for documentation only until access is granted.

Nepal’s official Flood Forecasting Division rainfall-watch page displayed a table with station index/name/district, 1/3/6/12/24-hour rainfall in mm, status, and a “Last updated” caption of `Mon, Nov 9, 2026 5:19 PM`. Example row: Kumra Gaun (station 0434), Bardiya, 0/0/0/0/0.2 mm, below warning level. The captured page also made public fetches to `/cm/api-public/...` routes and an XHR to `/gss/socket.io/`; a malformed `https://https/socket.io/` request failed. The page capture did not establish how table rows are retrieved, whether the socket carries those rows, or which Nepal stations are useful upstream for the Ganga around Patna.

## Checklist against the requested objectives

| Objective | Status | Evidence-based result |
|---|---|---|
| Gandhi Ghat water level | Partial | CWC `Gandhighat`, `003-MGD5PTN`, `45.14` at `2026-11-09T13:00:00`; unit/timezone/datum absent, freshness not established. Not verified live on Nov 10. |
| Digha Ghat water level | Partial | CWC `Dighaghat`, `002-MGD5PTN` station verified; stage summary not yet retrieved. |
| Hathidah water level | Partial | CWC station and stage row found; value/time listed in registry; metadata absent. |
| Buxar Ganga gauge | Partial | CWC station and stage row found; value/time listed in registry; metadata absent. |
| Hajipur Gandak gauge | Partial | CWC station and stage row found; value/time listed in registry; metadata absent. |
| Sripalpur Punpun gauge | Partial | CWC station and stage row found; value/time listed in registry; metadata absent. |
| Indrapuri discharge | Partial | Third-party-hosted WRD-labelled table has a SCADA-labelled snapshot; not verified as an official reusable feed. |
| Valmikinagar discharge | Partial | Third-party table has an older SCADA-labelled snapshot dated 2026-09-28. |
| Birpur discharge | Unresolved | Third-party table reports `N/A`; no verified discharge. |
| Bihar RTDAS observations | Partial | Public map/filter/download interface found; no observation payload or station IDs verified. |
| Update cadence and freshness | Unresolved | NWDP records have acquisition times, but source timezone/SLA and cadence are unspecified; titles and sample interval differ. |
| Authentication/access boundaries | Partial | NWDP tested read-only public query succeeded; IMD unauthenticated requests previously returned 401; RTDAS authorization details untested. |

## Recommended next steps

1. Ask NWIC/Bihar WRD for a station inventory and documentation of station IDs, datum, timezone, units, and refresh guarantees; specifically ask whether the six target gauges are in a different resource or under aliases.
2. Confirm CWC's unit, timezone, datum, refresh interval, and supported API/export for the captured station rows; then query Dighaghat's stage summary. Do not make production depend on the observed undocumented route until CWC confirms support.
3. Request an HTTPS RTDAS access path and approved data-export mechanism from FMISC/WRD; the public Downloads control redirected to login in the captured flow.
4. Treat the befiqr barrage page as a cross-checking lead. Independently confirm the SCADA source and freshness with Bihar WRD before using its values.
5. Keep the existing SURAKSHA ingestion/validation approach fail-closed: retain `source`, `observed_at`, `fetched_at`, unit, datum, and provider identity; label stale/unknown readings rather than presenting them as live.

## REA evidence ledger

| Evidence ID | Observation |
|---|---|
| `ev_9a7ff1b46286666489d972fd4f8593faacf377873f0e6ca266e77e8f5cdb9d63` | NWDP Bihar telemetry dataset page, resources, description, and browser requests. |
| `ev_3e714e7bba32fbeb6aec6b6477c6bb344ddee9405c7a237de4e634fe823f90b2` | NWDP current-period resource page and direct CSV URL. |
| `ev_597641842bf13b4beb964dee700a26a3d52f935badbe5f6e184d1ae8cdac5094` | Public NWDP CSV HEAD request returned HTTP 200. |
| `ev_6eee359e723d90044bcdf9905d733c7cf22d624211ce4ed8a87e8f57ab379e97` | Public NWDP datastore query; schema, total, and first sample rows. |
| `ev_10ee9a4d2ecd1b19d404cef696b775d3a3449861d555d3c6eaca0109bb3a2f68` | Exact station-name filters; all seven returned zero records. |
| `ev_ba9b9f62eb0bb3ed0c6884b1a6aae3f0040fff2b12538a3dda31aec6dd4b4b0c` | NWDP full-text station-name searches; all six roots returned zero records. |
| `ev_8cccf2e2a217466f48ccb25662e92eae5966cb157b8a9429b0068828448ce580` | NWDP latest-by-row-ID sample; Tarabari_1, 47.81 m, source time 2026-11-08 23:00. |
| `ev_c01d42d9ac9c89181ce224de9d6869179ef7442452d4b80c198e87d58193f693` | NWDP public package metadata and four date-range resource records, including sizes and datastore flags. |
| `ev_43d340c68d85b4cafbabb3e06e961da780ea769ace2304c423a738c757965e7b`, `ev_ba06207b22455694fcfab86c57311a998afa6ab71bb7d9d75599b71cdf508d21` | NWDP exact `Gandhighat` filter in 1961–1990 and 1991–2020 resources: zero rows. |
| `ev_465ebcc9da02b631e5f40d347f493816f0ed18d934559ee21be3d2526b511afe`, `ev_135ea245539cd90ce6a5ec7cc87d482e6d043bb80c4388be474a612f8f655340`, `ev_c0d80750014123c6d401e8a36b48709ed016ba8de6a15d3916d3ac83982d8d36`, `ev_84f63b46e55f1d25f9e188426fa43e2c34e94ecb73d0fea6bc234d604787a4c5`, `ev_61d7c0b66e2f630768cc33ead259cf767aca87eb16ef6c0e7116d485323a0f84`, `ev_a7d3574f0ed0e45d045bf9d997dbf70eb5b93809f4a66bca1f92b36c97f19b41` | NWDP 1991–2020 bounded text searches for the six target roots: zero rows. |
| `ev_3c1e7e28ee29b8039be41e18fe948818508e91d5e93ab9d5dd87042a6f31102e`, `ev_585f4952d807cf682453276357d84ba94c0a12bc0eef0d2c76682522ad0c0672`, `ev_85dbd05c2ef073b8ce38df35fc04ae7f75c6a71545c84d70c06d7a4b4b15e914`, `ev_d39a603138e7fa48ced2ad5ed3d88d290f897056cf8398c755b09c19427de89c`, `ev_a65cda04a3939f89e37c0a07e94f317237fa83a49221c2f566c1df123f2b4376`, `ev_f819fb3f635f392a589fa0a7e38d7bd2eedb72dbaac9b5751f330cb6f1543eab` | NWDP 2021–2025 bounded text searches for the six target roots: zero rows. |
| `ev_4c8263a5236f997685e1922bde143c0e1d849a8f1ef1bb7ee2752a7ee8a27d5d` | CWC public page UI, map filters, route structure, and initial requests. |
| `ev_177972005ca8ca24b566204a5efee791df8e898fbbdfb055257262e5886d2203` | CWC 200 responses, station metadata JSON, and forecast query results. |
| `ev_285da632d7f47f4be8ab0249d12d331d24d7f1cf49c87dc72febf3f9e69645b3` | CWC Site search identifies `Gandhighat`. |
| `ev_889ca41770f7aaec5549d9bbe7a20522d04f443e2566b5a689639353ca5f92b4` | CWC station metadata for Gandhi Ghat, including station code and datum fields. |
| `ev_82c08eec0290b2b9363314714e951e525ba23f1916904653e459a37a5b5f7494` | CWC Gandhi Ghat latest stage summary: 45.14 at 2026-11-09T13:00:00. |
| `ev_a02065f0cd21b1f8de69637b783a7fb6cfc70597cb014e82b1d527fdbfbc28e7` | CWC Gandhi Ghat static level thresholds and highest-flow value. |
| `ev_b2742ec1d115ddc25d4c8547e38947e9d079ee162ee21caf952b5afd052f5484` | CWC station-name searches including Dighaghat and nearby station mappings. |
| `ev_4f69b5a4bdeaa861fb0a11d5c176c9d9c9b39b97ee04c72d50ce42aea9c26166` | CWC latest stage rows for Hathidah, Buxar, Hajipur, and Sripalpur. |
| `ev_cf8f3ba6bcc7f856157df1a43506af4616b01aeb269452bb555e01cf20797791` | CWC public GET replay; station/level endpoints and response/body retention outcomes. |
| `ev_2791af6ce29eed454ea9edb78c030deb558cde22c6d770eb5018b56f409f37d8` | RTDAS public map interface, filters, downloads link, network window, and page errors. |
| `ev_2bf5c99221c554ff3199a8e5e1b4c4d1fb6a28815aa3ab775a4b259ad37bda4c` | RTDAS Downloads click redirected to `/login`; no authentication was attempted. |
| `ev_242ee717baba22b297f0272b930a2bdae7e75692857a0cf206a1966494be8a76` | FMISC public homepage and official service links. |
| `ev_f73a90b23c2df3e2e8927a27a50cadbc226b96b003a86a75135c8aa910a49890` | Bihar WRD display URL returned 500. |
| `ev_2c70532d6a7595c5f48cf0a0cd3a5f1ef021ecdd90d81d44130cb9976152fdc6` | Third-party-hosted barrage table and rendered SCADA-labelled snapshots. |
| `ev_5e855dfa117bdae7d7fe8d333166540384edb4518471f5a9c23980e9c7a1d545` | IMD API portal registration/login/reference UI. |
| `ev_cb9b910878ada057d7b5e436974e1bcdb756540c3a06ac5999381d219c0aed02` | Nepal public rainfall-watch page, visible sample values, and network metadata. |

REA captures are bounded observations of these page loads and declared GETs; they do not establish a provider SLA or a full endpoint inventory. See the companion files for endpoint details, station status, availability, and limitations.
