# Technology Stack

**Analysis Date:** 2026-02-03

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code, packages, and configurations
- JavaScript - Runtime execution via Node.js and browsers

**Secondary:**
- JSX/TSX - React component syntax used throughout web and API apps

## Runtime

**Environment:**
- Node.js 18+ (specified in `package.json` engines)
- Edge Runtime (Vercel deployment support via NEXT_RUNTIME env var)

**Package Manager:**
- pnpm 10.24.0 (monorepo management)
- Lockfile: `pnpm-lock.yaml` (present and committed)

## Frameworks

**Core:**
- Next.js 16.0.10 - Primary framework for all apps and APIs
  - API routes at `apps/api/app/**/*.ts`
  - Web frontend at `apps/web/app/**/*.tsx`
  - Studio (Prisma UI) at `apps/studio`

**UI & Components:**
- React 19.2.1 - Component library across all packages
- React DOM 19.2.1 - DOM rendering

**Design System:**
- Tailwind CSS 4.1.17 - Utility-first CSS framework
- Radix UI (`@radix-ui/react-icons`) - Accessible component primitives
- shadcn/ui (managed via design-system package) - Pre-built UI components
- Lucide React 0.556.0 - Icon library

**Build & Dev:**
- Turbo 2.6.3 - Monorepo build system and task orchestration
- tsup 8.5.1 - TypeScript bundler for package compilation
- Biome 2.3.8 - Code linting and formatting (JavaScript, React, Next.js)
- TypeScript 5.9.3 - Type checking

**Testing:**
- Vitest 4.0.15 - Unit and integration testing framework
- @vitejs/plugin-react 5.1.1 - Vite plugin for React testing

**Documentation:**
- Storybook (app at `apps/storybook`) - Component documentation
- Fumadocs 16.2.3 - Documentation site framework

## Key Dependencies

**Critical:**

- `zod` 4.1.13 - Runtime schema validation and environment variable parsing
  - Used across all packages via `keys.ts` files for type-safe env vars
- `@t3-oss/env-nextjs` 0.13.8 - Type-safe environment variable management
  - Central to all package configurations
- `@prisma/client` 7.1.0 - Database ORM client
- `@prisma/adapter-neon` 7.1.0 - Neon database adapter for Prisma
- `prisma` 7.1.0 - Database schema and migration tool

**Infrastructure:**

- `@neondatabase/serverless` 1.0.2 - Serverless PostgreSQL driver
- `undici` 7.16.0 - HTTP client for Node.js
- `ws` 8.18.3 - WebSocket support
- `server-only` 0.0.1 - Ensures server-side code isolation

**Authentication:**

- `@clerk/nextjs` 6.36.0 - Authentication provider and SDK
- `@clerk/themes` 2.4.42 - Clerk UI theme customization
- `@clerk/types` 4.101.5 - TypeScript types for Clerk

**Payments:**

- `stripe` 20.0.0 - Stripe payment processing SDK
- `@stripe/agent-toolkit` 0.7.12 - Stripe AI agent integration
- `svix` 1.82.0 - Event webhook delivery platform

**Email:**

- `resend` 6.5.2 - Email delivery service
- `@react-email/components` 1.0.1 - React email template components

**Analytics & Observability:**

- `@sentry/nextjs` 10.29.0 - Error tracking and performance monitoring
- `posthog-js` 1.302.2 - Client-side analytics library
- `posthog-node` 5.17.2 - Server-side PostHog analytics
- `@vercel/analytics` 1.6.1 - Vercel Web Analytics integration
- `@logtail/next` 0.2.1 - Structured logging via BetterStack

**AI/ML:**

- `@ai-sdk/openai` 2.0.77 - OpenAI API integration
- `ai` 5.0.107 - Vercel AI SDK for streaming and tools
- `@rescale/nemo` 2.0.2 - Rescale integration for ML/computational work

**Content Management:**

- `basehub` 9.5.3 - Headless CMS SDK
  - Configured via `packages/cms/package.json`

**Collaboration & Real-time:**

- `@liveblocks/client` 3.11.0 - Real-time collaboration client
- `@liveblocks/react` 3.11.0 - Liveblocks React hooks
- `@liveblocks/node` 3.11.0 - Liveblocks server API

**Rate Limiting:**

- `@upstash/ratelimit` 2.0.7 - Serverless rate limiting
- `@upstash/redis` 1.35.7 - Upstash Redis client

**Security:**

- `@arcjet/next` 1.0.0-beta.15 - Security and DDoS protection
- `import-in-the-middle` 2.0.0 - Module import patching (observability)
- `require-in-the-middle` 8.0.1 - Module require patching (observability)

