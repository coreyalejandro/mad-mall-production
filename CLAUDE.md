# CLAUDE.md — MADMall-Production
## Governed by The Living Constitution

## What This Repo Is

MADMall is a virtual luxury outdoor mall and teaching clinic for Black women living with Graves' disease. It is the **primary use case for The Living Constitution** — constitutional governance applied to a real healthcare product serving a real, underserved population.

MADMall is **non-clinical**: it does not diagnose, treat, or prescribe. It provides community, cultural safety, and wellness support. This boundary is a constitutional constraint, not a product decision — it is enforced at the feature layer.

## Governance Authority

This repository operates under The Living Constitution (TLC). All five Articles apply:

| Article | Application to MADMall |
|---------|----------------------|
| **I — Bill of Rights** | Every user interaction respects safety, accessibility, dignity, clarity, and truth. Neurodivergent-first design is the default, not a toggle. |
| **II — Execution Law** | Immutable data patterns. Truth-status discipline on every module. No hardcoded secrets. Input validation on all user data. |
| **III — Purpose Law** | Every feature maps to the product mission: reducing isolation for Black women with Graves'. No feature ships without evidence of purpose. |
| **IV — Separation of Powers** | Agent roles are bounded. No agent deploys to production, modifies DB schema, or touches auth without human approval. |
| **V — Amendment Process** | Failures become lessons (tasks/lessons.md) → proposals → evaluation → ratification. The system learns from its mistakes. |

## Constitutional Constraints (Non-Negotiable)

1. **Non-clinical boundary**: MADMall does NOT diagnose, treat, or prescribe. Any feature that could be interpreted as medical advice MUST include explicit disclaimers AND be reviewed by human before merge.
2. **Consent-first data collection**: Every data touch goes through ConsentChain patterns — consented, logged, revocable. No silent data collection. No dark patterns.
3. **ML claims validation**: Every ML output (recommendations, moderation decisions, content scoring) must pass PROACTIVE invariant checks before reaching users. No unvalidated claims.
4. **Cognitive load limits**: UICare principles apply — interfaces must not overwhelm chronically ill users. SOP-013 Session Recovery applies to user-facing flows, not just developer workflows.
5. **Cultural safety**: Content moderation must account for culturally specific communication patterns. Generic moderation models that suppress AAVE or culturally resonant humor are a safety failure.

## External Standards Alignment

TLC governance maps to recognized enterprise frameworks:

| TLC Article | External Standard | What It Means for MADMall |
|-------------|-------------------|--------------------------|
| Article II (Execution Law) | NIST SSDF (Secure Software Development Framework) | Secure SDLC practices as auditable artifacts in CI/CD |
| AI-touching surfaces | NIST AI RMF (AI Risk Management Framework) | Moderation, recommendations, content workflows governed with documented purpose, bounded authority, audit trail |
| Dependencies | OpenSSF Scorecard | Automated supply-chain risk checks — branch protection, dependency hygiene |

## Source Evidence Repositories

| Repository | What It Contains | How To Use |
|-----------|-----------------|-----------|
| `kiro-hackathon-mad-mall` | Feature modules (feed, peer circles, comedy lounge, story booth, marketplace, resources), architecture, agent artifacts | Reference implementation for information architecture, routes, naming, UI modules. Rebuild inside this governed scaffold. |
| `black-women-and-graves-disease` | Research report, Phase 3 implementation specs (1,200+ lines), clinical literature grounding | Product requirements source. Non-clinical boundary definition. Feature specifications. |
| `the-living-constitution` | Governance specification, build contracts, evidence ledger, verification matrix | Governance authority. Every rule traces to an Article. |

## Feature Governance Pattern

Every feature follows this lifecycle:

```
Spec → Threat/Safety Notes → Implementation → Tests → Evidence Log → Amendment (if failures)
```

Each feature slice must declare:
1. **Purpose**: Which mission goal does this serve?
2. **Safety boundary**: What could go wrong? What is the non-clinical line?
3. **Consent requirement**: What data is collected? Is it consented and revocable?
4. **AI governance** (if applicable): What model? What authority? What fallback?
5. **Acceptance criteria**: How do we prove it works?

## Phase 3 Features (Build Targets)

| # | Feature | Safety Surface | Complexity |
|---|---------|---------------|-----------|
| 1 | Real-time Sisterhood Lounge (WebSocket chat) | Content moderation, cultural safety, consent | Medium-High |
| 2 | Live Experiences Event Scheduling | Data collection, RSVP consent | Medium |
| 3 | Service Directory with Booking | Payment safety, provider verification, consent | High |
| 4 | User Profiles and Avatars | PII handling, image storage, consent | Low-Medium |
| 5 | Content Moderation | AI governance, cultural sensitivity, false-positive harm | Medium |

## Identity Migration (Complete)

The repo has been migrated from next-forge scaffold identity to MADMall product identity:
- [x] package.json: `"name": "next-forge"` → `"name": "mad-mall-production"`
- [x] SEO metadata: application name, author, publisher → MADMall / Corey Alejandro
- [x] Header: Vercel triangle + "next-forge" → CommandIcon + "MADMall"
- [x] Footer: "next-forge" → "MADMall" with product description
- [x] README: full product narrative replacing template content
- [x] Rate-limit prefix: "next-forge" → "mad-mall"
- [x] All script references updated
- [x] Issue templates updated
- [ ] Remove template-specific features that don't map to MADMall (Phase 2)
- [ ] Replace remaining Vercel branding in visual assets (Phase 2)

## Tasks Structure

```
tasks/
  todo.md          ← Sprint tracker (required in every PR)
  lessons.md       ← Amendment log (feeds Article V)
  pause-state.md   ← SOP-013 recovery state (safe pause/resume)
```

## Development Rules

1. **No building without a spec.** Every feature has a spec before code.
2. **Tests first (TDD).** Write the test, watch it fail, then implement.
3. **V&T Statement on every PR.** What exists, what doesn't, what's unverified.
4. **One thing at a time.** Present ONE next step to the user. Batch delivery causes overwhelm.
5. **Recoverable always.** If a step fails, the recovery path must be as clear as the happy path.
