# SURAKSHA Flood — Implementation and Data-Gap Plan

**Scope freeze (2026-10-27):** Flood only. Primary impact area is the Bihar river network and Ganga trunk: Buxar → Patna → Hathidah, including the Ganga confluences and Bihar tributary flood corridors explicitly catalogued in this repository. Upstream forcing includes the repo-defined Upper Ganga/Bhagirathi–Alaknanda glacier catalogue plus cryosphere/hydrometeorological source regions for Gandak/Narayani, Ghaghara/Karnali, Kosi/Arun, and the listed Bagmati, Burhi Gandak and Sone catchments. Do not create or plan other hazard plugins in this milestone.

## 1. Required lifecycle semantics

Keep the three distinct phases in `FloodEventPhase`:

- **PRE_EVENT:** forecast possible future stage/extent and potential exposure. Inputs include current/historical gauges, forecast rainfall, antecedent rainfall/soil wetness, upstream flow/melt indicators, calibrated reach routing and thresholds.
- **ACTIVE_EVENT:** prioritize measured gauge stage/trend and observed satellite inundation. Forecasts remain supporting evidence, not observations.
- **POST_EVENT:** reconstruct observed peak/extent and damage proxies from measured hydrographs, SAR/optical imagery and ground reports; then prioritize recovery. Do not describe synthetic change-detection estimates as observed damage.

Glacier melt is an upstream contribution signal, not a standalone prediction of a Patna flood. Route the signal through connected tributaries, reservoirs/barrages and reaches; calibrate travel times and attenuation using observed discharge/stage.

## 2. Implementation sequence

### P0 — Make forecast inputs trustworthy

1. Standardize `FloodState.evidence_store` serialization and `EvidenceStore` parsing. Preserve source, time range, scope, quality, feature schema and provenance.
2. Enforce the model's training feature order: `water_level_m`, `rainfall_mm`, `upstream_discharge_cumec`, `soil_moisture_index`. Do not silently reinterpret stage-only arrays as complete multivariate observations.
3. Require a genuine time-stamped historical window for production forecasts. If only sparse readings or synthetic features exist, label the result degraded, lower confidence, log the reason and require review according to policy.
4. Connect actual CWC/WRD observations and rainfall extractions to the ingestion and context-assembly path. Keep offline replay separate from live mode.
5. Add integration tests proving that a complete evidence window reaches the forecaster unchanged, while missing/stale/incomplete evidence is explicitly marked degraded.

### P0 — Make pre/active/post semantics evidence-driven

- PRE_EVENT: forecast stage at 6/12/24 hours; forecast extent only from a calibrated hydraulic/HAND model; potential population and asset exposure only.
- ACTIVE_EVENT: use the latest valid stage, rate of rise and observed SAR extent; attach observation timestamps, acquisition windows, source and fallback flags.
- POST_EVENT: derive peak stage/time from the recorded hydrograph, compare pre/post SAR and optical images, compute observed extent/asset intersections, and produce recovery priorities.
- Store forecast exposure and observed impact in separate fields. Do not substitute a forecast for a missing observation.
- The current post-event change detector must not claim a successful online comparison while returning its offline heuristic estimates. Online mode must fetch/process actual imagery or return an explicit unavailable/degraded status.

### P0 — Unify the runtime

Keep one public Flood runtime entry point. The Patna corridor runner, forecast committee, hydraulic conveyance, cryosphere calculations, consequence graph and post-event controller should be callable engines/services within that lifecycle, not competing end-to-end workflows.

Keep the three supervisory gates. Jev may select among approved evidence, agents, tools and model routes; deterministic policy must enforce allowed routes, numerical constraints, retry limits and human escalation. Jev must not invent or overwrite scientific values.

### P1 — Connect upstream melt to the Bihar Ganga corridor

