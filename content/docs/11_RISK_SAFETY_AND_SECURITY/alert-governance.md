# Alert Governance & OASIS CAP Protocol Compliance

| Field | Value |
|---|---|
| **Document ID** | SEC-11-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Protocol Standard** | OASIS Common Alerting Protocol (CAP) v1.2 |

---

## 1. Standardized Alert Categories

SURAKSHA maps hydrological risk scores to official CAP v1.2 urgency/severity tiers:

| Risk Category | Normalized Score | CAP Urgency | CAP Severity | CAP Certainty | Color Code |
|---|---|---|---|---|---|
| **LOW** | $[0.00, 0.40)$ | Future | Minor | Possible | Green |
| **MODERATE** | $[0.40, 0.70)$ | Expected | Moderate | Likely | Yellow |
| **HIGH** | $[0.70, 0.85)$ | Immediate | Severe | Likely | Orange |
| **CRITICAL** | $[0.85, 1.00]$ | Immediate | Extreme | Observed / High | Red |

---

## 2. False Alarm Suppression Architecture

To prevent alarm fatigue among civil defense personnel:
- Alerts require confirmation across consecutive execution cycles before escalating.
- De-escalation implements a 4-hour hydraulic hysteresis damping filter.
