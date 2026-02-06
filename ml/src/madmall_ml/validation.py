from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional


@dataclass(frozen=True)
class ValidationError:
    message: str
    field: Optional[str] = None


def _is_str(v: Any) -> bool:
    return isinstance(v, str) and len(v.strip()) > 0


def validate_byte_event(event: Dict[str, Any]) -> list[ValidationError]:
    errors: list[ValidationError] = []

    if not isinstance(event, dict):
        return [ValidationError("Event must be a JSON object")]

    for required in ["event_id", "timestamp", "source", "consent", "payload"]:
        if required not in event:
            errors.append(ValidationError("Missing required field", required))

    if "event_id" in event and not _is_str(event["event_id"]):
        errors.append(ValidationError("event_id must be a non-empty string", "event_id"))

    if "timestamp" in event and not _is_str(event["timestamp"]):
        errors.append(ValidationError("timestamp must be a non-empty string", "timestamp"))

    source = event.get("source")
    if source is not None and not isinstance(source, dict):
        errors.append(ValidationError("source must be an object", "source"))
    else:
        kind = (source or {}).get("kind")
        if kind not in {"self", "pharmacy", "event", "mobile_unit", "mail_kit"}:
            errors.append(ValidationError("source.kind invalid", "source.kind"))

    consent = event.get("consent")
    if consent is not None and not isinstance(consent, dict):
        errors.append(ValidationError("consent must be an object", "consent"))
    else:
        scope = (consent or {}).get("scope")
        if scope not in {"care", "research"}:
            errors.append(ValidationError("consent.scope invalid", "consent.scope"))
        revocable = (consent or {}).get("revocable")
        if not isinstance(revocable, bool):
            errors.append(ValidationError("consent.revocable must be boolean", "consent.revocable"))

    payload = event.get("payload")
    if payload is not None and not isinstance(payload, dict):
        errors.append(ValidationError("payload must be an object", "payload"))
    else:
        ptype = (payload or {}).get("type")
        if ptype not in {"symptom_snapshot", "adherence_ping", "context_ping", "lab_marker"}:
            errors.append(ValidationError("payload.type invalid", "payload.type"))
        features = (payload or {}).get("features")
        if features is not None and not isinstance(features, dict):
            errors.append(ValidationError("payload.features must be an object", "payload.features"))

    return errors
