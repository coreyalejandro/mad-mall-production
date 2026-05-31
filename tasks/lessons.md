# MADMall Lessons Log
## Feeds Article V Amendment Process

### Format
Each entry: what happened, which Article was violated (if any), what the fix is.

---

### L1 — Identity migration must happen before feature work (2026-03-25)
**Observation**: Deep research report identified that mad-mall-production still presents as "next-forge" in package.json and README. This causes confusion for humans and agents.
**Article**: Article II (Truth-Status Discipline) — the repo's identity does not match its declared purpose.
**Fix**: Identity migration is now Phase 0, before any feature work.

### L2 — Non-clinical boundary must be testable (2026-03-25)
**Observation**: Research report emphasizes MADMall is explicitly non-clinical. This boundary cannot be documentation-only — it must be enforced as testable product behavior.
**Article**: Article I (Right to Safety) — if the boundary is only prose, it can be silently violated.
**Fix**: Content policy scaffolding, UI language rules, and disallowed flows must be implemented as code constraints, not just docs.
