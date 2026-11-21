# Flood Subsystem Experimentation & Benchmark Protocols

## 1. Experimentation Philosophy
All research pipelines, exploratory model variations, dataset upgrades, and validation benchmarks live inside `experiments/flood/`:

```text
experiments/flood/
├── benchmarks/
│   └── test_datasets_with_models.py       # Full scientific evaluation suite
└── pipelines/
    ├── build_all_datasets.py              # End-to-end dataset builder
    ├── fetch_real_hourly_hydrology.py     # Copernicus ERA5 & GloFAS API ingest
    └── upgrade_datasets.py                # Replay scenario & risk table generator
```

## 2. Standard Benchmark Execution
To evaluate current hydrological forecasters and risk classifiers:

```powershell
python experiments/flood/benchmarks/test_datasets_with_models.py
```

### Passing Criteria:
- Causal LSTM 24h Horizon Forecast RMSE: $\le 0.40 \text{ meters}$.
- Nash-Sutcliffe Efficiency (NSE): $\ge 0.90$.
- Historical Replay Scenario Recall: $\ge 90\%$.
- Historical Replay False Alarm Rate (FAR): $\le 10\%$.
