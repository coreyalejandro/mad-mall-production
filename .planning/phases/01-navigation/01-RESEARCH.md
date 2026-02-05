# Phase 1: Navigation - Research

**Researched:** 2026-02-04
**Domain:** Canvas zoom/pan with CSS transforms (React/TypeScript)
**Confidence:** HIGH

## Summary

Research focused on implementing cursor-centered zoom (Figma/Miro style) for an HTML/CSS-based infinite canvas in React. The current implementation uses CSS transforms (`translate()` + `scale()`) but applies zoom from the canvas origin rather than the cursor position.

The standard approach uses CSS transforms for performance (GPU acceleration) rather than canvas context transforms. For cursor-centered zoom, the mathematical pattern is: calculate the cursor position in canvas space before zoom, apply the scale change, then adjust the offset to keep that point stationary. This requires coordinate transformation math but is simpler than it appears.

**Primary recommendation:** Use CSS transform with translate-then-scale pattern. Calculate new offset using the formula: `newOffset = cursor - (cursor - oldOffset) * (newScale / oldScale)` where cursor is in viewport coordinates.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18+ | UI framework | Already in use, state management |
| TypeScript | 5+ | Type safety | Already in use |
| CSS Transforms | Native | Pan/zoom rendering | GPU-accelerated, no external deps |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-zoom-pan-pinch | 3.x | Complete zoom/pan solution | When you want batteries-included approach |
| d3-zoom | 3.x | Zoom behavior library | When building custom interactions, already familiar with D3 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS transforms | Canvas transforms (ctx.scale/translate) | Canvas requires redraw on every change, less performant |
| Custom implementation | react-zoom-pan-pinch | Library adds abstraction but removes need for math implementation |
| Custom implementation | d3-zoom | More powerful for complex gestures, but heavier dependency |

**Installation:**
```bash
# Only if using a library (not needed for custom CSS transform approach)
npm install react-zoom-pan-pinch
# OR
npm install d3-zoom @types/d3-zoom
```

## Architecture Patterns

### Recommended State Structure
```typescript
// State for zoom/pan
const [scale, setScale] = useState(1);
const [offset, setOffset] = useState({ x: 0, y: 0 });
const [isPanning, setIsPanning] = useState(false);
const panStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

// Memoized transform style
const transformStyle = useMemo(
  () => ({
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
  }),
  [offset.x, offset.y, scale]
);
```

### Pattern 1: Cursor-Centered Zoom with CSS Transforms
**What:** Zoom that keeps the point under the cursor stationary
**When to use:** Always for spatial navigation (Figma/Miro style)
**Example:**
```typescript
// Source: https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/
// Verified pattern from multiple sources

function onWheel(event: React.WheelEvent<HTMLDivElement>) {
  event.preventDefault();

  // Get cursor position relative to the viewport container
  const rect = event.currentTarget.getBoundingClientRect();
  const cursorX = event.clientX - rect.left;
  const cursorY = event.clientY - rect.top;

  // Calculate zoom factor
  const delta = -event.deltaY;
  const factor = delta > 0 ? 1.07 : 0.93;
  const newScale = clamp(scale * factor, 0.4, 2.2);

  // Calculate new offset to keep cursor point stationary
  // Formula: newOffset = cursor - (cursor - oldOffset) * (newScale / oldScale)
  const scaleRatio = newScale / scale;
  const newOffsetX = cursorX - (cursorX - offset.x) * scaleRatio;
  const newOffsetY = cursorY - (cursorY - offset.y) * scaleRatio;

  setScale(newScale);
  setOffset({ x: newOffsetX, y: newOffsetY });
}
```

### Pattern 2: Smooth Panning with Pointer Events
**What:** Drag-to-pan using pointer capture
**When to use:** Always for canvas navigation
**Example:**
```typescript
// Current implementation is correct, just needs integration with zoom

function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
  if (event.button !== 0) return;
  const target = event.target as HTMLElement;
  if (target.closest("button")) return; // Don't pan when clicking buttons

  setIsPanning(true);
  (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  panStart.current = {
    x: event.clientX,
    y: event.clientY,
    ox: offset.x,
    oy: offset.y,
  };
}

function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
  if (!isPanning || !panStart.current) return;

  const dx = event.clientX - panStart.current.x;
  const dy = event.clientY - panStart.current.y;
  setOffset({
    x: panStart.current.ox + dx,
    y: panStart.current.oy + dy
  });
}
```

### Pattern 3: Reset View / Fit Content
**What:** Center all content in viewport
**When to use:** Reset button, initial load
**Example:**
```typescript
// Calculate bounds of all content
function getBounds(boards: PlanBoard[]) {
  if (boards.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  boards.forEach(b => {
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.w);
    maxY = Math.max(maxY, b.y + b.h);
  });
  return { minX, minY, maxX, maxY };
}

function resetView(containerWidth: number, containerHeight: number) {
  const bounds = getBounds(boards);
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;

  // Calculate scale to fit with padding
  const padding = 40;
  const scaleX = (containerWidth - padding * 2) / contentWidth;
  const scaleY = (containerHeight - padding * 2) / contentHeight;
  const fitScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1

  // Center content
  const offsetX = (containerWidth - contentWidth * fitScale) / 2 - bounds.minX * fitScale;
  const offsetY = (containerHeight - contentHeight * fitScale) / 2 - bounds.minY * fitScale;

  setScale(fitScale);
  setOffset({ x: offsetX, y: offsetY });
}
```

