# External Integrations

**Analysis Date:** 2026-02-03

## APIs & External Services

**Authentication:**
- Clerk (`@clerk/nextjs@6.36.0`)
  - What it's used for: User authentication, sign-in/sign-up flows, user management
  - SDK/Client: `@clerk/nextjs`
  - Server Auth: `CLERK_SECRET_KEY`
  - Public Key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - Webhooks: Configured at `packages/webhooks/index.ts` for user events
  - Webhook Secret: `CLERK_WEBHOOK_SECRET`
  - Endpoints: Sign-in at `NEXT_PUBLIC_CLERK_SIGN_IN_URL` ("/sign-in"), Sign-up at `NEXT_PUBLIC_CLERK_SIGN_UP_URL` ("/sign-up")

**Payments & Billing:**
- Stripe (`stripe@20.0.0`)
  - What it's used for: Payment processing, subscriptions, billing
  - SDK/Client: `stripe`
  - Auth: `STRIPE_SECRET_KEY`
  - Webhook Handler: `apps/api/app/webhooks/payments/route.ts`
  - Webhook Secret: `STRIPE_WEBHOOK_SECRET`
  - Integration: `@stripe/agent-toolkit@0.7.12` for AI agent interactions
  - Listener Command: `npm run stripe` (listens to localhost:3002/webhooks/payments)

**Email Delivery:**
- Resend (`resend@6.5.2`)
  - What it's used for: Transactional and marketing email delivery
  - SDK/Client: `resend`
  - Server Auth: `RESEND_TOKEN` (must start with "re_")
  - From Address: `RESEND_FROM` (email address)
  - Implementation: `packages/email/` with React email components

**Content Management:**
- Basehub (`basehub@9.5.3`)
  - What it's used for: Headless CMS for content/pages
  - SDK/Client: `basehub`
  - Auth: `BASEHUB_TOKEN` (must start with "bshb_pk_")
  - Dev Command: `npm run dev:basehub` in `apps/studio`
  - Build Command: `npm run build` in `packages/cms`
  - Implementation: `packages/cms/` with GraphQL API

**Analytics & Events:**

- PostHog (`posthog-js@1.302.2`, `posthog-node@5.17.2`)
  - What it's used for: User behavior analytics, event tracking
  - Client Auth: `NEXT_PUBLIC_POSTHOG_KEY` (must start with "phc_")
  - Client Host: `NEXT_PUBLIC_POSTHOG_HOST` (optional custom endpoint)
  - Server Package: `posthog-node` for server-side events
  - Implementation: `packages/analytics/`

- Google Analytics (`@next/third-parties@16.0.7`)
  - What it's used for: Website analytics and conversion tracking
  - Client Auth: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (must start with "G-")
  - Implementation: Integrated via `@next/third-parties`

- Vercel Analytics (`@vercel/analytics@1.6.1`)
  - What it's used for: Web vitals and performance monitoring
  - Implementation: Automatic in Vercel deployment
  - Package: `packages/analytics/`

**Error Tracking & Observability:**

- Sentry (`@sentry/nextjs@10.29.0`)
  - What it's used for: Error tracking, performance monitoring, session replay
  - Server Config: `SENTRY_ORG`, `SENTRY_PROJECT`
  - Client Auth: `NEXT_PUBLIC_SENTRY_DSN`
  - Enabled: Only on Vercel production (`VERCEL` env var)
  - Integration: Via `packages/observability/next-config.ts` - `withSentry()`
  - Marketplace Integration: Added via Vercel Marketplace

- BetterStack/Logtail (`@logtail/next@0.2.1`)
  - What it's used for: Structured logging and log aggregation
  - Server Auth: `BETTERSTACK_API_KEY`
  - API Endpoint: `BETTERSTACK_URL`
  - Implementation: `packages/observability/`

**Real-time Collaboration:**
- Liveblocks (`@liveblocks/client@3.11.0`, `@liveblocks/react@3.11.0`, `@liveblocks/node@3.11.0`)
  - What it's used for: Real-time collaborative editing, presence, synchronization
  - Server Auth: `LIVEBLOCKS_SECRET` (must start with "sk_")
  - Implementation: `packages/collaboration/`
  - Packages: Client, React hooks, Node.js server API

**Notifications:**
- Knock (`@knocklabs/node@1.24.0`, `@knocklabs/react@0.9.4`)
  - What it's used for: In-app notifications, notification center
  - Server Auth: `KNOCK_SECRET_API_KEY` (optional)
  - Client Auth: `NEXT_PUBLIC_KNOCK_API_KEY` (optional)
  - Feed Channel: `NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID`
  - Implementation: `packages/notifications/`

**Webhook Management:**
- Svix (`svix@1.82.0`)
  - What it's used for: Webhook event routing and retry logic
  - Server Auth: `SVIX_TOKEN` (must start with "sk_" or "testsk_")
  - Implementation: `packages/webhooks/`
  - Handles: Clerk webhook routing via Svix

## Data Storage

**Databases:**
- PostgreSQL (Neon)
  - Provider: Neon via `@neondatabase/serverless`
  - Connection: `DATABASE_URL` (environment variable)
  - Client: Prisma ORM (`@prisma/client@7.1.0`)
  - Adapter: `@prisma/adapter-neon` for serverless connection pooling
  - Schema: `packages/database/prisma/schema.prisma`
  - Migrations: Managed via Prisma commands in `packages/database/`
  - Studio UI: `apps/studio` uses Prisma Studio on port 3005

**File Storage:**
- Vercel Blob (`@vercel/blob@2.0.0`)
  - What it's used for: File uploads, static asset storage
  - Auth: `BLOB_READ_WRITE_TOKEN` (optional)
  - Implementation: `packages/storage/`

