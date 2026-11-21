# Hydrology Station Registry (Reconnaissance)

This registry records verified public source metadata and returned observations from the 2026-11-10 follow-up. Returned CWC stage numbers are not promoted to live/operational use: the API payloads omit unit, timezone, and datum, and timestamps are unzoned.

## Requested gauges

| SURAKSHA target | River expected by plan | NWDP Bihar 2026–2030 exact/full-text query | CWC ID/value | Registry status |
|---|---|---|---|---|
| Gandhi Ghat | Ganga | No records for `Gandhi Ghat` or `Gandhighat` | CWC `Gandhighat`, `003-MGD5PTN`, `45.14` | CWC row verified; not current/live; metadata unresolved. |
| Digha Ghat | Ganga | No records for `Digha Ghat` / `Digha` | CWC `Dighaghat`, `002-MGD5PTN`; stage not yet retrieved | Station verified; stage unresolved. |
| Hathidah | Ganga | No records for `Hathidah` | CWC `004-MGD5PTN`, `38.15` | CWC row verified; metadata unresolved. |
| Buxar | Ganga | No records for `Buxar` | CWC `001-MGD5PTN`, `52.42` | CWC row verified; metadata unresolved. |
| Hajipur | Gandak | No records for `Hajipur` | CWC `011-MGD5PTN`, `46.41` | CWC row verified; metadata unresolved. |
| Sripalpur | Punpun | No records for `Sripalpur` | CWC `021-mgd5ptn`, `46.7` | CWC row verified; metadata unresolved. |

“No records” is limited to one public Bihar Water Department NWDP resource (`a169bbc1-0b1b-4c90-beaa-18948460407c`) and the exact/full-text filters tested. It does not prove absence from older NWDP resources, a differently named station, or CWC/RTDAS. Evidence: `ev_10ee9a4d2ecd1b19d404cef696b775d3a3449861d555d3c6eaca0109bb3a2f68`, `ev_ba9b9f62eb0bb3ed0c6884b1a6aae3f0040fff2b12538a3dda31aec6dd4b4b0c`.

Follow-up package metadata confirmed four NWDP resources (1961–1990, 1991–2020, 2021–2025, and 2026–2030). Bounded `q` searches for Gandhi, Digha, Hathidah, Buxar, Hajipur, and Sripalpur each returned zero records in both the 1991–2020 and 2021–2025 datastores. Exact `Station=Gandhighat` returned zero in 1961–1990. This does not test all aliases in 1961–1990, nor all possible station names/fields in any resource. Evidence: package inventory `ev_c01d42d9ac9c89181ce224de9d6869179ef7442452d4b80c198e87d58193f693`; historical searches `ev_465ebcc9da02b631e5f40d347f493816f0ed18d934559ee21be3d2526b511afe`, `ev_135ea245539cd90ce6a5ec7cc87d482e6d043bb80c4388be474a612f8f655340`, `ev_c0d80750014123c6d401e8a36b48709ed016ba8de6a15d3916d3ac83982d8d36`, `ev_84f63b46e55f1d25f9e188426fa43e2c34e94ecb73d0fea6bc234d604787a4c5`, `ev_61d7c0b66e2f630768cc33ead259cf767aca87eb16ef6c0e7116d485323a0f84`, `ev_a7d3574f0ed0e45d045bf9d997dbf70eb5b93809f4a66bca1f92b36c97f19b41`, `ev_3c1e7e28ee29b8039be41e18fe948818508e91d5e93ab9d5dd87042a6f31102e`, `ev_585f4952d807cf682453276357d84ba94c0a12bc0eef0d2c76682522ad0c0672`, `ev_85dbd05c2ef073b8ce38df35fc04ae7f75c6a71545c84d70c06d7a4b4b15e914`, `ev_d39a603138e7fa48ced2ad5ed3d88d290f897056cf8398c755b09c19427de89c`, `ev_a65cda04a3939f89e37c0a07e94f317237fa83a49221c2f566c1df123f2b4376`, `ev_f819fb3f635f392a589fa0a7e38d7bd2eedb72dbaac9b5751f330cb6f1543eab`.

## CWC Patna-area station records

All five retrieved aggregate rows below have `datatypeCode=HHS` and station type `Level`, and share source timestamp `2026-11-09T13:00:00` (timezone unspecified). The field is named `latestDataValue`; its unit and datum are not included. Treat them as provider-returned numeric stage values, not verified live values.

