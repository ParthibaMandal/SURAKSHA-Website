# Civil Defense Dashboard Specification

| Field | Value |
|---|---|
| **Document ID** | UI-10-001 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Target Audience** | Civil Defense Operators, District Disaster Management Authorities (DDMA), Hydrologists |

---

## 1. User Interface Architecture

The SURAKSHA Dashboard is designed for high-stress operational environments, presenting actionable risk insights within a 3-second visual scan:

```mermaid
flowchart TD
    subgraph Header ["1. Global Telemetry & Status Bar"]
        G1[Station: Gandhi Ghat, Patna]
        G2[Current Stage: 48.75m MSL]
        G3[Trend: +0.15 m/h ↗]
        G4[Risk Level: HIGH (CRITICAL WATCH)]
    end

    subgraph MainLayout ["2. Main Operational Workspace"]
        subgraph LeftPanel ["Left: Geospatial Inundation Map"]
            Map[Interactive Leaflet / MapLibre Engine<br/>- Sentinel-1 SAR Net Flood Overlay (Cyan)<br/>- JRC Permanent Water (Blue)<br/>- Critical Infrastructure Markers (Red)<br/>- Evacuation Corridor Overlays (Green)]
        end

        subgraph RightPanel ["Right: Hydrograph & AI Intelligence"]
            Hydro[24h Forward Hydrograph<br/>- Historical Observed Stage (Solid Line)<br/>- Forecasted Crest (Dashed Line)<br/>- 90% Confidence Envelope (Shaded Band)<br/>- Warning (47.6m) & Danger (48.6m) Thresholds]
            JevCard[Supervisory Intelligence Card<br/>- 3-Gate Verification Status: VERIFIED<br/>- Model Ensemble Spread: 0.18m<br/>- Data Regime: RAPID_RISE]
        end
    end

    subgraph BottomPanel ["3. Civil Defense Action & Triage Console"]
        Action1[1-Click CAP Alert Broadcast]
        Action2[Download Situation Report (SITREP PDF)]
        Action3[Live Citizen Distress SOS Feed (Ranked by Urgency)]
    end
```

---

## 2. Key Component Specifications

### 2.1 Forward Hydrograph Component
- Displays continuous 72-hour timeline: 48 hours antecedent observed stage + 24 hours predicted stage.
- Plots horizontal alert lines: Warning Level (47.60m, Yellow), Danger Level (48.60m, Red), HFL (50.52m, Black dashed).
- Dynamically highlights time-to-danger ($T_{\text{danger}}$), giving emergency responders direct lead time countdown.

### 2.2 Geospatial Inundation Layer
- High-contrast color palette compliant with WCAG 2.1 AA accessibility.
- Vector tile rendering of Patna Municipal Wards with population density choropleth.
- Click-to-inspect feature queries local HAND depth and exposed infrastructure.
