# MADMall Production

**A TLC 2.0-Compliant Constitutional Platform for Health Communities**

[![TLC 2.0 Compliant](https://img.shields.io/badge/TLC%202.0-Compliant-green)](https://github.com/coreyalejandro/the-living-constitution-2.0)
[![Constitutional Governance](https://img.shields.io/badge/Governance-Constitutional-blue)]()
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()

---

## Overview

MADMall is a health community platform with **constitutional AI governance** powered by [The Living Constitution 2.0](https://github.com/coreyalejandro/the-living-constitution-2.0). It enforces 5 constitutional invariants that protect users while enabling authentic community support.

### Constitutional Invariants

1. **I1_NonClinicalBoundary** (Upstream) - No medical advice, routes to healthcare
2. **I2_ConsentFirst** - Explicit, granular, revocable consent
3. **I3_MLValidation** - Human validation of ML content
4. **I4_CognitiveLoad** - Cognitive load limits
5. **I5_CulturalSafety** - Cultural context protection

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/coreyalejandro/mad-mall-production
cd mad-mall-production

# Install dependencies
pnpm install

# Set up database
cd packages/database
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed

# Run governance check
cd ../..
pnpm check:governance

# Start development server
pnpm dev:madmall
```

---

## Repository Structure

```
mad-mall-production/
│
├── src/
│   └── constitution/              # TLC 2.0-compliant constitution
│       ├── tlc-interface.ts       # TLC Runtime interface types
│       ├── madmall-constitution.ts # MADMall Constitution v1.0
│       └── README.md              # Constitution documentation
│
├── apps/
│   └── madmall/                   # Main Next.js application
│       ├── app/
│       │   └── layout.tsx         # Root layout with SafetyLayer
│       ├── package.json
│       └── next.config.ts
│
├── packages/
│   ├── safety-layer/              # Safety components (ExitStrategy, PanicButton, GroundingReset)
│   ├── content-filter/            # Non-clinical boundary enforcement
│   ├── database/                  # Prisma schema with constitutional fields
│   ├── analytics/                 # Privacy-preserving analytics
│   ├── auth/                      # Authentication
│   └── [other packages]/
│
├── scripts/
│   └── check-governance.ts        # Automated governance validation
│
├── .github/
│   └── workflows/
│       └── governance.yml         # CI/CD constitutional enforcement
│
├── __tests__/                     # Test suites
│   ├── constitutional-constraints.test.ts
│   └── safety-components.test.tsx
│
├── docs/
│   ├── reports/                   # Evaluation and implementation reports
│   └── planning/                  # Architecture and planning docs
│
└── archive/                       # Historical artifacts
    ├── notebooks/                 # Research notebooks
    ├── prototypes/                # Early prototypes
    └── legacy-docs/               # Legacy documentation
```

---

## Key Features

### 🛡️ Constitutional Governance

- **TLC 2.0 Runtime Interface**: Implements normative constitutional contract
- **5 Enforced Invariants**: Programmatic enforcement of all constraints
- **Upstream Primacy**: Non-clinical boundary gates all downstream operations
- **Evidence Chain Ready**: Tamper-evident audit logging support

### 🚨 Safety Components

- **ExitStrategy**: Shift+Esc quick exit with data clearing
- **PanicButton**: Immediate 988 crisis line access
- **GroundingReset**: Box breathing exercise for emotional regulation
- **Always Accessible**: Fixed positioning, keyboard navigable, WCAG AA compliant

### 🔒 Non-Clinical Boundary

- **Pattern-Based Detection**: Identifies medical advice in real-time
- **Context-Aware**: Allows personal experience and healthcare routing
- **API Middleware**: Automatic filtering at API layer
- **React Components**: Real-time validation in UI

### 📊 Database Schema

- **Constitutional Fields**: All 5 invariants represented in schema
- **Consent Tracking**: Granular, revocable consent records
- **ML Validation**: Validation workflow for ML-generated content
- **Audit Logging**: Complete action history

### ⚙️ Automated Governance

- **Pre-Commit Checks**: Validates constraints before commit
- **CI/CD Enforcement**: GitHub Actions blocks non-compliant deployments
- **Detailed Reporting**: Clear violation messages and suggestions

---

## Constitutional Compliance

### TLC 2.0 Interface

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

### MADMall Constitution v1.0

See [`src/constitution/README.md`](src/constitution/README.md) for complete documentation.

---

## Development

### Install Dependencies

```bash
pnpm install
```

### Run Tests

```bash
# All tests
pnpm test

# Specific test suites
pnpm test constitutional-constraints
pnpm test safety-components
pnpm test content-filter
```

### Governance Check

```bash
pnpm check:governance
```

Expected output:
```
✓ Safety components exist
✓ Database schema valid
✓ Content filter active
✓ Consent tracking enabled
✓ Audit logging configured

All governance checks passed!
```

### Development Server

```bash
pnpm dev:madmall
```

Open [http://localhost:3000](http://localhost:3000)

---

## Documentation

### Core Documentation

- **[Constitution README](src/constitution/README.md)** - Constitutional invariants and usage
- **[Verification & Truth](docs/reports/VERIFICATION_AND_TRUTH.md)** - V&T per TLC 2.0 standard
- **[Implementation Complete](docs/reports/IMPLEMENTATION_COMPLETE.md)** - Final implementation status
- **[Comprehensive Evaluation](docs/reports/COMPREHENSIVE_EVALUATION_REPORT.md)** - Golden-level evaluation

### Package Documentation

- **[Safety Layer](packages/safety-layer/README.md)** - Safety components usage
- **[Content Filter](packages/content-filter/README.md)** - Non-clinical boundary enforcement
- **[Database](packages/database/README.md)** - Schema and migrations

### Planning & Architecture

- **[Critical Gaps Plan](docs/reports/CRITICAL_GAPS_IMPLEMENTATION_PLAN.md)** - Implementation roadmap
- **[Phase 3 Architecture](docs/planning/PHASE3_ARCHITECTURE.md)** - System architecture

---

## Verification Standard

Every empirical claim is backed by a **VERIFICATION_AND_TRUTH.md** file that specifies:

- **EXISTS**: What was verified and present
- **VERIFIED AGAINST**: The actual artifact or output
- **NOT CLAIMED**: What this does not establish
- **FUNCTIONAL STATUS**: Current state of implementation

See [docs/reports/VERIFICATION_AND_TRUTH.md](docs/reports/VERIFICATION_AND_TRUTH.md)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run `pnpm check:governance`
5. Run `pnpm test`
6. Submit pull request

All PRs must pass governance checks in CI/CD.

---

## License

MIT

---

## References

- **[The Living Constitution 2.0](https://github.com/coreyalejandro/the-living-constitution-2.0)** - Constitutional runtime framework
- **[TLC Runtime Paper](https://github.com/coreyalejandro/the-living-constitution-2.0/tree/main/modules/tlc-runtime)** - Runtime architecture
- **[Constitutional Interface](https://github.com/coreyalejandro/the-living-constitution-2.0/blob/main/src/interfaces/constitutional-invariant.ts)** - Normative contract

---

## Status

**Current Version**: 1.0.0  
**TLC Compliance**: 2.0 Interface-Compliant  
**Constitutional Invariants**: 5 Implemented  
**Test Coverage**: ~80%  
**Production Ready**: ✅

---

**The Living Constitution is now living code.**
