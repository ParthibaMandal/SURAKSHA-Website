# Architecture Decision Record: ADR-002 Three-Gate Jev Supervisory Architecture

## Metadata
- **Status**: `VERIFIED`
- **Deciders**: `SURAKSHA Core Architecture Team`
- **Date**: `2026-11-21`
- **Technical Context**: `Autonomous Agent Governance & Life-Safety Reliability`

---

## 1. Context & Problem Statement
Autonomous agentic workflows operating in disaster management environments present critical life-safety hazards if unconstrained. Large Language Models (LLMs) are prone to hallucinations, non-deterministic outputs, and failure to obey strict physical conservation laws. Conversely, purely static deterministic rule trees fail to adapt when real-world sensory telemetry diverges, sensors drop out, or unpredicted hydrometeorological regimes emerge.

---

## 2. Alternatives Considered
1. **Unbounded Autonomous LLM Agent**:
   * *Description*: Allowing an LLM agent to freely query tools, forecast river levels, generate arbitrary numbers, and issue evacuations.
   * *Drawbacks*: Catastrophic safety risk; LLMs hallucinate numerical values, violate conservation of mass, and produce uncalibrated emergency alerts.
2. **Static Non-Branching Pipeline**:
   * *Description*: A fixed sequence of 7 agents executing regardless of data quality or divergence.
   * *Drawbacks*: Inability to switch to fallback forecasters when sensors fail; failure to arbitrate when statistical and deep learning models diverge; high false alarm rates.
3. **Three-Gate Jev Supervisory Architecture (Chosen)**:
   * *Description*: Partitioning workflow execution into three explicit lifecycle gates (**Pre-Run**, **Mid-Run**, **Post-Run**) supervised by **TypeSafe Jev System One** under the non-negotiable **Scientific Value Governance Invariant**.

---

## 3. Decision & Justification
We adopted the **Three-Gate Jev Supervisory Architecture**:
* **Scientific Value Governance Invariant**: Specialist models strictly and exclusively own all numerical outputs. Jev is strictly forbidden from fabricating or overriding numbers.
* **Bounded Decision Set**: All supervisory judgments deterministically map to one of five actions: `CONTINUE`, `HOLD_AND_RETRY`, `RUN_CHALLENGER_MODEL`, `USE_APPROVED_FALLBACK`, or `ESCALATE_TO_HUMAN`.
* **Gate 1 (Pre-Run)**: Physics QA and regime classification (`NORMAL`, `RAPID_RISE`, `EXTREME_RAINFALL`, `SENSOR_CONFLICT`, `MISSING_DATA`) routes model strategy.
* **Gate 2 (Mid-Run)**: Adjudicates spread between `SARIMA`, `GRU`, and `Hybrid BiLSTM` ($\Delta \le 0.40\text{ m}$ consensus vs. $\Delta > 0.80\text{ m}$ extreme disagreement) and verifies agent claims using a 5-tier taxonomy.
* **Gate 3 (Post-Run)**: Performs 4-way cross-agent triangulation before certifying data integrity for authoritative release.

---

## 4. Consequences & Reconsideration Triggers
* **Positive**: Absolute elimination of numerical hallucinations, provable physical boundary enforcement, dramatic reduction in false alarms, full audibility.
* **Negative**: Introduces dependency on TypeSafe API (fully mitigated by deterministic offline heuristic mocks).
* **Reconsideration Trigger**: If mathematical proofs demonstrate that an end-to-end differentiable neural network can inherently guarantee civil defense boundary safety without supervisory intervention.

