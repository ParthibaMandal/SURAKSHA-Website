# 9-Dimensional Scientific Benchmark Methodology

| Field | Value |
|---|---|
| **Document ID** | RES-15-001 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Script Reference** | `experiments/flood/benchmarks/run_adaptive_vs_static_pipeline_benchmark.py` |

---

## 1. Evaluation Dimensions

To evaluate the adaptive 3-gate supervisory architecture against static baseline pipelines, SURAKSHA evaluates 9 quantitative dimensions:

| # | Dimension | Metric | Formula / Definition | Unit | Target |
|---|---|---|---|---|---|
| 1 | **Forecast Accuracy** | Mean Absolute Error (MAE) | $\frac{1}{N}\sum |y_t - \hat{y}_t|$ | meters | $<0.30$ m |
| 2 | **Risk Classification Accuracy** | Weighted F1-Score | Harmonized precision-recall across risk classes | % | $>90\%$ |
| 3 | **False Alarm Suppression** | False Positive Rate (FPR) | $\frac{FP}{FP + TN}$ during non-flood periods | % | $<5\%$ |
| 4 | **Detection Lead Time** | Advanced Warning Hours | Time delta between alert and crest | hours | $>18$ hours |
| 5 | **Execution Latency** | Pipeline Runtime | Wall-clock execution time per cycle | ms | $<5000$ ms |
| 6 | **Model Efficiency** | Executed Model Count | Number of models evaluated dynamically | count | $1$ (normal), $3$ (surge) |
| 7 | **Fallback Frequency** | Fallback Engagement Rate | Ratio of cycles utilizing fallbacks | % | $<2\%$ |
| 8 | **Conflict Resolution** | Conflicts Detected & Handled | Unphysical sensor jumps intercepted | count | $100\%$ caught |
| 9 | **Human Escalation Rate** | Operator Review Rate | Fraction of cycles requiring manual check | % | $<3\%$ |