**Feature Flags:**

- `@vercel/toolbar` 0.1.41 - Vercel edge config and feature flags
- `flags` 4.0.2 - Feature flag management library

**Notifications:**

- `@knocklabs/node` 1.24.0 - Knock notification API client
- `@knocklabs/react` 0.9.4 - Knock React hooks

**Internationalization:**

- Maintained via `packages/internationalization` package

**Utilities:**

- `streamdown` 1.6.10 - Markdown streaming utilities
- `tailwind-merge` 3.4.0 - Tailwind CSS utility merging
- `shiki` 3.19.0 - Syntax highlighting for code blocks
- `mdx-bundler` 10.1.1 - MDX bundling for content
- `sharp` 0.34.5 - Image processing library
- `date-fns` 4.1.0 - Date utility library
- `lucide-react` 0.556.0 - Icon components
- `next-themes` 0.4.6 - Theme management for Next.js
- `@next/third-parties` 16.0.7 - Third-party script optimization
- `commander` 14.0.2 - CLI argument parsing
- `@clack/prompts` 0.11.0 - Interactive CLI prompts
- `concurrently` 9.2.1 - Run multiple commands concurrently

**Development Only:**

- `@types/node` 24.10.1 - Node.js type definitions
- `@types/react` 19.2.7 - React type definitions
- `@types/react-dom` 19.2.3 - React DOM type definitions
- `@types/ws` 8.18.1 - WebSocket type definitions
- `typescript` 5.9.3 - TypeScript compiler
- `bufferutil` 4.0.9 - Binary utilities for WebSocket optimization
- `@auto-it/first-time-contributor` 11.3.6 - First-time contributor detection

## Configuration

**Environment Variables:**

Variables are managed through `keys.ts` files in each package using `@t3-oss/env-nextjs` pattern:

- `packages/auth/keys.ts` - Clerk authentication credentials
- `packages/database/keys.ts` - Database connection
- `packages/email/keys.ts` - Resend email service
- `packages/payments/keys.ts` - Stripe payment keys
- `packages/analytics/keys.ts` - PostHog, Google Analytics, Vercel Analytics
- `packages/observability/keys.ts` - Sentry, BetterStack logging
- `packages/next-config/keys.ts` - Vercel and app URLs
- `packages/ai/keys.ts` - OpenAI API key
- `packages/cms/keys.ts` - Basehub CMS token
- `packages/notifications/keys.ts` - Knock notification service
- `packages/collaboration/keys.ts` - Liveblocks API keys
- `packages/storage/keys.ts` - Vercel Blob storage token
- `packages/rate-limit/keys.ts` - Upstash Redis credentials
- `packages/webhooks/keys.ts` - Svix webhook token
- `packages/security/keys.ts` - Arcjet security key
- `packages/feature-flags/keys.ts` - Feature flag secret

**Build Configuration:**

- `turbo.json` - Turbo build orchestration and caching
  - Global dependencies: `.env.*local` files
  - Cache outputs: `.next/**`, `storybook-static/**`, `**/generated/**`
  - Build depends on test completion

**TypeScript Configuration:**

- `tsconfig.json` - Root TypeScript configuration (workspace:*)
  - Target: ES2022
  - Module: NodeNext
  - Strict: true
  - skipLibCheck: true

**Code Quality:**

- `biome.jsonc` - Unified linting and formatting configuration
  - Extends: ultracite/core, ultracite/react, ultracite/next
  - Excludes: generated UI components, collaboration config, Basehub types

**Formatting:**

- Biome handles formatting (replaces Prettier/ESLint)

## Platform Requirements

**Development:**

- Node.js 18+
- pnpm 10.24.0
- TypeScript 5.9.3

**Production:**

- Deployment target: Vercel (primary)
  - Supports Edge Runtime
  - Integrates with Sentry via Vercel Marketplace
  - Uses Vercel Blob for file storage
  - Uses Vercel Analytics
  - Uses Vercel Toolbar for feature flags

**Databases:**

- Neon PostgreSQL (via @neondatabase/serverless)
  - Prisma ORM with Neon adapter

**External Services:**

- Clerk (authentication)
- Stripe (payments)
- Resend (email)
- PostHog (analytics)
- Sentry (error tracking)
- Vercel (hosting/analytics)
- BetterStack (logging)
- Basehub (CMS)
- Liveblocks (real-time collaboration)
- Upstash (rate limiting, Redis)
- Arcjet (security)
- Knock (notifications)
- OpenAI (AI/LLM)
- Svix (webhooks)

---

*Stack analysis: 2026-02-03*
