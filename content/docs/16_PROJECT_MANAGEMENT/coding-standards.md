# Engineering Coding Standards & Quality Mandates

| Field | Value |
|---|---|
| **Document ID** | PM-16-001 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |

---

## 1. Core Engineering Mandates

1. **Python 3.14.7+ Modern Typing**: Use modern union types (`int | None`, `list[str]`).
2. **Pydantic v2 Standard**: All shared data models must inherit from `BaseModel`.
3. **Numerical Safety**: Always guard denominators with epsilon ($\epsilon = 1e-7$) and sanitize `NaN` / `Inf`.
4. **Rescaling Invariant**: Neural model outputs must be denormalized back to native physical units ($m, m^3/s$).
5. **Zero Regressions**: No code is accepted without 100% passing test suite (`pytest tests/ -q`).
