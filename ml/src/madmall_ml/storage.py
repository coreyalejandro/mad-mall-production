from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any, Dict, Iterable


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def write_ndjson(path: Path, items: Iterable[Dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', encoding='utf-8') as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False))
            f.write('\n')


def read_ndjson(path: Path) -> list[Dict[str, Any]]:
    out: list[Dict[str, Any]] = []
    with path.open('r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            out.append(json.loads(line))
    return out
