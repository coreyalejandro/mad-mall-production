# @repo/safety-layer

Constitutional safety components for MADMall, implementing TLC Article I (Right to Safety).

## Components

### ExitStrategy
One-keystroke exit (Shift+Esc) with no trace left behind.

```tsx
import { ExitStrategy } from '@repo/safety-layer'

<ExitStrategy position="top-right" label="Exit" />
```

**Features:**
- Keyboard shortcut: Shift+Esc
- Clears session storage, local storage, and cookies
- Redirects to safe URL (default: about:blank)
- Accessible via keyboard and screen reader

### PanicButton
Immediate access to 988 crisis line, always visible.

```tsx
import { PanicButton } from '@repo/safety-layer'

<PanicButton position="fixed" label="Get Help" pulse />
```

**Features:**
- Direct link to 988 crisis line
- Always visible (fixed position)
- Optional pulse animation
- High contrast for visibility
- Touch-friendly (48px minimum tap target)

### GroundingReset
Box-breathing ritual (4-4-6 pattern) for grounding during distress.

```tsx
import { GroundingReset } from '@repo/safety-layer'

<GroundingReset technique="breathing" autoStart={false} />
```

**Features:**
- Box breathing technique (4-4-6: inhale-hold-exhale)
- Visual breathing guide with animation
- Step-by-step instructions
- Keyboard dismissible (Escape key)
- Screen reader accessible

### SafetyLayer
Combines all three safety components into a single layer.

```tsx
import { SafetyLayer } from '@repo/safety-layer'

<SafetyLayer />
```

This component should be included in the root layout of every MADMall app.

## Constitutional Requirement

These components are **constitutional requirements** under TLC Article I (Right to Safety), not optional features. Every room in MADMall must include the SafetyLayer.

## Installation

This package is part of the MADMall monorepo and is not published separately.

```bash
# In your app's package.json
{
  "dependencies": {
    "@repo/safety-layer": "workspace:*"
  }
}
```

## Usage in Next.js App

```tsx
// app/layout.tsx
import { SafetyLayer } from '@repo/safety-layer'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SafetyLayer />
        {children}
      </body>
    </html>
  )
}
```

## Accessibility

All components meet WCAG 2.1 AA standards:
- Keyboard navigable
- Screen reader compatible
- Sufficient color contrast
- Touch-friendly tap targets (48px minimum)

## Testing

```bash
pnpm test
```

## License

MIT