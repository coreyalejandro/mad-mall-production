# MADMall Constitution v1.0

**A TLC Runtime-compliant constitution for the MADMall platform**

This constitution implements the Constitutional Interface from [The Living Constitution 2.0](https://github.com/coreyalejandro/the-living-constitution-2.0).

## Overview

MADMall Constitution defines 5 constitutional invariants that govern the platform's behavior:

1. **I1_NonClinicalBoundary** (Upstream) - Ensures no medical advice
2. **I2_ConsentFirst** - Requires explicit consent for data collection
3. **I3_MLValidation** - Validates ML-generated content
4. **I4_CognitiveLoad** - Enforces cognitive load limits
5. **I5_CulturalSafety** - Protects cultural context

## TLC Runtime Compliance

This constitution implements the normative TLC Runtime interface:

```typescript
interface ConstitutionalInvariant {
  id: string
  description: string
  evaluate(context: Context): InvariantState
  repair(context: Context): RepairAction
  isUpstream: boolean
  dependents: string[]
}

interface Constitution {
  id: string
  version: string
  invariants: ConstitutionalInvariant[]
  getUpstreamInvariant(): ConstitutionalInvariant | null
}
```

## Invariant Details

### I1: Non-Clinical Boundary (Upstream)

**Status**: `UPSTREAM` - Evaluated before all other invariants

**Purpose**: Ensures MADMall does NOT diagnose, treat, or prescribe. Routes to healthcare providers and supports personal experience sharing.

**Evaluation Logic**:
- Detects medical advice patterns (prescriptive language, dosage instructions, treatment claims)
- Allows personal experience sharing ("I tried...", "My doctor said...")
- Allows healthcare routing ("Talk to your doctor...")

**Repair Actions**:
- `VIOLATED` → `HALT` - Block content, require rephrasing
- `AMBIGUOUS` → `PROMPT_USER` - Ask for clarification
- `SATISFIED` → `DISCLOSE` - Log and proceed

**Dependencies**: All other invariants depend on this being SATISFIED first.

### I2: Consent-First Data

**Purpose**: All data collection requires explicit, granular, revocable consent.

**Evaluation Logic**:
- Checks for `consentGranted` flag
- Validates `consentType` and `dataTypes` are specified
- Returns `NOT_APPLICABLE` if not a data collection action

**Repair Actions**:
- `VIOLATED` → `HALT` - Present consent dialog
- `AMBIGUOUS` → `PROMPT_USER` - Request complete consent details

### I3: ML Validation Required

**Purpose**: All ML-generated content must be validated by qualified humans before publication.

**Evaluation Logic**:
- Checks if content is ML-generated
- Validates `validationStatus` (PENDING, APPROVED, REJECTED)
- Requires `validatedBy` field for approved content

**Repair Actions**:
- `VIOLATED` → `HALT` - Route to validator
- `AMBIGUOUS` → `ESCALATE` - Assign to validation queue

### I4: Cognitive Load Limits

**Purpose**: Content and interactions must respect cognitive load limits.

**Evaluation Logic**:
- Content length limit: 5000 characters
- Nested complexity limit: 3 levels deep
- Concurrent operations limit: 5 simultaneous

**Repair Actions**:
- `VIOLATED` → `HALT` - Simplify content or structure

### I5: Cultural Safety

**Purpose**: Content must respect cultural context and community norms.

**Evaluation Logic**:
- Checks for `culturalContext` and `community` fields
- Flags content with `culturalSafetyFlag` for review

**Repair Actions**:
- `AMBIGUOUS` → `ESCALATE` - Route to community moderator

## Usage

### Load Constitution

```typescript
import { madmallConstitution } from './madmall-constitution'

console.log(madmallConstitution.id) // "madmall"
console.log(madmallConstitution.version) // "1.0.0"
console.log(madmallConstitution.invariants.length) // 5
```

### Evaluate Invariants

```typescript
import { madmallConstitution } from './madmall-constitution'

const context = {
  sessionId: 'session-123',
  turn: 1,
  payload: {
    content: 'You should take 50mg daily',
    action: 'post_content'
  },
  history: []
}

// Get upstream invariant
const upstream = madmallConstitution.getUpstreamInvariant()
console.log(upstream?.id) // "I1_NonClinicalBoundary"

// Evaluate
const state = upstream?.evaluate(context)
console.log(state) // "VIOLATED"

// Get repair action
if (state === 'VIOLATED' || state === 'AMBIGUOUS') {
  const repair = upstream?.repair(context)
  console.log(repair.type) // "HALT"
  console.log(repair.message) // "Content violates non-clinical boundary..."
  console.log(repair.blocking) // true
}
```

### Evaluate All Invariants

```typescript
import { madmallConstitution } from './madmall-constitution'

function evaluateAllInvariants(context: Context) {
  const results = new Map<string, InvariantState>()
  
  // Evaluate upstream first
  const upstream = madmallConstitution.getUpstreamInvariant()
  if (upstream) {
    const state = upstream.evaluate(context)
    results.set(upstream.id, state)
    
    // If upstream is VIOLATED, halt immediately
    if (state === 'VIOLATED') {
      return { halted: true, repair: upstream.repair(context) }
    }
  }
  
  // Evaluate downstream invariants
  for (const invariant of madmallConstitution.invariants) {
    if (invariant.isUpstream) continue
    
    const state = invariant.evaluate(context)
    results.set(invariant.id, state)
    
    if (state === 'VIOLATED' || state === 'AMBIGUOUS') {
      return { halted: true, repair: invariant.repair(context) }
    }
  }
  
  return { halted: false, results }
}
```

## Evidence Chain

All invariant evaluations should be logged to an append-only evidence chain:

```typescript
interface EvidenceEntry {
  entry_id: string
  timestamp: string // ISO 8601
  session_id: string
  turn: number
  invariant_id: string
  state: InvariantState
  repair_action?: RepairAction
  runtime_state: 'RUNNING' | 'HALTED' | 'AWAITING_FEEDBACK' | 'LOCKED' | 'TERMINATED'
  integrity_hash: string
}
```

Evidence files are stored in `evidence/<sessionId>/` directory.

## Integration with MADMall

### Database Schema

The Prisma schema includes fields for constitutional enforcement:

```prisma
model Post {
  containsMedicalAdvice Boolean @default(false)  // I1
  medicalAdviceFlags    String[]                 // I1
  // ... other fields
}

model ConsentRecord {
  consentType String   // I2
  granted     Boolean  // I2
  dataTypes   String[] // I2
  // ... other fields
}

model ResearchData {
  validationStatus String?  // I3
  validatedBy      String?  // I3
  // ... other fields
}
```

### Content Filter Integration

The content filter package uses I1 logic:

```typescript
import { madmallConstitution } from '@/constitution/madmall-constitution'

const upstream = madmallConstitution.getUpstreamInvariant()

export function filterContent(content: string) {
  const context = {
    sessionId: generateId(),
    turn: 1,
    payload: { content },
    history: []
  }
  
  const state = upstream?.evaluate(context)
  
  if (state === 'VIOLATED') {
    const repair = upstream?.repair(context)
    return { allowed: false, message: repair.message }
  }
  
  return { allowed: true }
}
```

## Verification

Run constitutional tests:

```bash
pnpm test constitutional-constraints
```

Expected output:
```
✓ I1: Non-Clinical Boundary
✓ I2: Consent-First Data
✓ I3: ML Validation Required
✓ I4: Cognitive Load Limits
✓ I5: Cultural Safety
```

## Version History

- **v1.0.0** (2026-06-23) - Initial TLC-compliant constitution
  - 5 constitutional invariants
  - Upstream invariant: I1_NonClinicalBoundary
  - Full TLC Runtime interface compliance

## References

- [The Living Constitution 2.0](https://github.com/coreyalejandro/the-living-constitution-2.0)
- [TLC Runtime Paper](https://github.com/coreyalejandro/the-living-constitution-2.0/tree/main/modules/tlc-runtime)
- [Constitutional Interface](https://github.com/coreyalejandro/the-living-constitution-2.0/blob/main/src/interfaces/constitutional-invariant.ts)