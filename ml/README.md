# MADMall ML Training Package

Python package for MADMall's ML training pipeline. Integrated from `/Users/coreyalejandro/dev/MADMall`.

## Overview

This package provides:
- **Byte-size event validation** against a strict JSON schema
- **Feature extraction** from validated events
- **Baseline binary logistic regression** training
- **Receipt generation** for auditability (hashes, timestamps, run IDs)

## Design Principles

1. **Fail-closed**: Missing consent, invalid schema, or missing labels → reject
2. **Auditability**: Every training run produces a receipt with input hashes
3. **Reproducibility**: Deterministic training from NDJSON events

## Usage

```bash
# Install (editable mode)
cd ml
pip install -e .

# Ingest events (validates schema)
python -m madmall_ml.cli.ingest --in raw_events.ndjson --out ml/data/events.ndjson

# Train baseline model
python -m madmall_ml.cli.train --events ml/data/events.ndjson --models ml/models
```

## Event Schema

See `schemas/byte_event.schema.json` for the full specification.

Required fields:
- `event_id`: Unique event identifier
- `timestamp`: ISO timestamp
- `source`: Collection source (`self`, `pharmacy`, `event`, `mobile_unit`, `mail_kit`)
- `consent`: Scope (`care` or `research`) and `revocable` flag
- `payload`: Event type and features

## Integration with Next.js

The ML package is standalone Python code. For web integration:
1. Run training pipelines as background jobs or serverless functions
2. Expose trained models via API routes
3. Store model artifacts in object storage (Vercel Blob, S3, etc.)

## Directory Structure

```
ml/
├── pyproject.toml           # Python package config
├── schemas/
│   └── byte_event.schema.json
├── src/madmall_ml/
│   ├── __init__.py
│   ├── validation.py        # Schema validation
│   ├── storage.py           # NDJSON I/O, hashing
│   ├── features.py          # Feature extraction
│   ├── training.py          # Model training
│   └── cli/
│       ├── ingest.py        # CLI: validate + ingest events
│       └── train.py         # CLI: train model from events
├── data/                    # (gitignored) Ingested events
├── models/                  # (gitignored) Trained model artifacts
└── receipts/                # Training run receipts
```
