# Roadmap: MADMall Fix + Rebrand

## Overview

This roadmap transforms the existing codebase from a next-forge scaffold into the MADMall identity while fixing the broken spatial navigation that undermines the luxury mall experience. The 4 phases move from foundation (fixing the pan/zoom) through branding (removing next-forge), navigation updates (header), and culminate in showcasing the serious ML work that makes this clinic more than a pretty interface.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Navigation** - Fix zoom and pan to feel like walking through the mall
- [ ] **Phase 2: Branding** - Replace next-forge with MADMall throughout
- [ ] **Phase 3: Header** - Update navigation for construction phase
- [ ] **Phase 4: Home Display** - Feature notebook highlights for visitors

## Phase Details

### Phase 1: Navigation
**Goal**: Users can pan and zoom through the Plan page like navigating a physical space, with cursor-centered zoom (Figma/Miro style) and smooth movement across all posters.
**Depends on**: Nothing (first phase)
**Requirements**: NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. User zooms in on a poster and the zoom centers on their cursor position, not the canvas origin
  2. User can pan smoothly across the entire canvas without getting stuck in one corner
  3. User can click a reset button and see all posters centered in their viewport
  4. Zoom and pan work consistently across different poster positions on the canvas
**Plans**: TBD

Plans:
- [ ] 01-01: TBD

### Phase 2: Branding
**Goal**: All visible branding reflects MADMall identity with construction-themed aesthetics; no trace of next-forge or Vercel triangles remains.
**Depends on**: Phase 1
**Requirements**: BRAND-01, BRAND-02, BRAND-03, BRAND-04
**Success Criteria** (what must be TRUE):
  1. User sees "MADMall" with construction-themed styling in the header, not next-forge or Vercel logos
  2. User sees MADMall branding in the footer
  3. User never encounters a Vercel triangle logo anywhere in the application
  4. Developer reviewing the codebase finds no next-forge references in README, package.json, or script files
**Plans**: TBD

Plans:
- [ ] 02-01: TBD

### Phase 3: Header
**Goal**: Header navigation guides visitors to the key areas: the Plan (blueprints), a taste of what's coming (shops/services), and the data science work.
**Depends on**: Phase 2
**Requirements**: HDR-01, HDR-02, HDR-03
**Success Criteria** (what must be TRUE):
  1. User can navigate to the Plan page from any page via header link
  2. User sees navigation hints for upcoming shops/services (even if pages are placeholder)
  3. User can find link to ML/data science work from the header
  4. Navigation feels appropriate for "under construction" phase (minimal, not cluttered)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Home Display
**Goal**: Initial visitor experience features the notebook highlights, especially the mock data conversation that demonstrates thoughtful ML work to employers and visitors.
**Depends on**: Phase 3
**Requirements**: HOME-01, HOME-02
**Success Criteria** (what must be TRUE):
  1. User landing on home page sees featured content from the Graves' disease notebook
  2. User can read the mock data conversation (firefighter/Navy SEAL/lawyer training analogy) prominently displayed
  3. Content positioning conveys "this is serious healthcare AI work" alongside the welcoming mall aesthetic
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Navigation | 0/TBD | Not started | - |
| 2. Branding | 0/TBD | Not started | - |
| 3. Header | 0/TBD | Not started | - |
| 4. Home Display | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-03*
*Milestone: Fix + Rebrand*
