from __future__ import annotations

import argparse
import json
from pathlib import Path

from madmall_ml.storage import read_ndjson, write_ndjson
from madmall_ml.validation import validate_byte_event


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description='Ingest MADMall byte-size events (NDJSON).')
    parser.add_argument('--in', dest='in_path', required=True, help='Input NDJSON path')
    parser.add_argument('--out', dest='out_path', default='ml/data/events.ndjson', help='Output NDJSON path')
    args = parser.parse_args(argv)

    in_path = Path(args.in_path)
    out_path = Path(args.out_path)

    events = read_ndjson(in_path)

    valid = []
    errors = []
    for idx, event in enumerate(events):
        errs = validate_byte_event(event)
        if errs:
            errors.append({"index": idx, "errors": [er.__dict__ for er in errs]})
        else:
            valid.append(event)

    if errors:
        report = {
            "status": "FAIL_CLOSED",
            "why": "One or more events failed schema validation",
            "errors": errors,
        }
        print(json.dumps(report, indent=2))
        return 2

    write_ndjson(out_path, valid)
    print(json.dumps({"status": "OK", "written": len(valid), "path": str(out_path)}, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