| CWC display name | Station code | Unique code | Latest value | Timestamp | Additional metadata |
|---|---|---|---:|---|---|
| Gandhighat | `003-MGD5PTN` | `CW1GAN000020` | 45.14 | `2026-11-09T13:00:00` | Operational, telemetric; established 1957-05-11; `reducedLevelOfZeroGauge=null`, `zeroRl=0`. |
| Dighaghat | `002-MGD5PTN` | `CW1GAN000226` | Not retrieved | — | Operational, telemetric; established 1971-06-01; `reducedLevelOfZeroGauge=null`, `zeroRl=0`. |
| Hathidah | `004-MGD5PTN` | `CW1GAN000001` | 38.15 | `2026-11-09T13:00:00` | Operational, telemetric; `reducedLevelOfZeroGauge=null`, `zeroRl=0`. |
| Buxar | `001-MGD5PTN` | `CW1GHG000003` | 52.42 | `2026-11-09T13:00:00` | Operational, telemetric. |
| Hajipur | `011-MGD5PTN` | `CW1GAN000464` | 46.41 | `2026-11-09T13:00:00` | Operational, telemetric. |
| Sripalpur | `021-mgd5ptn` | `CW1GAN000019` | 46.70 | `2026-11-09T13:00:00` | Operational, telemetric; station code case preserved as returned. |

Evidence: Gandhi station name/search `ev_285da632d7f47f4be8ab0249d12d331d24d7f1cf49c87dc72febf3f9e69645b3`; Gandhi and Dighaghat station metadata `ev_889ca41770f7aaec5549d9bbe7a20522d04f443e2566b5a689639353ca5f92b4`, `ev_b2742ec1d115ddc25d4c8547e38947e9d079ee162ee21caf952b5afd052f5484`; Gandhi latest aggregate `ev_82c08eec0290b2b9363314714e951e525ba23f1916904653e459a37a5b5f7494`; nearby aggregates `ev_4f69b5a4bdeaa861fb0a11d5c176c9d9c9b39b97ee04c72d50ce42aea9c26166`.

Gandhi static level thresholds returned warning `47.6`, danger `48.6`, and highest flow `50.58` on `2026-09-06`; unit is omitted, so these are recorded for follow-up only and not approved for threshold logic. Evidence: `ev_a02065f0cd21b1f8de69637b783a7fb6cfc70597cb014e82b1d527fdbfbc28e7`.

## Verified sample row from NWDP (not a Patna target)

| Field | Source value |
|---|---|
| Station | Tarabari_1 |
| Agency | Bihar |
| State / district | Bihar / KISHANGANJ |
| Row ID | `_id=103814`, `SlNo=103814` (record key, not a confirmed stable station code) |
| Coordinates | Latitude 26.33305556, longitude 87.94388889 |
| River | `-` |
| Water level | 47.81 m |
| Data acquisition time | `08-11-2026 23:00` (source string; timezone not specified) |
| Discharge available | `No` |
| Gauge-zero / mean-sea-level fields | `0` / `0` (datum cannot be inferred from zeros) |
| Source resource | NWDP Bihar Water Department, 2026–2030 hourly telemetry CSV / CKAN datastore |

This is a real public dataset row observed during the query. It is not a Ganga stage, not a Gandhi Ghat value, and not verified against a datum. Evidence: `ev_8cccf2e2a217466f48ccb25662e92eae5966cb157b8a9429b0068828448ce580`.

## Barrage registry leads (unverified provider)

| Structure | River | Host-visible designed/current discharge | Source time | Source label | Status |
|---|---|---:|---|---|---|
| Indrapuri | Sone | 1,458,000 / 19,065.4 cusec | 2026-11-09 22:28:19 | SCADA | Display snapshot only; third-party host. |
| Valmikinagar | Gandak | 850,000 / 416,000 cusec | 2026-09-28 12:00:00 | SCADA | Snapshot is old relative to investigation date; third-party host. |
| Birpur | Kosi | 950,000 / N/A cusec | N/A | SCADA | No discharge value available in snapshot. |

The numbers above are copied from a WRD-labelled dashboard on `irrigation.befiqr.in`, which is not a government domain. They are leads for provider verification, not approved observations. Evidence: `ev_2c70532d6a7595c5f48cf0a0cd3a5f1ef021ecdd90d81d44130cb9976152fdc6`.

## Required fields before a target is promoted to “live”

- Provider-approved station ID and canonical station name/aliases.
- River/basin, district, coordinates, and station operational status.
- Measurement parameter and unit.
- Gauge datum, reference offset, and threshold datum compatibility.
- Source observation timestamp and timezone, retrieval timestamp, and reporting interval.
- Provider/feed terms, supported endpoint, refresh guarantee, and failure behavior.

Until these fields are independently verified, leave gauge measurements `null` and freshness `unknown` rather than substituting a model forecast or another station’s value.
