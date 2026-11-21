# SURAKSHA Developer Environment & Setup Guide

## 1. Prerequisites
- Python 3.14.7+
- Git
- Google Cloud / Earth Engine account (optional for synthetic/cached offline mode)

## 2. Installation & Editable Mode

Clone or open the workspace and install `suraksha` in editable development mode:

```powershell
# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install SURAKSHA package in editable mode with development tools
pip install -e .
```

## 3. Running Scientific Benchmarks

Execute the Flood Model validation suite:

```powershell
python experiments/flood/benchmarks/test_datasets_with_models.py
```

This verifies:
1. PyTorch Causal LSTM hydrological forward pass.
2. Gradient Boosting model on district vulnerability data.
3. Historical Replay evaluation on positive flood scenarios and negative baselines.

## 4. Keeping the Knowledge Graph in Sync

After adding or modifying classes, contracts, or workflows, update the Graphify AST knowledge graph:

```powershell
graphify update .
```