### Anti-Patterns to Avoid
- **Zoom from origin then translate:** This causes zoom to "jump" away from cursor. Always calculate new offset based on cursor position.
- **Using non-standard CSS `zoom` property:** Not standardized, use `transform: scale()` instead
- **Animating scale during zoom:** Can cause "swooping" motion. If animating, use `translate(calc(x * scale), calc(y * scale)) scale(scale)` order
- **Forgetting pointer capture:** Can lose drag events if cursor moves outside container
- **Not preventing default on wheel:** Page will scroll instead of zooming canvas

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Complete zoom/pan system | Custom mouse/touch handlers | react-zoom-pan-pinch | Handles touch gestures, pinch-zoom, edge cases, accessibility |
| D3-style interactions | Custom zoom behavior | d3-zoom | Battle-tested gesture handling, smooth animations, deceleration |
| Coordinate transformations | Manual matrix math | DOMMatrix / CSS transforms | Browser-optimized, handles edge cases |

**Key insight:** The cursor-centered zoom calculation is simple enough to implement directly (8 lines), but if you need touch gestures, pinch-zoom, or momentum panning, use a library. For this phase (desktop mouse-only), custom implementation is appropriate.

## Common Pitfalls

### Pitfall 1: Transform Order in CSS
**What goes wrong:** Using `scale() translate()` order causes translate values to be multiplied by scale during animations, creating "swooping" motion
**Why it happens:** CSS applies transforms right-to-left in the transform chain
**How to avoid:** Use `translate() scale()` order for instant updates, or `translate(calc(x * scale), calc(y * scale)) scale(scale)` for animations
**Warning signs:** Zoom animations feel non-linear or content "swoops" toward target

### Pitfall 2: Coordinate Space Confusion
**What goes wrong:** Calculating cursor position in wrong coordinate space (page vs viewport vs canvas)
**Why it happens:** Mouse events give page coordinates, but offset needs viewport coordinates
**How to avoid:** Always use `event.clientX/Y - rect.left/top` to get viewport-relative coordinates
**Warning signs:** Zoom works but centers on wrong point, especially when page is scrolled

### Pitfall 3: Scale Clamping After Calculation
**What goes wrong:** Calculating new offset with unclamped scale, then clamping scale separately
**Why it happens:** Separating scale calculation from offset calculation
**How to avoid:** Calculate newScale with clamping first, then use clamped value for offset calculation
**Warning signs:** Zoom "sticks" at min/max values and offset drifts

### Pitfall 4: Not Accounting for Container Position
**What goes wrong:** Using `event.offsetX/Y` directly without checking what element it's relative to
**Why it happens:** `offsetX/Y` is relative to target element, not container
**How to avoid:** Use `getBoundingClientRect()` and calculate position relative to container
**Warning signs:** Zoom point is wrong when hovering over child elements (posters)

### Pitfall 5: Forgetting to Memoize Transform Style
**What goes wrong:** Creating new transform object on every render causes unnecessary re-renders
**Why it happens:** Object literal creates new reference each time
**How to avoid:** Use `useMemo` with dependencies on offset.x, offset.y, scale
**Warning signs:** Performance degrades, React DevTools shows excessive re-renders

## Code Examples

Verified patterns from official sources:

### Complete Zoom-to-Cursor Implementation
```typescript
// Source: https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/
// Source: https://www.freecodecamp.org/news/how-to-create-a-figma-miro-style-canvas-with-react-and-typescript/
// Verified pattern, adapted for CSS transforms

function onWheel(event: React.WheelEvent<HTMLDivElement>) {
  event.preventDefault();

  // Step 1: Get cursor position in viewport coordinates
  const rect = event.currentTarget.getBoundingClientRect();
  const viewportX = event.clientX - rect.left;
  const viewportY = event.clientY - rect.top;

  // Step 2: Calculate new scale with clamping
  const delta = -event.deltaY;
  const zoomFactor = delta > 0 ? 1.07 : 0.93;
  const newScale = clamp(scale * zoomFactor, 0.4, 2.2);

  // Step 3: Calculate how much to adjust offset
  // The point under the cursor should remain stationary
  // Formula: newOffset = cursor - (cursor - oldOffset) * (newScale / oldScale)
  const scaleRatio = newScale / scale;

  setOffset({
    x: viewportX - (viewportX - offset.x) * scaleRatio,
    y: viewportY - (viewportY - offset.y) * scaleRatio,
  });
  setScale(newScale);
}
```

