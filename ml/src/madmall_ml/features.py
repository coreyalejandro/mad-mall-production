from __future__ import annotations

from typing import Any, Dict, Tuple


def extract_features(event: Dict[str, Any]) -> Tuple[Dict[str, float], str | None]:
    payload = event.get('payload') or {}
    raw_features = payload.get('features') or {}

    features: Dict[str, float] = {}
    for k, v in raw_features.items():
        if isinstance(v, bool):
            features[k] = 1.0 if v else 0.0
        elif isinstance(v, (int, float)):
            features[k] = float(v)
        else:
            # Non-numeric features are ignored by the baseline trainer.
            continue

    label = payload.get('label')
    if label is None:
        return features, None
    if isinstance(label, str) and label.strip():
        return features, label.strip()
    return features, None