**Caching & Rate Limiting:**
- Upstash Redis (`@upstash/redis@1.35.7`, `@upstash/ratelimit@2.0.7`)
  - What it's used for: Distributed rate limiting, caching
  - REST API: `UPSTASH_REDIS_REST_URL`
  - Auth: `UPSTASH_REDIS_REST_TOKEN`
  - Implementation: `packages/rate-limit/`
  - Used for API rate limiting via `@upstash/ratelimit`

## Authentication & Identity

**Auth Provider:**
- Clerk
  - Implementation: Full auth flow with NextAuth-like features
  - Location: `packages/auth/provider.tsx` - Provider component
  - Webhooks: User lifecycle events via `packages/webhooks/`
  - Theme: Customizable via `@clerk/themes`
  - URL Configuration:
    - Sign-in: `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (default: "/sign-in")
    - Sign-up: `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (default: "/sign-up")
    - Post sign-in redirect: `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` (default: "/")
    - Post sign-up redirect: `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` (default: "/")

## Monitoring & Observability

**Error Tracking:**
- Sentry (`@sentry/nextjs@10.29.0`)
  - Automatic error and exception tracking
  - Performance monitoring with Web Vitals
  - Only enabled in Vercel production environment

**Logs:**
- BetterStack/Logtail (`@logtail/next@0.2.1`) - Structured logging
- Sentry - Exception and error logging
- PostHog - Event logging

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Environment: `VERCEL`, `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_REGION`
  - Production URL: `VERCEL_PROJECT_PRODUCTION_URL`
  - Edge Runtime Support: `NEXT_RUNTIME` (nodejs or edge)

**CI Pipeline:**
- GitHub Actions (configured in `.github/`)
- Turbo caching for build optimization
- Pre-commit hooks via Biome

## Environment Configuration

**Required env vars (Server-side):**

```
# Authentication
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...

# Email
RESEND_TOKEN=re_...
RESEND_FROM=email@example.com

# Payments
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Content
BASEHUB_TOKEN=bshb_pk_...

# Observability
BETTERSTACK_API_KEY=...
BETTERSTACK_URL=https://...
SENTRY_ORG=...
SENTRY_PROJECT=...

# Real-time
LIVEBLOCKS_SECRET=sk_...

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Webhooks
SVIX_TOKEN=sk_... or testsk_...

# Notifications
KNOCK_SECRET_API_KEY=...

# Feature Flags
FLAGS_SECRET=...

# Security
ARCJET_KEY=ajkey_...

# AI
OPENAI_API_KEY=sk-...

# Storage
BLOB_READ_WRITE_TOKEN=...
```

**Required env vars (Client-side, NEXT_PUBLIC_*):**

```
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Observability
NEXT_PUBLIC_SENTRY_DSN=https://...

# Notifications
NEXT_PUBLIC_KNOCK_API_KEY=...
NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID=...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_URL=http://localhost:3004

# Vercel
VERCEL_PROJECT_PRODUCTION_URL=https://...
```

**Secrets Location:**

- Development: `.env.local` files in app directories
- Production: Vercel Environment Variables dashboard
- Validation: Type-safe via `keys.ts` files using `@t3-oss/env-nextjs`

**Example env file:**
- Location: `apps/api/.env.example`
- Contains template for all required variables

## Webhooks & Callbacks

**Incoming Webhooks:**

- Clerk User Events
  - Endpoint: `apps/api/app/webhooks/auth/route.ts`
  - Triggers: User created, updated, deleted events
  - Handler: Processes user lifecycle events
  - Webhook Secret: `CLERK_WEBHOOK_SECRET`

- Stripe Payment Events
  - Endpoint: `apps/api/app/webhooks/payments/route.ts`
  - Triggers: Payment, subscription, invoice events
  - Handler: Processes payment/billing events
  - Webhook Secret: `STRIPE_WEBHOOK_SECRET`
  - Local Testing: `npm run stripe` (Stripe CLI)

**Outgoing Webhooks:**

- Integration via Svix (`packages/webhooks/`)
  - Provides webhook event routing and retry logic
  - Used to forward Clerk webhooks via Svix

## AI/ML Integrations

**OpenAI:**
- SDK: `@ai-sdk/openai@2.0.77`
- Auth: `OPENAI_API_KEY` (must start with "sk-")
- Framework: Vercel AI SDK (`ai@5.0.107`)
- Implementation: `packages/ai/`
- Usage: LLM-powered features, chat, completions

**Stripe AI Agents:**
- Integration: `@stripe/agent-toolkit@0.7.12`
- Allows AI agents to interact with Stripe API

**Rescale:**
- Integration: `@rescale/nemo@2.0.2`
- Purpose: Computational/ML workload execution

## Security Integrations

**Rate Limiting & DDoS Protection:**
- Arcjet (`@arcjet/next@1.0.0-beta.15`)
  - Auth: `ARCJET_KEY` (must start with "ajkey_")
  - Features: Rate limiting, bot protection, attack protection
  - Configured at network/request level

**Module-level Observability:**
- `import-in-the-middle@2.0.0` - Patch imports for monitoring
- `require-in-the-middle@8.0.1` - Patch requires for monitoring
- Used for instrumenting dependencies for Sentry

## Integration Status & Optional Features

**Optional Integrations (feature flag controlled):**
- Liveblocks (real-time collaboration) - Not in base setup
- Knock (notifications) - Not in base setup
- Basehub (CMS) - Requires `BASEHUB_TOKEN`
- Analytics services - Can be disabled via feature flags

**Conditional Integrations:**
- Sentry - Only enabled when `VERCEL` environment variable is set
- Vercel Toolbar - Only in preview/development deployments

---

*Integration audit: 2026-02-03*
