# TypeSafe Jev System One Supervisory Decision Policy

| Field | Value |
|---|---|
| **Document ID** | JEV-08-003 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |
| **Source Implementation** | `src/suraksha/disasters/flood/supervisor/policy_engine.py` |

---

## 1. Scientific Value Governance Invariant

> [!IMPORTANT]
> **Numerical Values are Specialist-Owned**: Hydrological, meteorological, and statistical models exclusively own all numerical outputs (predicted stage, river discharge, flooded area, population counts).
> 
> **TypeSafe Jev System One is strictly FORBIDDEN from modifying, overriding, interpolating, or fabricating numerical predictions.**

Jev acts strictly as a **bounded supervisory classification and routing engine**.

---

## 2. The 5 Bounded Actions

All supervisory verdicts emitted by Jev across Pre-Run, Mid-Run, and Post-Run gates must deterministically map to one of five bounded actions:

| Action | Code | Trigger Condition | Pipeline Consequence |
|---|---|---|---|
| **CONTINUE** | `CONTINUE` | Telemetry physically valid, model spread within limits ($\le 0.40$ m), claims supported | Pipeline continues along optimal path |
| **HOLD_AND_RETRY** | `HOLD_AND_RETRY` | Transient API timeout, non-converged SAR threshold, minor sensor jitter | Retries agent execution once ($N_{\text{retry}} \le 1$) |
| **RUN_CHALLENGER_MODEL** | `RUN_CHALLENGER_MODEL` | Moderate model divergence ($0.40 < \Delta \le 0.80$ m) or rapid rise detected | Summons BiLSTM / GRU committee from approved whitelist |
| **USE_APPROVED_FALLBACK** | `USE_APPROVED_FALLBACK` | Primary sensor dead, missing telemetry $>3$ hours, model checkpoint unavailable | Switches to calibrated offline fallback or Persistence baseline |
| **ESCALATE_TO_HUMAN** | `ESCALATE_TO_HUMAN` | Unphysical jump ($>2.0$ m/h without rain), extreme committee spread ($>0.80$ m), 4-way contradiction | Halts authoritative release (`is_authoritative=False`), alerts civil defense officer |
