# MADMall

A virtual luxury outdoor mall and teaching clinic for Black women living with Graves' disease.

---

## What This Is

Black women are disproportionately affected by Graves' disease. The systems that should protect them were not designed for them.

MADMall is a governed cultural sanctuary — non-clinical by design. It does not diagnose, treat, or prescribe. It gives Black women a place to shop, rest, learn, laugh, and find each other while navigating a disease that medicine largely ignores in their community.

Every room centers Black women of all sizes, shapes, and hues. That is not an aesthetic choice. It is a safety requirement.

---

## Rooms

| Room | Purpose |
|------|---------|
| Sanctuary (entrance) | Grounding and orientation |
| Retail | Curated products, culturally resonant |
| Jazz Lounge | Rest and culture |
| Comedy Room | Joy as medicine |
| Wellness Center | Movement, breath, self-care |
| Learning Commons | Graves' disease education, plain language |
| The Commons | Community, sisterhood |
| Care Clinic | Non-clinical support resources |

---

## Safety Layer

Every page carries three safety components — not UI decoration, actual function:

- **ExitStrategy** — one-keystroke exit (Shift+Esc), no trace
- **PanicButton** — immediate access to 988 crisis line, always visible
- **GroundingReset** — box-breathing ritual (4-4-6), available any time

These are constitutional requirements, not optional features.

---

## Governance

MADMall operates under [The Living Constitution](https://github.com/coreyalejandro/the-living-constitution). Every feature must trace to a mission goal. No feature ships without purpose evidence.

| Article | What it governs |
|---------|----------------|
| I — Bill of Rights | Safety, accessibility, dignity, truth in every interaction |
| II — Execution Law | Immutable data, security enforcement, truth-status discipline |
| III — Purpose Law | Every feature maps to the mission |
| IV — Separation of Powers | No agent deploys without human approval |
| V — Amendment Process | Failures become amendments, not buried |

---

## Design System

ZMUX "Sanctuary" — a vellum clinical aesthetic built for this project.

Core tokens:

```
--soul-gold:      #b38b4d
--clinical-teal:  #4b6a6d
--terracotta:     #a65d45
--vellum:         #fcfaf2
--ink:            #141414
```

---

## Stack

- Next.js 15 (App Router, server components first)
- TypeScript
- Tailwind CSS v4
- Turborepo monorepo

---

## Run Locally

```sh
pnpm install
pnpm dev
```

MADMall is at `http://localhost:3001/mall`

---

## Research Basis

The clinical and cultural grounding for this project lives in the research materials inside this repo. Black women with Graves' disease are the only stakeholder. Every decision runs through that lens.

---

## License

MIT
