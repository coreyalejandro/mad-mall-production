---
phase: 01-navigation
plan: 01
subsystem: ui
tags: [react, canvas, zoom, pan, navigation]

# Dependency graph
requires:
  - phase: 00-initialization
    provides: Project structure and planning system
provides:
  - Cursor-centered zoom using viewport coordinates and scale ratios
  - Dynamic Reset View with content bounds calculation
  - Canvas navigation utilities (getBounds, containerRef pattern)
affects: [02-content, 03-layout, navigation, canvas-interactions]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cursor-centered zoom formula: newOffset = cursor - (cursor - oldOffset) * scaleRatio"
    - "Content bounds calculation with getBounds helper"
    - "containerRef pattern for viewport measurement"

key-files:
  created: []
  modified:
    - apps/web/app/[locale]/plan/use-plan-page.ts
    - apps/web/app/[locale]/plan/page.tsx

key-decisions:
  - "Use getBoundingClientRect() for cursor position (not offsetX/Y which is relative to event target)"
  - "Clamp scale before offset calculation to prevent drift during rapid zoom"
  - "Cap Reset View fitScale at 1x to prevent zoom-in beyond 100% for small content"

patterns-established:
  - "Canvas viewport measurement: containerRef attached to viewport div, getBoundingClientRect() for dimensions"
  - "Immutable state updates: direct setState for coordinated offset/scale changes"

# Metrics
duration: 20min
completed: 2026-02-06
---

# Phase 1 Plan 01: Canvas Navigation Fix Summary

**Cursor-centered zoom with viewport coordinates and dynamic Reset View fitting all posters with padding**

## Performance

- **Duration:** 20 min
- **Started:** 2026-02-06T00:51:00Z (from commit timestamps)
- **Completed:** 2026-02-06T07:47:17Z
- **Tasks:** 3 (2 implementation + 1 verification checkpoint)
- **Files modified:** 2

## Accomplishments
- Implemented cursor-centered zoom using getBoundingClientRect() and scale ratio formula
- Replaced hardcoded Reset View with dynamic content bounds calculation
- Added containerRef pattern for viewport dimension measurement
- Zoom now centers on cursor position (Figma/Miro style) instead of canvas origin
- Reset View fits all posters with 40px padding, capped at 1x zoom

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix cursor-centered zoom in onWheel** - `a1ebdf8` (feat)
2. **Task 2: Fix resetView to calculate content bounds and fit to viewport** - `01c6ab6` (feat)
3. **Task 3: Manual verification checkpoint** - Approved by user

**Plan metadata:** Will be created in final commit

## Files Created/Modified
- `apps/web/app/[locale]/plan/use-plan-page.ts` - Cursor-centered zoom in onWheel, getBounds helper, dynamic resetView with containerRef
- `apps/web/app/[locale]/plan/page.tsx` - containerRef wiring from hook to CanvasSection viewport div

## Decisions Made

**1. Use getBoundingClientRect() for cursor position**
- Rationale: offsetX/Y are relative to the event target element, which can be child poster elements, giving incorrect coordinates. getBoundingClientRect() + clientX/Y gives consistent viewport coordinates.

**2. Clamp scale before offset calculation**
- Rationale: RESEARCH.md Pitfall 3 - calculating offset with unclamped scale then clamping scale afterward causes drift. Must clamp first, then use clamped value for offset calculation.

**3. Cap Reset View fitScale at 1x**
- Rationale: When content is small relative to viewport, we want to fit at reduced zoom but never zoom in beyond 100%. The Math.min(..., 1) cap prevents unwanted magnification.

**4. Direct setState instead of callback form for coordinated offset/scale changes**
- Rationale: onWheel needs current scale value to calculate scaleRatio. Using setState(s => ...) callback form would complicate access. Since offset and scale must be computed together from the same values, direct setState on both ensures synchronization.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - implementation followed RESEARCH.md patterns, TypeScript compilation passed, user verification approved.

## Authentication Gates

None - no external services or CLI authentication required.

## Next Phase Readiness

Canvas navigation foundation complete. Ready for Phase 1 next plans:
- Multi-select and drag-to-reposition posters
- Keyboard shortcuts for zoom/pan
- Canvas minimap for spatial awareness

No blockers or concerns.

---
*Phase: 01-navigation*
*Completed: 2026-02-06*
