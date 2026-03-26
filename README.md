# MADMall

**A virtual luxury outdoor mall and teaching clinic for Black women living with Graves' disease.**

Governed by [The Living Constitution](https://github.com/coreyalejandro/the-living-constitution) — constitutional governance applied to a real healthcare product serving a real, underserved population.

---

## What MADMall Is

MADMall is a community wellness platform — **non-clinical by constitutional constraint**. It does not diagnose, treat, or prescribe. It provides:

- **Community** — Sisterhood Lounge (real-time chat with culturally safe moderation)
- **Events** — Live Experiences (event scheduling and RSVP)
- **Services** — Service Directory (booking + payments for wellness providers)
- **Identity** — User Profiles and Avatars
- **Safety** — AI-governed content moderation that respects AAVE and culturally resonant communication

## Why It Exists

Black women are disproportionately affected by Graves' disease. The systems that should protect them were not designed for them. MADMall is safety work on its own terms — a governed product where every feature traces to a mission goal: **reducing isolation for Black women with Graves' disease.**

---

## Quick Start

```sh
pnpm install
pnpm dev
```

### Dev Server URLs

| App | URL | Purpose |
|-----|-----|---------|
| **Web** | http://localhost:3001 | Marketing + mall interface |
| **App** | http://localhost:3000 | Main application (auth, profiles) |
| **API** | http://localhost:3002 | RESTful API |
| **Email** | http://localhost:3003 | Email templates |
| **Docs** | http://localhost:3004 | Documentation |
| **Storybook** | http://localhost:6006 | Component library |

### MADMall Sections

| Section | URL | Description |
|---------|-----|-------------|
| **Plan** | http://localhost:3001/plan | Interactive infinite canvas with blueprints |
| **ML Training** | http://localhost:3001/ml | Data collection + training pipeline |
| **Agents** | http://localhost:3001/agents | Agent curriculum artifacts |

---

## Governance

MADMall operates under The Living Constitution (TLC). All five Articles apply:

| Article | Application |
|---------|-------------|
| **I — Bill of Rights** | Safety, accessibility, dignity, clarity, truth in every interaction |
| **II — Execution Law** | Immutable data, truth-status discipline, security enforcement |
| **III — Purpose Law** | Every feature maps to the mission. No feature ships without purpose evidence |
| **IV — Separation of Powers** | Agent roles are bounded. No agent deploys without human approval |
| **V — Amendment Process** | Failures become lessons, lessons become amendments |

### External Standards Alignment

| Standard | Application |
|----------|-------------|
| **NIST SSDF** (SP 800-218) | Secure SDLC practices as auditable artifacts |
| **NIST AI RMF** (AI 100-1) | AI governance for moderation, recommendations, content |
| **OpenSSF Scorecard** | Supply-chain security: branch protection, dependency hygiene |

---

## Architecture

MADMall is a Turborepo monorepo with 7 apps and 20 shared packages:

```
mad-mall-production/
├── apps/
│   ├── web/        # Marketing + mall (port 3001)
│   ├── app/        # Main application (port 3000)
│   ├── api/        # API server (port 3002)
│   ├── docs/       # Documentation (port 3004)
│   ├── email/      # Email templates (port 3003)
│   ├── storybook/  # Component library (port 6006)
│   └── studio/     # CMS studio
├── packages/
│   ├── ai/                  # AI integration
│   ├── analytics/           # Web + product analytics
│   ├── auth/                # Authentication (Clerk)
│   ├── cms/                 # Content management
│   ├── collaboration/       # Real-time features
│   ├── database/            # Prisma ORM + PostgreSQL
│   ├── design-system/       # Component library
│   ├── email/               # Transactional emails (Resend)
│   ├── feature-flags/       # Feature flag management
│   ├── internationalization/# Multi-language support
│   ├── next-config/         # Shared Next.js config
│   ├── notifications/       # In-app notifications
│   ├── observability/       # Error tracking (Sentry)
│   ├── payments/            # Stripe integration
│   ├── rate-limit/          # Rate limiting (Upstash)
│   ├── security/            # Security headers (Arcjet)
│   ├── seo/                 # Metadata + sitemaps
│   ├── storage/             # File uploads
│   ├── typescript-config/   # Shared TS config
│   └── webhooks/            # Webhook handling
└── tasks/
    ├── todo.md              # Sprint tracker
    ├── lessons.md           # Amendment log (Article V)
    └── pause-state.md       # SOP-013 recovery state
```

---

## Source Evidence

| Repository | Contains |
|-----------|----------|
| [the-living-constitution](https://github.com/coreyalejandro/the-living-constitution) | Governance specification, all five Articles, build contracts |
| [kiro-hackathon-mad-mall](https://github.com/coreyalejandro/kiro-hackathon-mad-mall) | Feature modules, information architecture, UI references |
| [black-women-and-graves-disease](https://github.com/coreyalejandro/black-women-and-graves-disease) | Research report, Phase 3 specs, clinical literature grounding |

---

## Foundation

Built on [next-forge](https://github.com/vercel/next-forge) by Vercel — a production-grade Turborepo template for Next.js. The scaffold provides the delivery chassis; The Living Constitution provides the governance.

## License

MIT
