# Architecture

**Analysis Date:** 2026-02-03

## Pattern Overview

**Overall:** Monorepo with layered package-based architecture using a Next.js-based app federation pattern. The codebase follows a workspace structure with shared packages providing core functionality to multiple applications.

**Key Characteristics:**
- Monorepo management via pnpm workspace with Turbo for orchestration
- Modular shared packages providing cross-cutting functionality
- Multiple Next.js applications (web, app, api) consuming shared packages
- Server-side rendering with React Server Components (RSC) as primary pattern
- Middleware layer for cross-application concerns (auth, security, internationalization)

## Layers

**Presentation Layer (Apps):**
- Purpose: User-facing applications that consume shared packages
- Location: `apps/web`, `apps/app`, `apps/api`
- Contains: Next.js page routes, layouts, UI components, and server actions
- Depends on: All shared packages (`@repo/*`)
- Used by: End users and external systems

**Shared Package Layer:**
- Purpose: Reusable functionality and cross-cutting concerns
- Location: `packages/*`
- Contains: Auth, database, design system, CMS, payments, analytics, observability, and utility packages
- Depends on: External third-party libraries and each other (minimal)
- Used by: Multiple applications and other packages

**API/Webhook Layer:**
- Purpose: Backend API endpoints and webhook handlers
- Location: `apps/api/app/webhooks`, `apps/api/app/cron`
- Contains: HTTP route handlers for Stripe payments, authentication, and background jobs
- Depends on: Payment packages, database, auth
- Used by: External payment processors and scheduled services

**Database Layer:**
- Purpose: Data persistence and ORM abstraction
- Location: `packages/database`
- Contains: Prisma client and schema definitions
- Depends on: Neon serverless PostgreSQL adapter
- Used by: All applications requiring data access

**Configuration/Entry Point Layer:**
- Purpose: Application initialization and environment setup
- Location: Root `next.config.ts` in each app, `proxy.ts` middleware
- Contains: Next.js configuration, middleware composition, environment variables
- Depends on: Shared observability and security packages
- Used by: Runtime bootstrapping

## Data Flow

**Page Request Flow (Web App):**

1. Request enters through middleware (`proxy.ts`)
2. Middleware applies: security headers (Arcjet), internationalization, authentication
3. Next.js Router matches route to page component
4. Page component (async) fetches data: `getDictionary()` from internationalization package, features from feature-flags
5. Layout wraps with providers: `DesignSystemProvider`, `AnalyticsProvider`
6. Components render using design system UI components
7. Analytics event tracked via Google Analytics / Vercel Analytics
8. Response sent to client

**Authenticated App Flow (Internal Dashboard):**

1. Request through middleware with auth checks via `auth()` and `currentUser()`
2. Protected layout redirects unauthenticated users via `redirectToSignIn()`
3. Renders with `SidebarProvider`, `NotificationsProvider`, `GlobalSidebar` components
4. Child pages within authenticated route group access user context
5. Server actions modify data via Prisma database client
6. Real-time features via Liveblocks collaboration package

**API/Webhook Flow:**

1. Webhook request from external service (e.g., Stripe)
2. Hits route handler at `apps/api/app/webhooks/[provider]/route.ts`
3. Handler uses `@repo/payments` to process payment events
4. Database updated via Prisma client
5. Response sent to webhook source

**State Management:**
- Server-side state via Server Components and Async Components
- Client-side state via React hooks (limited scope)
- Feature flags state managed via `@repo/feature-flags` singleton pattern
- User session state via Clerk authentication (`@repo/auth`)
- Real-time collaboration state via Liveblocks (`@repo/collaboration`)

## Key Abstractions

**Provider Pattern:**
- Purpose: Composition of cross-cutting concerns at application level
- Examples: `DesignSystemProvider` (`packages/design-system`), `AnalyticsProvider` (`packages/analytics`)
- Pattern: React context providers wrapping root layout; each app composes providers based on needs

**Middleware Composition (Nemo):**
- Purpose: Chain security and functional middleware without conflicts
- Examples: `proxy.ts` in web and api apps
- Pattern: Creates middleware pipeline with `createNEMO()` combining security, i18n, and custom handlers

**Package Exports (Barrel Files):**
- Purpose: Clean API surface for consuming applications
- Examples: `packages/database/index.ts`, `packages/cms/index.ts`
- Pattern: Main entry points re-export public APIs; internal files marked server-only or use keys pattern

**Keys Pattern:**
- Purpose: Centralized environment variable validation and access
- Examples: `packages/database/keys.ts`, `packages/auth/keys.ts`, `packages/payments/keys.ts`
- Pattern: Each package exports `keys()` function that validates required env vars using Zod

**CMS Client Pattern:**
- Purpose: Type-safe queries to Basehub CMS
- Location: `packages/cms/index.ts`
- Pattern: Fragment-based queries with static methods (`blog.getPosts()`, `blog.getPost(slug)`, `legal.getPosts()`)

## Entry Points

**Web Application (Public Site):**
- Location: `apps/web`
- Triggers: HTTP request to web domain
- Responsibilities: Marketing pages, blog, pricing, legal pages, contact form, demo/agent entry
- Key routes: `/[locale]/(home)`, `/blog/[slug]`, `/legal/[slug]`, `/pricing`, `/contact`

**App Application (Authenticated Dashboard):**
- Location: `apps/app`
- Triggers: HTTP request to app domain with authenticated user
- Responsibilities: Authenticated user dashboard, collaboration features, webhooks management
- Protected via: Clerk authentication + `currentUser()` check in layout
- Key routes: `/(authenticated)/dashboard`, `/(authenticated)/webhooks`

**API Application (Backend):**
- Location: `apps/api`
- Triggers: HTTP requests for webhooks and API endpoints
- Responsibilities: Payment webhook handling, background cron jobs, health checks
- Key routes: `/webhooks/payments`, `/webhooks/auth`, `/cron/keep-alive`, `/health`

**Studio (Database Management):**
- Location: `apps/studio`
- Triggers: Manual CLI command `npm run dev:studio`
- Responsibilities: Prisma Studio for database inspection and manipulation
- Command: `prisma studio --config ./prisma.config.ts --port 3005`

## Error Handling

**Strategy:** Centralized error parsing and logging with Sentry integration for production

**Patterns:**
- `parseError()` function in `packages/observability/error.ts` normalizes error messages
- Errors captured to Sentry via `Sentry.captureException()`
- Production logging via Logtail, development via console
- Middleware errors return 403 JSON responses
- Async layout components can throw errors caught by Next.js error boundaries

## Cross-Cutting Concerns

**Logging:**
- Production: Logtail via `packages/observability/log.ts`
- Development: Console
- Errors always parsed and sent to Sentry

**Validation:**
- Environment variables validated via `keys()` pattern using Zod
- Request security validated via Arcjet in middleware
- Bot detection for search engines and preview services

**Authentication:**
- Handled by Clerk via `packages/auth`
- Middleware wraps routes (auth callback in `proxy.ts`)
- Server-side access via `auth()` and `currentUser()` functions
- Client-side provider (minimal usage)

**Security:**
- Arcjet integration for bot protection and rate limiting
- Shield rules enabled on all requests
- Search engines, preview bots, and monitors allowed
- CMS assets proxied from Basehub with remote pattern whitelisting

---

*Architecture analysis: 2026-02-03*