1. Acquire actual upper-catchment temperature, precipitation, snow cover and glacier/lake observations.
2. Calibrate degree-day factors by basin/glacier type; distinguish rainfall runoff, seasonal snowmelt, glacier melt and GLOF scenarios.
3. Translate melt estimates into discharge only when area, units, lag, losses and calibration are explicit.
4. Route upstream discharge through connected reaches/reservoirs and calibrate against gauges.
5. Back-test on historical high-flow/flood events and compare stage peak, timing, lead time and false alerts.
6. Use Sentinel-1 for all-weather flood extent where available; Sentinel-2/NDVI is complementary and cloud-limited.

### P1 — Hydraulic and impact validation

- Replace cross-section summaries with verified cross-section geometry, bed/bank elevations, embankments, structures, roughness and reach connectivity.
- Calibrate stage-discharge and reach travel-time/attenuation against measured hydrographs.
- Replace fixed flood areas, population-per-km² rules and placeholder assets with raster/vector overlays for the actual AOI.
- Report uncertainties and missing layers rather than defaulting to plausible-looking numbers.

### P1 — Quality and operational controls

- Add CI for unit and integration tests and publish reproducible benchmark reports.
- Use time-based and event-based holdouts; avoid random leakage across adjacent hours from the same flood event.
- Track provenance, staleness, completeness, model/checkpoint version, input fallback status, route decisions and human overrides for every run.
- Reconcile README metrics with checkpoint metadata and evaluation artifacts before claiming production accuracy.

## 3. Essential datasets still missing or requiring verification

The repository includes useful station/glacier/lake inventories and dataset-specification CSVs. An inventory row or source URL is not the underlying time series, raster or geometry. Treat the following as missing until the actual downloadable data and coverage are verified.

### P0 — Required for credible Patna stage forecasts

