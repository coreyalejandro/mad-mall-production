# MADMall

## What This Is

MADMall is a virtual luxury outdoor mall + teaching clinic designed for Black women living with Graves' disease. The mall metaphor is intentional: malls are third-place infrastructure for Black women (behind church and beauty shop) — safe, familiar, dignified spaces that have been disappearing. MADMall recreates that experience digitally, with serious healthcare AI/ML infrastructure underneath the welcoming aesthetic.

The interface is modeled after two real luxury outdoor malls: Stanford Shopping Center (the creator's alma mater) and La Cantera in San Antonio (voted America's #1 mall, near the creator's home).

## Core Value

A safe, dignified digital third-place for Black women with Graves' disease — where the navigation feels like walking through a luxury outdoor mall, and the AI underneath is serious enough to matter.

## Requirements

### Validated

These capabilities exist in the current codebase:

- ✓ Turborepo monorepo with Next.js apps (web, app, api, studio) — existing
- ✓ Full authentication stack via Clerk — existing
- ✓ Payment processing via Stripe — existing
- ✓ CMS integration via Basehub — existing
- ✓ Database layer via Prisma/PostgreSQL — existing
- ✓ Design system with UI components — existing
- ✓ MADMall /plan page with infinite canvas (posters/blueprints) — existing
- ✓ MADMall /ml page (ML training component overview) — existing
- ✓ MADMall /agents page (IBM agent inventory) — existing
- ✓ Construction theme CSS (.madmall-grid, .madmall-caution) — existing
- ✓ Content API for serving plan documents — existing
- ✓ ML Python package for training pipeline — existing (ml/)
- ✓ Black Women and Graves Disease notebook with full CRISP-DM analysis — existing

### Active

Current milestone: Fix + Rebrand

- [ ] Fix Plan page zoom to center on cursor (Figma/Miro style) instead of origin
- [ ] Replace next-forge branding with MADMall throughout (header, footer, 13 files)
- [ ] Create construction-themed placeholder logo (text + simple icon, evolve later)
- [ ] Update header navigation: MADMall + Plan + taste of shops/services/data science
- [ ] Feature notebook highlights on initial display (especially the mock data conversation)
- [ ] Ensure smooth pan/zoom across all posters, not stuck on one corner

### Out of Scope

- Full spatial navigation rebuild (Google Earth style) — north star vision, future milestone
- Phase 3 features (Sisterhood Lounge chat, Events, Service Booking, Profiles, Moderation) — planned per PHASE3 docs, not this milestone
- Real medical data or PHI collection — building governance architecture first
- Mobile app — web-first
- OAuth login options — email/password sufficient for construction phase

## Context

### Cultural Significance

Malls have been vital community infrastructure for Black women — third in line behind church and beauty shop as important gathering spaces. Most have disappeared. MADMall reclaims this digitally with a luxury outdoor mall aesthetic that is calm, spacious, and dignified.

### Construction Phase

The site is intentionally styled as "under construction" — visitors see blueprints/posters on a construction wall rather than finished storefronts. This is both aesthetic choice and honest status: the mall isn't built yet. The construction theme (caution stripes, blueprint grid, "RIBBON CUT • SITE UNDER CONSTRUCTION") persists until features are ready.

### Skeuomorphism Vision

The navigation should feel like walking through a physical space — pan, zoom, drift — not clicking through cards in a grid. The north star is Google Earth-style fluid spatial movement. The current infinite canvas with posters is a step toward this; the broken zoom undermines it.

### The Serious ML Work

The notebook `black-women-and-graves-disease.ipynb` demonstrates:
- Full CRISP-DM data science process
- ML models for predicting Graves' disease outcomes
- Analysis of simulated health disparities for Black women
- Thoughtful approach to synthetic/mock data (the conversation at the end explains this brilliantly using the analogy of training scenarios for firefighters, Navy SEALs, lawyers)

This is not just a pretty interface — the AI infrastructure is substantive. Employers reviewing this work should see both.

### Existing Documentation

- `PHASE3_*.md` files document 5 planned features: Sisterhood Lounge (chat), Events, Service Directory/Booking, Profiles, Content Moderation
- `IMPLEMENTATION_GUIDE.md` has complete technical specs
- `HANDOFF.md` captures recent integration of MADMall features into this repo

## Constraints

- **Skeuomorphism**: Navigation must feel spatial, not grid-based. Zoom should center on cursor.
- **Construction aesthetic**: Maintain "under construction" styling until features ship. No generic SaaS look.
- **No next-forge branding**: Remove all Vercel triangles and "next-forge" text.
- **Accessibility first**: The clinic serves people with a chronic illness. Accessibility is non-negotiable.
- **Fail-closed governance**: Any future data collection must be consent-first, auditable.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Zoom to cursor (Figma-style) | Spatial navigation requires zoom to feel natural; origin-zoom breaks immersion | — Pending |
| Construction-themed placeholder logo | Reduces logo anxiety; fits "under construction" aesthetic; can evolve when mall "opens" | — Pending |
| Minimal nav during construction | Plan page is the hub; other pages are blueprints, not storefronts yet | — Pending |
| Feature notebook on initial display | Shows serious ML work to employers; the mock data conversation is uniquely compelling | — Pending |

---
*Last updated: 2026-02-03 after initialization*
