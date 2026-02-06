from __future__ import annotations

import json
import math
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

from .features import extract_features
from .storage import sha256_file


@dataclass
class TrainResult:
    run_id: str
    trained_at: str
    events_path: str
    events_sha256: str
    label_set: List[str]
    feature_keys: List[str]
    model_path: str


def _sigmoid(z: float) -> float:
    # Numerically stable-ish sigmoid
    if z >= 0:
        ez = math.exp(-z)
        return 1.0 / (1.0 + ez)
    ez = math.exp(z)
    return ez / (1.0 + ez)


def train_binary_logistic_regression(
    xs: List[List[float]],
    ys: List[int],
    steps: int = 800,
    lr: float = 0.1,
) -> Tuple[List[float], float]:
    if not xs:
        raise ValueError('No training rows')

    n_features = len(xs[0])
    w = [0.0] * n_features
    b = 0.0

    for _ in range(steps):
        dw = [0.0] * n_features
        db = 0.0
        m = len(xs)
        for x, y in zip(xs, ys):
            z = sum(wj * xj for wj, xj in zip(w, x)) + b
            p = _sigmoid(z)
            err = p - y
            for j in range(n_features):
                dw[j] += err * x[j]
            db += err

        for j in range(n_features):
            w[j] -= lr * (dw[j] / m)
        b -= lr * (db / m)

    return w, b


def train_from_events(events: List[Dict[str, object]], events_path: Path, out_dir: Path) -> TrainResult:
    rows: List[Tuple[Dict[str, float], str]] = []
    for e in events:
        feats, label = extract_features(e)  # type: ignore[arg-type]
        if label is None:
            continue
        rows.append((feats, label))

    if not rows:
        raise ValueError('No labeled events found. Add payload.label for training.')

    label_set = sorted({label for _, label in rows})
    if len(label_set) != 2:
        raise ValueError(f'Binary training requires exactly 2 labels; got {label_set!r}')

    feature_keys = sorted({k for feats, _ in rows for k in feats.keys()})
    if not feature_keys:
        raise ValueError('No numeric features found. Add numeric payload.features.* fields.')

    xs: List[List[float]] = []
    ys: List[int] = []
    pos_label = label_set[1]

    for feats, label in rows:
        xs.append([float(feats.get(k, 0.0)) for k in feature_keys])
        ys.append(1 if label == pos_label else 0)

    w, b = train_binary_logistic_regression(xs, ys)

    run_id = f"train-{int(time.time())}"
    trained_at = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

    out_dir.mkdir(parents=True, exist_ok=True)
    model_path = out_dir / f"{run_id}.model.json"
    model = {
        "kind": "logreg",
        "run_id": run_id,
        "trained_at": trained_at,
        "labels": {"negative": label_set[0], "positive": pos_label},
        "feature_keys": feature_keys,
        "weights": w,
        "bias": b,
    }
    model_path.write_text(json.dumps(model, indent=2), encoding='utf-8')

    return TrainResult(
        run_id=run_id,
        trained_at=trained_at,
        events_path=str(events_path),
        events_sha256=sha256_file(events_path),
        label_set=label_set,
        feature_keys=feature_keys,
        model_path=str(model_path),
    )
