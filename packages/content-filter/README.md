# @madmall/content-filter

Non-clinical boundary enforcement for MADMall - Constitutional Constraint #1.

## Purpose

This package enforces TLC Article I, Constraint #1: **Non-Clinical Boundary**

> MADMall does NOT diagnose, treat, or prescribe. It routes to healthcare providers and supports personal experience sharing.

## Features

- **Medical Advice Detection**: Pattern-based detection of diagnostic, treatment, and prescriptive language
- **Context-Aware Filtering**: Allows personal experience sharing and healthcare routing
- **Severity Levels**: `none`, `warning`, `block` with confidence scoring
- **Batch Processing**: Filter multiple content items efficiently
- **Helpful Suggestions**: Provides guidance on how to rephrase blocked content

## Installation

```bash
pnpm add @madmall/content-filter
```

## Usage

### Basic Filtering

```typescript
import { filterContent, isContentSafe } from '@madmall/content-filter'

// Check if content is safe
const safe = isContentSafe('I tried this medication and it worked for me')
// Returns: true

// Get detailed filtering result
const result = filterContent('You should take 50mg daily')
// Returns: {
//   allowed: false,
//   severity: 'block',
//   flags: [...],
//   confidence: 0.95,
//   suggestions: [...]
// }
```

### Strict Mode

```typescript
const result = filterContent(content, { strictMode: true })
// In strict mode, warnings are treated as blocks
```

### Helper Functions

```typescript
import { getViolations, getSuggestions } from '@madmall/content-filter'

// Get list of violations
const violations = getViolations('You should take this medication')
// Returns: ['medical_advice', 'prescriptive_language']

// Get suggestions for improvement
const suggestions = getSuggestions('You should take this')
// Returns: [
//   'Share your personal experience instead: "I tried..."',
//   'Route to healthcare: "Talk to your doctor about..."'
// ]
```

### Batch Processing

```typescript
import { filterBatch } from '@madmall/content-filter'

const results = filterBatch([
  'I tried this and it helped',
  'You should take 10mg',
  'Talk to your doctor'
])
// Returns array of FilterResult objects
```

## What Gets Blocked

### Medical Advice Patterns
- Diagnostic language: "You have...", "You definitely have..."
- Treatment claims: "This will cure...", "This treats..."
- Prescriptive language: "You should take...", "Take X mg..."
- Dosage instructions: "50mg daily", "twice a day"
- Medication changes: "Stop taking...", "Switch to..."

### Example Violations

```typescript
// ❌ BLOCKED
"You should take 50mg of methimazole"
"This will cure your Graves disease"
"You definitely have hyperthyroidism"
"Stop taking your medication"

// ✅ ALLOWED
"I tried methimazole and it worked for me"
"My doctor recommended a lower dose"
"You should talk to your doctor about this"
"Research shows early diagnosis helps"
```

## What Gets Allowed

### Personal Experience
- "I tried X and it helped me"
- "My experience with Y was..."
- "I found that Z worked for me"

### Healthcare Routing
- "Talk to your doctor about..."
- "You should consult an endocrinologist"
- "Ask your healthcare provider"

### Information Sharing
- "Research shows..."
- "Studies indicate..."
- "According to medical literature..."

### With Disclaimers
- "This is not medical advice. I tried X..."
- "Talk to your doctor. In my experience..."

## Filter Result Structure

```typescript
interface FilterResult {
  allowed: boolean           // Can content be posted?
  severity: 'none' | 'warning' | 'block'
  flags: string[]           // List of violations found
  confidence: number        // 0-1 confidence score
  suggestions?: string[]    // How to rephrase (if blocked)
}
```

## Constitutional Alignment

This package enforces:
- **TLC Article I, Constraint #1**: Non-Clinical Boundary
- **TLC Article II, Section 2**: Content moderation requirements
- **TLC Article V**: Safety-first principles

## Testing

```bash
pnpm test
```

See `__tests__/filter.test.ts` for comprehensive test coverage including:
- Medical advice detection
- Personal experience allowance
- Healthcare routing
- Edge cases
- Real-world examples

## Integration

### With Database

```typescript
import { PrismaClient } from '@madmall/database'
import { filterContent } from '@madmall/content-filter'

const prisma = new PrismaClient()

async function createPost(content: string, userId: string) {
  const filterResult = filterContent(content)
  
  if (!filterResult.allowed) {
    throw new Error('Content violates non-clinical boundary')
  }
  
  return prisma.post.create({
    data: {
      content,
      userId,
      containsMedicalAdvice: filterResult.severity === 'warning',
      medicalAdviceFlags: filterResult.flags
    }
  })
}
```

### With API Middleware

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { filterContent } from '@madmall/content-filter'

export async function POST(req: NextRequest) {
  const { content } = await req.json()
  
  const result = filterContent(content)
  
  if (!result.allowed) {
    return NextResponse.json({
      error: 'Content violates non-clinical boundary',
      suggestions: result.suggestions
    }, { status: 400 })
  }
  
  // Process content...
}
```

### With React Components

```typescript
import { useState } from 'react'
import { filterContent } from '@madmall/content-filter'

function PostEditor() {
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = () => {
    const result = filterContent(content)
    
    if (!result.allowed) {
      setError(`Content blocked: ${result.flags.join(', ')}`)
      return
    }
    
    // Submit content...
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      {error && <div className="error">{error}</div>}
      <button type="submit">Post</button>
    </form>
  )
}
```

## Performance

- **Single filter**: ~1-2ms
- **Batch processing**: ~0.5ms per item
- **Memory**: Minimal (pattern-based, no ML models)

## Limitations

- Pattern-based detection (not AI/ML)
- English language only (currently)
- May have false positives/negatives
- Requires human moderation as backup

## Future Enhancements

- [ ] Multi-language support
- [ ] ML-based classification
- [ ] Custom pattern configuration
- [ ] Real-time learning from moderation decisions
- [ ] Integration with external content safety APIs

## License

MIT

## Contributing

See main repository CONTRIBUTING.md for guidelines.