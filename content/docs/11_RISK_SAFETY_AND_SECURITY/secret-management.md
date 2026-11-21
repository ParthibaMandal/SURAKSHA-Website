# Secrets & Credential Management

| Field | Value |
|---|---|
| **Document ID** | SEC-11-003 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |

---

## 1. Zero-Secrets-in-Code Mandate

Under no circumstances may API keys, Google Cloud service account keys, or database passwords be committed to the git repository.

### Protected Files (Enforced in `.gitignore`)
- `.env`
- `secrets/*.json`
- `secrets/suraksha-service-account.json`

### Required Environment Variables
```bash
# Google Earth Engine
EE_PROJECT_ID="suraksha-509319"
EE_SERVICE_ACCOUNT="suraksha@suraksha-509319.iam.gserviceaccount.com"
GOOGLE_APPLICATION_CREDENTIALS="secrets/suraksha-service-account.json"

# TypeSafe Jev System One
TYPESAFE_API_KEY="sk-jev-..."
TYPESAFE_API_BASE_URL="https://api.typesafe.ai"

# Operational Security
SURAKSHA_OPERATOR_API_KEY="min-32-char-cryptographic-token"
```
