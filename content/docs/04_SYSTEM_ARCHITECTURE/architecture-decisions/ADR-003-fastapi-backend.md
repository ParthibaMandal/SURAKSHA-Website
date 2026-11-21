# Architecture Decision Record: ADR-003 FastAPI Asynchronous Backend

## Metadata
- **Status**: `VERIFIED`
- **Deciders**: `SURAKSHA Core Architecture Team`
- **Date**: `2026-11-21`
- **Technical Context**: `API Gateway & Integration Runtime`

---

## 1. Context & Problem Statement
SURAKSHA must serve as the real-time intelligence backend for interactive web dashboards, external GIS portals, and civil defense alerting services. It requires an API framework that natively validates complex scientific data models, supports non-blocking asynchronous operations for concurrent telemetry scrapers and satellite queries, and auto-generates machine-readable API contracts for frontend integration.

---

## 2. Alternatives Considered
1. **Flask**:
   * *Description*: Lightweight WSGI web framework.
   * *Drawbacks*: Synchronous by default; lacks native Pydantic schema validation; requires third-party extensions for OpenAPI documentation.
2. **Django / Django REST Framework**:
   * *Description*: Heavyweight web framework with ORM and admin panel.
   * *Drawbacks*: Substantial architectural overhead, heavyweight ORM unnecessary for in-memory Pydantic state objects, slower execution benchmarks.
3. **FastAPI (Chosen)**:
   * *Description*: High-performance ASGI framework built on Starlette and Pydantic.

---

## 3. Decision & Justification
We adopted **FastAPI**:
* **Native Pydantic v2 Integration**: Pipeline state contracts (`FloodState`, `GateVerdict`, `CAPAlert`) serialize and deserialize natively across REST boundaries with strict runtime type validation.
* **Asynchronous Concurrency**: Non-blocking `async`/`await` primitives allow concurrent background telemetry polling (CWC, IMD, GEE) without blocking user-facing HTTP request threads.
* **Automatic OpenAPI 3.1 & JSON Schema Generation**: Generates interactive documentation (`/docs`, `/redoc`) and machine-readable `openapi.yaml` for zero-friction frontend integration.
* **Execution Speed**: High-throughput Starlette ASGI engine minimizes API overhead during emergency traffic spikes.

---

## 4. Consequences & Reconsideration Triggers
* **Positive**: Clean type safety, high concurrency, zero-boilerplate API documentation, seamless test integration via `starlette.testclient.TestClient`.
* **Negative**: Developers must understand asynchronous Python event loops.
* **Reconsideration Trigger**: Requirement for complex relational ORM admin dashboards better suited to Django.