1. **CWC hourly stage telemetry and discharge/hydrographs** for upstream Bhagirathi/Alaknanda and Ganga stations, plus Buxar, Patna and Hathidah; include station datum, QC flags and timestamp/time zone. Request/access via [CWC hydro-meteorological observations](https://cwc.gov.in/hydro-meteorological-observation), [National Water Data Portal hourly CWC river levels](https://nwdp.nwic.gov.in/en/dataset/river-water-level-telemetry-hourly-central-water-commission-cwc), and [Bihar FMISC](https://www.fmiscwrdbihar.gov.in/). Availability and download rights vary by station/dataset.
2. **Historical event hydrographs** around major Bihar/Ganga floods with measured peak/time and upstream/downstream observations. These are needed for calibration and hindcast validation, not just training.
3. **Observed and forecast catchment rainfall time series** over upstream tributaries and the Bihar corridor, with spatial coverage and units. Use IMD gridded rainfall / official climate-data services and Bihar FMISC products; record gaps and distinguish forecasts from observations.
4. **Actual multivariate hourly training/inference series** with aligned stage, rainfall, discharge and soil-moisture features. A metadata catalogue or synthetic feature matrix does not satisfy this.
5. **Actual DEM raster** covering Patna floodplain and the Buxar–Patna–Hathidah corridor, plus upstream catchments. Copernicus GLO-30 is a useful baseline, but hydraulic applications should use better local terrain data where accessible.
6. **Verified reach geometry and boundary conditions:** surveyed cross-sections/bathymetry, bank and embankment elevations, bridge/barrage/reservoir operations, reach connectivity, bed slope and measured upstream/downstream boundary hydrographs.

### P0/P1 — Needed for extent validation and post-event truth

7. **Historical flood extent masks/polygons with acquisition dates** for multiple events. Start with [Bihar Flood Hazard Zonation Atlas (NRSC/ISRO)](https://ndem.nrsc.gov.in/documents/Disaster_Document/FHZ/BR_FHZ_1998_2019_atlas.pdf), [Bhuvan flood layers](https://bhuvan-app1.nrsc.gov.in/disaster/usrtasks/flood/flood.php?uname=empty), and the [Bihar FMISC inundation map archive](https://fmiscwrdbihar.gov.in/fmis/inundation.aspx). These are valuable sources, but each map's date, coverage, resolution and validation status must be recorded.
8. **Actual Sentinel-1 scenes or derived water masks** for pre-event, peak/active-event and recession windows; include scene IDs, orbit, polarization, processing version and permanent-water treatment.
9. **Actual Sentinel-2/Landsat pre/post imagery** for vegetation/crop-loss proxies, plus cloud masks and ground validation. Do not use NDVI alone as proof of structural damage.
10. **Ground-truth impact observations:** dated embankment breaches, ward/village inundation, road closures, asset damage, relief records and verified population impacts for historical events.

### P1 — Required for credible exposure estimates

11. **Population raster for the AOI** (WorldPop or official census-derived grid) with vintage and resolution, rather than AOI summary totals.
12. **Actual building, road, bridge, hospital, substation, water-treatment and shelter geometries**, with source dates and verified attributes. OSM can seed the inventory but critical assets need verification.
13. **Land-cover and soil rasters** for runoff/infiltration and exposure: ESA WorldCover or NRSC/Bhuvan LULC; SoilGrids or suitable local soil data. Preserve spatial resolution and class definitions.
14. **River network, catchment boundaries, flow direction/accumulation and reservoir/barrage operations** to construct the routing graph and estimate travel time/attenuation.

### P1/P2 — Needed to substantiate the glacier-melt contribution

15. **Time-series high-altitude temperature and precipitation** (observations preferred; ERA5-Land is a regional reanalysis fallback) for relevant glacierized sub-basins.
16. **Time-series snow-cover extent** (e.g., MODIS daily snow-cover product) and actual Sentinel-2 snow/ice observations with cloud masking.
17. **Glacier outlines, elevation bands, debris cover and repeated glacier/lake observations** from sources such as [GLIMS](https://www.glims.org/) and official Indian cryosphere inventories. The current CSV inventories are not a substitute for time-varying observations.
18. **Glacial-lake monitoring and GLOF evidence:** repeated lake area/volume estimates, dam/moraine stability evidence, breach history and downstream event hydrographs.
19. **Observed melt/runoff or upper-basin discharge measurements** to calibrate degree-day factors and translate melt depth to discharge. Without these, label melt runoff as a scenario estimate, not measured inflow.
20. **Travel-time/attenuation observations** linking upper-basin surges to downstream gauges, including reservoir/barrage effects. Do not assume a single fixed glacier-to-Patna lead time.

## 4. Acceptance criteria before calling the Flood path operational

- Every live forecast identifies the latest observation timestamp and its source.
- The production forecaster receives the documented feature order and a real, adequately covered historical window.
- Missing, stale, interpolated and synthetic inputs are distinguishable in state, logs and API response.
- PRE_EVENT forecasts, ACTIVE_EVENT observations and POST_EVENT reconstruction are semantically separated.
- SAR/optical fallback output can never be mislabeled as observed satellite evidence.
- Stage forecast, peak timing and inundation extent are validated on held-out historical events, with baselines, calibration and uncertainty.
- Upstream melt contributes only through an explicitly calibrated hydrological/routing pathway.
- No operational warning is issued solely from an unvalidated model or synthetic data; deterministic thresholds and human review remain in force.

## 5. Scope boundary

This milestone is **Flood only**. Focus on glacier/snowmelt and upstream hydrology as contributing signals to rising water levels in the Bihar Ganga region, and on the complete PRE_EVENT → ACTIVE_EVENT → POST_EVENT lifecycle. Other hazard plugins are out of scope.


## 6. Exact spatial targets already defined in the repository

This section records the targets from the repository's existing CSVs and processor metadata. These are **repository-defined target areas and inventories**, not proof that every named data product has already been downloaded, quality-controlled or connected to live inference. Any nominal alert lead times in the CSV are hypotheses until verified with historical hydrographs.

### 6.1 Bihar Ganga trunk: Buxar → Patna → Hathidah

The file `data/new datasets/buxar_patna_hathidah_cross_sections.csv` defines a 195 km corridor with ten chainage locations. These are the main hydraulic and river-stage spine:

| Reach | Chainage | Location / role | Coordinates (lat, lon) |
|---|---:|---|---|
| BPH-001 | 0 km | Buxar gauge; upstream boundary hydrograph | 25.568, 83.978 |
| BPH-002 | 35 km | Brahmpur / Chausa | 25.682, 84.312 |
| BPH-003 | 68 km | Doriaganj / Ghaghra confluence inflow | 25.752, 84.620 |
| BPH-004 | 88 km | Koelwar / Maner; Sone confluence inflow | 25.660, 84.885 |
| BPH-005 | 105 km | Digha Ghat; western Patna urban-defence point | 25.645, 85.098 |
| BPH-006 | 115 km | Gandak confluence / Sonepur reach | 25.632, 85.185 |
| BPH-007 | 122 km | Gandhi Ghat, central Patna gauge | 25.621, 85.168 |
| BPH-008 | 140 km | Fatuha / Punpun confluence | 25.525, 85.312 |
| BPH-009 | 165 km | Bakhtiyarpur / Barh | 25.485, 85.580 |
| BPH-010 | 195 km | Hathidah / Mokama; downstream boundary | 25.375, 85.985 |

The CSV attributes these data to CWC, IWAI and Bihar WRD sources; verify the underlying survey, datum, geometry and source access before hydraulic calibration. The current engine solves simplified individual cross-sections; it does not yet demonstrate a calibrated, routed wave through all ten reaches.

### 6.2 Bihar urban, floodplain and confluence AOIs

The Sentinel-2 target file `data/new datasets/sentinel2_patna_uttarakhand_cryosphere.csv` explicitly defines three Bihar tiles:

| Tile | Target AOI | Intended use |
|---|---|---|
| 45PWV | Patna core urban; Ganga–Gandak–Sone confluence | Urban/rural inundation boundary and waterlogging duration |
| 45PWU | Buxar to western Patna; Sone–Ganga entry corridor | Upstream hydraulic boundary, braided-channel and diara change |
| 45PXU | East Patna, Fatuha, Mokama and Hathidah | Punpun/Harohar lowland and downstream choke-point inundation |

Additional target extents defined in the repository include Patna urban, Danapur, Digha, Fatuha, Punpun, Mokama Tal, Patna Diara/Raghopur Island, Hajipur/Sonepur and the Ganga–Gandak–Sone–Punpun confluence. The `dem_patna_upstream_catchment_catalog.csv` also defines Patna urban/diara, lower Punpun–Dardha–Harohar, and Sone lower-valley to Patna confluence terrain targets. The `osm_patna_target_aoi_infrastructure.csv` names Digha Flood Wall, Patna Ring Embankment, Punpun embankment, Saidpur/Pahari/Karmalichak drainage and pumping sites, JP Ganga Path, Bailey Road, Patna bridges, hospitals and power substations.

### 6.3 Bihar source-river and tributary network already named in the repo

This is a **multi-basin flood model feeding a Bihar impact area**, not a model that assumes every rise at Patna is caused only by melting in the Upper Ganga. The CWC station target list and ERA5/DEM catalogs explicitly include these upstream systems:

| Source basin / corridor | Repo-defined locations and receiving stations | Role in flood lifecycle |
|---|---|---|
| Gandak / Narayani | Upper Kali Gandaki, Trishuli; Valmikinagar/Triveni, Chatia, Dumariaghat, Rewaghat, Lalganj, Hajipur; Gandak–Ganga/Sonepur | Upstream snow/glacier and rainfall forcing; barrage/reach propagation into Bihar and Ganga |
| Ghaghara / Karnali | Upper Karnali Gorge, Bheri; Darauli, Gangpur Siswan, Chhapra; Ghaghara confluence at Doriaganj reach | Himalayan runoff and rainfall signal; tributary hydrograph and confluence effects |
| Kosi / Arun / Sun Kosi | Arun and Sun Kosi headwaters; Birpur Barrage, Basua, Baltara, Kursela | Upstream cryosphere/rainfall and barrage/flood-wave tracking in north-east Bihar |
| Bagmati / Adhwara | Upper Bagmati/Sundarijal, Siwalik foothills/Terai; Dheng Bridge, Runisaidpur, Benibad, Hayaghat | Mountain/foothill runoff, embanked floodplain and northern Bihar flood propagation |
| Burhi Gandak | Someshwar Hills/Harha drainage; Chanpatia, Lalbegiaghat, Sikandarpur, Samastipur, Rosera, Khagaria | Terai rainfall/runoff and slow floodplain wave routing |
| Sone | Amarkantak/Upper Sone, Rihand/North Koel, Bansagar and Indrapuri; Koelwar and Maner | Plateau rainfall, reservoir releases, and Sone–Ganga confluence surge |
| Local Patna / Punpun | Maner–Danapur, Hajipur–Sonepur, Patna urban/Punpun; Maner, Koelwar, Digha, Hajipur, Fatuha/Gandhi Ghat | Short-horizon local rainfall, backwater, drainage lockout and compound-stage signals |

Exact source-grid locations and nominal target lead times are in `data/new datasets/era5_patna_himalayan_catchments.csv`. The file lists: Upper Kali Gandaki (28.75, 83.75; nominal 48 h to Valmikinagar/Dumariaghat); Trishuli (28.0, 85.0; 36 h to Valmikinagar/Lalganj); Upper Karnali (29.5, 81.75; 60 h to Darauli/Gangpur Siswan); Bheri (28.5, 82.25; 48 h to Chhapra); Arun (27.75, 87.25; 48 h to Birpur/Basua); Sun Kosi (27.5, 86.0; 36 h to Baltara/Kursela); Upper Bagmati (27.75, 85.25; 24 h to Dheng/Runisaidpur); Siwalik/Terai (27.0, 85.5; 18 h to Benibad/Hayaghat); Someshwar/Harha (27.25, 84.5; 24 h to Chanpatia/Lalbegiaghat); Amarkantak/Upper Sone (22.75, 81.75; 72 h to Bansagar/Indrapuri); Rihand/North Koel (24.0, 83.0; 36 h to Indrapuri/Koelwar); Sone–Ganga Maner–Danapur (25.65, 84.95; 6 h); Gandak–Ganga Hajipur/Sonepur (25.68, 85.2; 6 h); and Patna urban/Punpun (25.55, 85.15; 4 h). Treat these hours as configuration targets, not validated lead-time guarantees.

The repository's `cwc_bihar_river_stations.csv` lists the following station set: Gandak—Valmikinagar/Triveni, Chatia, Dumariaghat, Rewaghat, Lalganj, Hajipur; Ghaghara—Darauli, Gangpur Siswan, Chhapra; Kosi—Birpur Barrage, Basua, Baltara, Kursela; Bagmati—Dheng Bridge, Runisaidpur, Benibad, Hayaghat; Burhi Gandak—Chanpatia, Lalbegiaghat, Sikandarpur, Samastipur, Rosera, Khagaria; Sone—Indrapuri Barrage, Koelwar, Maner. The station registry JSON does not yet have this entire network, and this CSV is station/threshold metadata, not time-series telemetry.

### 6.4 Glacier catalog: ten named entries

The file `data/new datasets/uttarakhand_upper_ganga_glacier_dataset.csv` and the cryosphere tests explicitly catalog ten glaciers/complexes:

| Catalog entry | Basin / named area | In-corridor interpretation |
|---|---|---|
| Gangotri Glacier | Bhagirathi Basin; Gaumukh/Bhojwasa | Direct Upper Ganga/Bhagirathi source context |
| Dokriani Bamak | Bhagirathi Basin, Din Gad | Bhagirathi melt-model calibration target |
| Chorabari Glacier | Mandakini Basin; Kedarnath/Chorabari outflow | Mandakini → Alaknanda → Ganga source context |
| Tipra Bank & Bhyundar | Alaknanda Basin; Pushpawati/Valley of Flowers; Govindghat | Alaknanda tributary contribution |
| Satopanth & Bhagirath Kharak | Alaknanda headwaters; Mana/Badrinath | Alaknanda headwater and debris-cover calibration |
| Raunthi & Rishiganga complex | Rishiganga/Dhauliganga, Chamoli; Raini/Tapovan | Dhauliganga → Alaknanda source and high-flow precursor context |
| Dunagiri Glacier | Dhauliganga Basin | Dhauliganga melt-model validation |
| Pindari Glacier | Pindar River / Alaknanda Basin; Khati/Karnaprayag | Alaknanda tributary contribution |
| Milam Glacier | Gori Ganga / Sarda Basin | Retain in inventory, but do not feed its discharge into the Bihar Ganga mainstem without explicit basin-routing justification |
| Bandarpunch Glacier | Yamuna / Tons headwaters | Retain as a catalog/reference target; not an upstream contributor to the Buxar–Patna–Hathidah reach |

The Sentinel-2 cryosphere processor uses five named MGRS tiles: **44RKT** (Upper Bhagirathi/Gangotri), **44RNT** (Alaknanda/Rishiganga/Dhauliganga), **44RMT** (Mandakini/Chorabari/Kedarnath), **44RPT** (Pindar/Kali/Milam/Kumaon), and **44RLT** (Yamuna/Tons). Prioritize tile-specific calculations for the hydrologically connected sub-basins and label the mixed/out-of-corridor portions of tiles rather than aggregating them blindly.

### 6.5 Glacial-lake catalog: ten named entries

The file `data/new datasets/uttarakhand_glacial_lakes_dataset.csv` defines the following monitoring candidates:

| Lake / feature | Catalog basin and downstream reach | Intended signal |
|---|---|---|
| Kedartal | Kedar Ganga/Bhagirathi; Gangotri–Harsil–Tehri | Lake expansion/breach scenario and routed surge |
| Chorabari Lake (Gandhi Sarovar, residual/ephemeral) | Mandakini; Kedarnath/Rambara/Gaurikund/Rudraprayag | Historical breach context and downstream surge |
| Vasuki Tal | Mandakini/Vasuki Ganga; Sonprayag/Mandakini | Lake/stream observation and runoff context |
| Satopanth Tal | Alaknanda headwaters; Mana/Badrinath/Joshimath | Lake state and upper-Alaknanda surge scenario |
| Hemkund Lake (Lokpal) | Pushpawati/Bhyundar; Ghangaria/Govindghat/Alaknanda | Local lake/overflow context |
| Rishiganga supraglacial/ephemeral lake | Rishiganga/Dhauliganga; Raini/Tapovan/Joshimath | Rapid drainage/surge precursor candidate |
| Bagini Proglacial Lake | Dhauliganga; Jumma/Dhauliganga HEP | Lake expansion and breach scenario |
| Kafni Glacier Lake | Pindar/Alaknanda; Khati/Tharali/Karnaprayag | Tributary crest contribution scenario |
| Milam supraglacial ponds | Gori Ganga | Auxiliary catalog entry; not directly routed to the Bihar mainstem without watershed routing |
| Ruinsara Tal | Tons/Supin, Yamuna headwaters | Auxiliary catalog entry; not a direct upstream contributor to the target Bihar reach |

The lake CSV contains static area/volume/risk fields. To use them operationally, acquire repeated lake outlines/area/volume observations, DEM-derived dam geometry, and downstream hydrographs; do not treat static catalog values as current conditions.

### 6.6 Sentinel-1 cryosphere tracks already declared

`Sentinel1CryosphereProcessor.HIMALAYAN_TRACKS` defines four relative-orbit/basin associations: **track 19** Gandak/Kali Gandaki & Annapurna (center approx. 28.7, 83.8); **track 48** Ghaghara/Karnali & Saipal (30.0, 82.0); **track 92** Kosi/Arun transboundary (27.9, 86.8); **track 121** Upper Ganga/Bhagirathi–Alaknanda (30.8, 79.2).

The paired Sentinel-1 inventory also lists Bihar flood monitoring for Patna/Danapur/Hajipur and the lower Gandak/Ghaghara/Saran/Vaishali/Chhapra/Rewaghat corridor. Other cataloged cryosphere zones (Kali Gandaki/Annapurna, Kosi, Karnali and Bagmati) are upstream contributing-basin targets only when their routed flows and available travel times are represented. Track metadata and current offline outputs are not live observations: the Sentinel-1 cryosphere code still returns fallback observations, even when authenticated processing is entered.

### 6.7 Target event history for PRE → ACTIVE → POST testing

The repository's Bihar historical event files name these replay candidates:

- **1975** Patna inundation catastrophe — Patna urban, Sone and Punpun/Ganga interaction.
- **2008** Kosi/Kusaha breach — north-east Bihar/Kosi event.
- **2016** Ganga Basin mega-flood — Buxar–Patna–Hathidah, diara, Maner and Fatuha.
- **2019** Patna urban deluge — Rajendra Nagar, Kankarbagh, Patliputra/Boring Canal Road, drainage-sump and high-Ganga backwater interactions.
- **2020** North Bihar multi-basin flood — Gandak, Burhi Gandak and Bagmati areas including Gopalganj, Saran, Vaishali, Muzaffarpur and Darbhanga.
- **2021** Ganga/Sone/Punpun dual-crest case — Patna rural, Danapur diara, Maner, Raghopur diara and Barh.
- **2024** late-monsoon multi-basin high flood — Buxar, Bhojpur, Patna, Vaishali, Begusarai, Bhagalpur and Kosi/Gandak/Bagmati/Sone source basins.

These CSVs are event inventories and contain candidate dates/targets; before benchmarking, obtain and validate the real gauge records, event boundary conditions, dated satellite masks and ground-impact reports. POST_EVENT should use these observed records to reconstruct peak stage/time, maximum inundation and recession, then assess actual asset intersection and recovery priorities.

### 6.8 What is actually missing despite these target catalogs

The main target locations are already encoded in the repository. The remaining gaps are the **actual time-varying observations and a connected operational path**:

1. Verified CWC/WRD hourly gauge histories, especially upstream tributary stations and Buxar/Patna/Hathidah; current station catalogs are metadata only.
2. Event-matched rainfall observations/forecasts for the listed 14 catchments and local Patna catchments.
3. Actual gridded DEMs, river-network rasters, bathymetry/surveyed cross-sections and verified barrage/reservoir operations.
4. Actual repeated Sentinel-1/2 scenes and calibrated flood masks for the target AOIs; the inventory CSVs are acquisition instructions, not scene stacks.
5. Full glacier/lake inventory and time series for the Nepal/Tibet upstream catchments represented by tracks 19/48/92 (Gandak/Narayani, Ghaghara/Karnali and Kosi/Arun). The current ten-glacier list is mainly Uttarakhand and does not populate those other glacierized source catchments.
6. Melt calibration observations and routed upstream/downstream hydrographs to determine which glacier/snow signals materially affect each Bihar station.
7. Complete station registry coverage and validated datums/thresholds for the stations listed in the Bihar CSV.
8. Actual population/asset rasters and vectors, not only target AOI summary metadata.
9. Verified pre-/post-event image pairs and ground truth for the seven historical event replay candidates.
10. Working live cryosphere processing: Sentinel-1 currently falls back to synthetic observations; Sentinel-2's snow fraction can be imagery-derived but its returned snowline altitude is still a fixed tile baseline.