### Mathematical Explanation
```typescript
// Understanding the formula: newOffset = cursor - (cursor - oldOffset) * scaleRatio
//
// Let's say:
// - Cursor is at viewport position (400, 300)
// - Current offset is (100, 50)
// - Current scale is 1.0
// - New scale is 1.1 (zooming in 10%)
//
// Point in canvas space BEFORE zoom:
// canvasPoint = (cursor - offset) / scale
// canvasPoint = (400 - 100) / 1.0 = 300
//
// We want this canvas point to remain at the same viewport position AFTER zoom.
// After zoom, for the point to stay at viewport position 400:
// 400 = newOffset + canvasPoint * newScale
// newOffset = 400 - 300 * 1.1
// newOffset = 400 - 330 = 70
//
// Using the formula:
// newOffset = 400 - (400 - 100) * (1.1 / 1.0)
// newOffset = 400 - 300 * 1.1
// newOffset = 400 - 330 = 70 ✓
```

### Reset View with Content Bounds
```typescript
// Pattern: Calculate bounds, fit to viewport with padding
function resetView() {
  if (boards.length === 0) {
    setOffset({ x: 0, y: 0 });
    setScale(1);
    return;
  }

  // Get container dimensions
  const container = containerRef.current;
  if (!container) return;
  const rect = container.getBoundingClientRect();

  // Calculate content bounds
  const bounds = getBounds(boards);
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const centerX = bounds.minX + contentWidth / 2;
  const centerY = bounds.minY + contentHeight / 2;

  // Fit to viewport with padding
  const padding = 40;
  const scaleX = (rect.width - padding * 2) / contentWidth;
  const scaleY = (rect.height - padding * 2) / contentHeight;
  const fitScale = Math.min(scaleX, scaleY, 1);

  // Center the content
  const viewportCenterX = rect.width / 2;
  const viewportCenterY = rect.height / 2;

  setScale(fitScale);
  setOffset({
    x: viewportCenterX - centerX * fitScale,
    y: viewportCenterY - centerY * fitScale,
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Canvas transforms (ctx.scale/translate) | CSS transforms | 2020+ | GPU acceleration, no redraw needed |
| transform-origin property | translate-scale-translate | 2024+ | Better animation control, explicit positioning |
| Separate zoom CSS property | transform: scale() | Always | Standard, cross-browser, composable |
| Mouse events only | Pointer events | 2018+ | Unified handling of mouse/touch/pen |

**Deprecated/outdated:**
- CSS `zoom` property: Non-standard, use `transform: scale()` instead
- `offsetX/offsetY` for canvas coordinates: Relative to event target, not reliable. Use `clientX/Y` with `getBoundingClientRect()`
- Storing transform matrix manually: Use CSS transforms and let browser handle it

## Open Questions

1. **Touch gesture support**
   - What we know: Not required for Phase 1 (desktop focus)
   - What's unclear: Whether to add pinch-zoom support in later phase
   - Recommendation: Defer to future phase, would require library or significant gesture handling code

2. **Momentum/inertia panning**
   - What we know: Nice-to-have feature, not in requirements
   - What's unclear: User expectation for "spatial navigation"
   - Recommendation: Add if user testing shows need, libraries like d3-zoom provide this

3. **Reset view animation**
   - What we know: Current resetView is instant
   - What's unclear: Should it animate? (Figma animates, Miro is instant)
   - Recommendation: Start instant, add animation in polish phase if desired

## Sources

### Primary (HIGH confidence)
- [Transforming Mouse Coordinates to Canvas Coordinates – roblouie](https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/) - Core zoom-to-cursor math
- [Animating zooming using CSS: transform order - Jake Archibald](https://jakearchibald.com/2025/animating-zooming/) - 2025 best practices on transform order
- [How to Create a Figma/Miro Style Canvas - freeCodeCamp](https://www.freecodecamp.org/news/how-to-create-a-figma-miro-style-canvas-with-react-and-typescript/) - React implementation tutorial
- [Performant Drag and Zoom - Medium](https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b) - CSS transform performance insights

### Secondary (MEDIUM confidence)
- [react-zoom-pan-pinch GitHub](https://github.com/BetterTyped/react-zoom-pan-pinch) - Popular library (50k+ weekly downloads)
- [d3-zoom documentation](https://d3js.org/d3-zoom) - Industry standard zoom behavior
- [React Flow Viewport Concepts](https://reactflow.dev/learn/concepts/the-viewport) - Viewport state management patterns
- Multiple tutorial sites (Konva docs, HTML5 Canvas tutorials) - Community patterns

### Tertiary (LOW confidence)
- WebSearch results for "pan zoom canvas library React TypeScript 2026" - Library landscape overview
- Various CodePen/Gist examples - Pattern validation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - CSS transforms are industry standard, well-documented
- Architecture: HIGH - Patterns verified across multiple authoritative sources, math validated
- Pitfalls: HIGH - Transform order issues documented in 2025 by Jake Archibald, coordinate space issues are fundamental

**Research date:** 2026-02-04
**Valid until:** 2026-03-04 (30 days - stable domain, patterns unlikely to change)
