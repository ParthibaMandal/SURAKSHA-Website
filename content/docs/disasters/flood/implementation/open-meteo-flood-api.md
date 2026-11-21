# Open-Meteo Global Flood API Integration

SURAKSHA exposes Open-Meteo/GloFAS daily discharge estimates as a separate, explicitly modelled product. These estimates do not replace CWC/Bihar WRD gauge stage or discharge and are not automatically fed into the telemetry scheduler or alert thresholds.

## API route

```text
GET /api/v1/flood/stations/{station_id}/modelled-discharge?forecast_days=7
```

The station ID must exist in SURAKSHA's station catalog. The route queries the station's registered coordinates, limits the forecast horizon to 1–30 days, uses GMT to preserve the model's daily boundaries, and returns the API's model-grid coordinates and units with the discharge series. Responses are cached in-process for six hours by default.

The provider reports 5 km grid-cell discharge. Open-Meteo warns that a nearby grid cell may select a different river; operators must compare the returned grid location and values with local gauge data before using it in a basin workflow. A returned model estimate is still modelled data even when it is from a forecast date.

## Configuration

The public free endpoint requires no key. Its terms limit free use to non-commercial purposes, impose call limits, and require attribution under CC BY 4.0. The current terms specify under 10,000 calls/day, 5,000/hour, and 600/minute; provider terms can change, so check them before deployment. Commercial use requires a paid customer endpoint and API key. Do not use the public free endpoint for a commercial service.

```dotenv
OPEN_METEO_FLOOD_API_BASE_URL=https://flood-api.open-meteo.com/v1/flood
OPEN_METEO_FLOOD_API_KEY=
OPEN_METEO_FLOOD_TIMEOUT_SECONDS=15
OPEN_METEO_FLOOD_CACHE_SECONDS=21600
OPEN_METEO_FLOOD_CELL_SELECTION=land
```

Set the base URL and key only as provided by Open-Meteo for a commercial subscription. Keep any key server-side. The adapter validates HTTPS and caches results; there is no automatic polling. The API health response describes configuration only and does not make a reachability request.

## Source documentation

- [Open-Meteo Flood API reference](https://open-meteo.com/en/docs/flood-api)
- [Open-Meteo Terms & Privacy](https://open-meteo.com/en/terms)

The reference documents the default GloFAS v4 Seamless product, daily m³/s discharge and ensemble statistics, the 5 km grid, and the possible forecast horizon. SURAKSHA caps this route at 30 days for its operational forecast view. The free API is provided without a guarantee of availability or accuracy, so the product must remain supplemental and its provenance visible to clients.
