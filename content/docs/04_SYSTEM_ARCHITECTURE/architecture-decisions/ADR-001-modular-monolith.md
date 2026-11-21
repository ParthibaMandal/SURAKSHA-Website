# Architecture Decision Record: ADR-001 Modular Monolith Architecture

## Metadata
- **Status**: `VERIFIED`
- **Deciders**: `SURAKSHA Core Architecture Team`
- **Date**: `2026-11-21`
- **Technical Context**: `Platform Core vs. Hazard Subsystems Topology`

---

## 1. Context & Problem Statement
SURAKSHA requires an architectural topology capable of coordinating complex, multi-agent scientific pipelines across real-time hydrological data ingestion, deep learning inference, geospatial raster processing, and civil defense alerting. The system must support high-speed execution under emergency conditions, allow offline-first air-gapped deployment, and enable clean modular addition of future disaster modules (e.g. cyclone, earthquake) without architectural fragmentation.

---

## 2. Alternatives Considered
1. **Distributed Microservices**:
   * *Description*: Deploying separate containerized services for telemetry ingestion, neural forecasting, satellite processing, Jev supervision, and alerting communicating via gRPC/HTTP.
   * *Drawbacks*: Severe operational overhead, network latency penalties across large in-memory tensors and GeoJSON geometries, network partition risks during disaster conditions, complex local testing.
2. **Loosely Coupled Scripts / Notebooks**:
   * *Description*: Standalone Python scripts executed by cron jobs.
   * *Drawbacks*: Lack of shared typed state contracts, zero supervisory verification, race conditions, brittle failure recovery.
3. **Modular Monolith (Chosen)**:
   * *Description*: A unified Python codebase strictly partitioned into two layers: `suraksha.core` (zero disaster logic, generic contracts, geospatial abstractions) and `suraksha.disasters.<hazard>` (independent hazard plugins registering via `HazardRegistry`).

---

## 3. Decision & Justification
We adopted the **Modular Monolith** architecture:
* **Zero Inter-Process Latency**: Shared state objects (`FloodState`) pass directly between pipeline agents in memory without serialization overhead over the network.
* **Strict Boundary Enforcement**: Automated checks prevent `suraksha.core` from importing from `suraksha.disasters.*`.
* **Pluggable Registration**: Hazards register themselves dynamically via `HazardRegistry.register()` at import time.
* **Air-Gapped Simplicity**: The entire application, test suite, and deterministic fallbacks execute reliably on a single workstation or server during total communications blackouts.

---

## 4. Consequences & Reconsideration Triggers
* **Positive**: Rapid local iteration, zero network latency, effortless test suite execution (all 243 tests run in <4 minutes), atomic deployments.
* **Negative**: Requires strict discipline to prevent accidental coupling between modules.
* **Reconsideration Trigger**: Scaling to multiple distinct geographically distributed engineering teams requiring independent deployment cadences.

