# Deployment & Production Infrastructure Guide

| Field | Value |
|---|---|
| **Document ID** | DEP-13-001 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |

---

## 1. Architecture Deployment Overview

SURAKSHA can be deployed in two operational configurations:
1. **Containerized Cloud Deployment** (GKE / Cloud Run with GEE Cloud API)
2. **Air-Gapped On-Premises Deployment** (Local civil defense servers running with offline fallback assets)

---

## 2. Containerized Setup (Docker)

```dockerfile
# Multi-stage production build
FROM python:3.14-slim AS base
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir .
COPY src/ ./src
COPY data/processed/ ./data/processed
EXPOSE 8000
CMD ["uvicorn", "suraksha.disasters.flood.api.routes:router", "--host", "0.0.0.0", "--port", "8000"]
```

### Health Check Verification
```bash
curl http://localhost:8000/api/v1/flood/health
```
