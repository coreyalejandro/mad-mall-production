from __future__ import annotations

import argparse
import json
from pathlib import Path

from madmall_ml.storage import read_ndjson
from madmall_ml.training import train_from_events


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description='Train a baseline MADMall model from ingested events.')
    parser.add_argument('--events', default='ml/data/events.ndjson', help='NDJSON events path')
    parser.add_argument('--models', default='ml/models', help='Output directory for model artifacts')
    parser.add_argument('--receipt', default='ml/receipts/latest-train-receipt.json', help='Receipt path (tracked)')
    args = parser.parse_args(argv)

    events_path = Path(args.events)
    models_dir = Path(args.models)
    receipt_path = Path(args.receipt)

    if not events_path.exists():
        print(json.dumps({"status": "FAIL_CLOSED", "why": "Events file not found", "path": str(events_path)}, indent=2))
        return 2

    events = read_ndjson(events_path)
    try:
        result = train_from_events(events, events_path, models_dir)
    except Exception as e:
        print(json.dumps({"status": "FAIL_CLOSED", "why": str(e)}, indent=2))
        return 2

    receipt_path.parent.mkdir(parents=True, exist_ok=True)
    receipt = {
        "status": "OK",
        "run_id": result.run_id,
        "trained_at": result.trained_at,
        "events": {"path": result.events_path, "sha256": result.events_sha256},
        "labels": result.label_set,
        "feature_keys": result.feature_keys,
        "model_path": result.model_path,
    }
    receipt_path.write_text(json.dumps(receipt, indent=2), encoding='utf-8')

    print(json.dumps(receipt, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
