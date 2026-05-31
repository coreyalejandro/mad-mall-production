# Codebase Structure

**Analysis Date:** 2026-02-03

## Directory Layout

```
mad-mall-production/
├── apps/
│   ├── app/                  # Authenticated dashboard application (Next.js)
│   ├── api/                  # Backend API and webhooks (Next.js)
│   ├── web/                  # Public marketing site (Next.js)
│   ├── studio/               # Prisma Studio for database management
│   ├── docs/                 # Documentation site
│   ├── email/                # Email template previews
│   └── storybook/            # Component story showcase
├── packages/
│   ├── ai/                   # AI integration utilities
│   ├── analytics/            # Google Analytics and Vercel Analytics provider
│   ├── auth/                 # Clerk authentication integration and middleware
│   ├── cms/                  # Basehub CMS client and queries
│   ├── collaboration/        # Liveblocks real-time collaboration
│   ├── database/             # Prisma client and database schema
│   ├── design-system/        # shadcn/ui components and theme provider
│   ├── email/                # Email service integration
│   ├── feature-flags/        # Feature flag management and toolbar
│   ├── internationalization/ # i18n with Languine and locale dictionaries
│   ├── next-config/          # Shared Next.js configuration
│   ├── notifications/        # Notification service integration
│   ├── observability/        # Sentry and logging integration
│   ├── payments/             # Stripe payment integration
│   ├── rate-limit/           # Rate limiting utilities
│   ├── security/             # Arcjet bot protection and security middleware
│   ├── seo/                  # SEO metadata and utilities
│   ├── storage/              # File storage utilities
│   ├── webhooks/             # Webhook handling
│   └── typescript-config/    # Shared TypeScript configuration
├── ml/                       # Machine learning models and utilities
├── scripts/                  # Build and utility scripts
├── docs/                     # Generated documentation
├── .planning/                # GSD planning documents (generated)
├── turbo.json                # Turbo monorepo configuration
├── pnpm-workspace.yaml       # pnpm workspace definition
├── tsconfig.json             # Root TypeScript configuration
└── biome.jsonc               # Code formatting and linting config
```

## Directory Purposes

**apps/app:**
- Purpose: Internal authenticated dashboard application
- Contains: React Server Components, layouts, protected routes, UI pages
- Structure: `app/(authenticated)` for auth-required, `app/(unauthenticated)` for public auth flows
- Key files: `app/layout.tsx` root layout with providers, `app/(authenticated)/layout.tsx` with auth checks

**apps/api:**
- Purpose: Backend API server for webhooks and cron jobs
- Contains: HTTP route handlers, webhook processing logic
- Structure: `app/webhooks/[provider]` for webhook routes, `app/cron` for background jobs
- Key files: `app/layout.tsx` minimal layout, `app/health/route.ts` health check, webhook handlers

**apps/web:**
- Purpose: Public marketing and content website
- Contains: Marketing pages, blog, legal pages, CMS-driven content
- Structure: `app/[locale]` for i18n routing, `(home)` route group for homepage
- Key files: `app/[locale]/layout.tsx` with i18n, `app/[locale]/(home)/page.tsx`, CMS content routes

**apps/studio:**
- Purpose: Database management interface
- Contains: Prisma configuration for database inspection
- Key files: `prisma.config.ts` pointing to shared database schema

**packages/database:**
- Purpose: Data access layer and schema
- Contains: Prisma schema, generated client, database migrations
- Key files: `index.ts` exports database client singleton, `prisma/schema.prisma` schema definition
- Special: Generates Prisma client from schema

**packages/design-system:**
- Purpose: UI component library and theming
- Contains: shadcn/ui components, theme provider, utility hooks
- Key files: `index.tsx` exports DesignSystemProvider, `components/` shadcn components, `providers/theme.tsx`
- Structure: `components/ui/` for base UI, `lib/` for utilities and fonts

**packages/auth:**
- Purpose: Authentication integration with Clerk
- Contains: Auth middleware, provider component, server utilities
- Key files: `proxy.ts` middleware wrapper, `provider.tsx` client provider, `server.ts` exports Clerk functions
- Pattern: Middleware-first, auth checks in layouts

**packages/cms:**
- Purpose: CMS integration and content queries
- Contains: Basehub client configuration, blog and legal page queries
- Key files: `index.ts` main export with blog/legal query functions, types are exported as `PostMeta`, `Post`, `LegalPost`
- Pattern: Fragment-based static methods with async query functions

**packages/analytics:**
- Purpose: Analytics integration
- Contains: Google Analytics and Vercel Analytics providers
- Key files: `provider.tsx` AnalyticsProvider wrapping children, `keys.ts` env var validation
- Usage: Wrapped at app root layouts for tracking

**packages/internationalization:**
- Purpose: Multi-language support
- Contains: Locale dictionaries, dictionary loader
- Key files: `index.ts` exports `getDictionary()`, `dictionaries/` JSON translation files
- Pattern: Dynamic locale loading with fallback to English

**packages/observability:**
- Purpose: Error tracking and logging
- Contains: Sentry integration, error parsing, logging facade
- Key files: `error.ts` parseError function, `log.ts` console/Logtail abstraction, `next-config.ts` Sentry wrapper
- Pattern: Centralized error parsing with Sentry capture

**packages/security:**
- Purpose: Security and bot protection
- Contains: Arcjet configuration and rules
- Key files: `index.ts` exports secure function, `proxy.ts` security middleware, `keys.ts` Arcjet key
- Pattern: Allow-list approach for bots and service requests

**packages/feature-flags:**
- Purpose: Feature flag management
- Contains: Flag definitions and toolbar
- Key files: `index.ts` exports flag functions like `showBetaFeature()`, `lib/` toolbar and flag creation utilities
- Pattern: Server-side flag evaluation with client toolbar option

**packages/next-config:**
- Purpose: Shared Next.js configuration
- Contains: Base Next configuration with env validation
- Key files: `index.ts` exports shared config, applies common plugins
- Usage: Extended by individual apps with additional plugins

**ml/:**
- Purpose: Machine learning models and utilities
- Contains: Model files and inference code
- Sub-directories: model-specific implementations

**scripts/:**
- Purpose: Build and maintenance scripts
- Contains: Turbo generator configs, build helpers
- Key subdirs: `turbo/generators` for code generation

## Key File Locations

**Entry Points:**
- `apps/web/app/[locale]/layout.tsx`: Web app root layout with i18n and providers
- `apps/app/app/layout.tsx`: App root layout with analytics provider
- `apps/api/app/layout.tsx`: API root layout minimal setup
- `apps/web/proxy.ts`: Web app middleware for auth, security, i18n
- `apps/api/package.json`: API app dependencies

**Configuration:**
- `turbo.json`: Monorepo task configuration and caching
- `pnpm-workspace.yaml`: Workspace package definition
- `tsconfig.json`: Root TypeScript settings
- `biome.jsonc`: Linting and formatting rules
- `packages/database/prisma/schema.prisma`: Database schema
- `packages/internationalization/languine.json`: i18n configuration

**Core Logic:**
- `packages/database/index.ts`: Prisma client singleton with Neon adapter
- `packages/cms/index.ts`: Basehub CMS queries with fragments
- `packages/auth/proxy.ts`: Clerk authentication middleware
- `packages/security/index.ts`: Arcjet security rules
- `packages/feature-flags/index.ts`: Feature flag definitions
- `packages/observability/error.ts`: Centralized error handling

**Testing:**
- `apps/app/__tests__`: Integration tests for app
- `apps/api/__tests__`: Tests for API endpoints
- Individual packages lack test directories (no unit tests found)

## Naming Conventions

**Files:**
- Route handlers: `route.ts` for HTTP methods (GET, POST, etc.)
- Pages: `page.tsx` for Next.js pages
- Layouts: `layout.tsx` for Next.js layout components
- Middleware: `proxy.ts` for middleware files (Nemo wrapper)
- Configuration: `*.config.ts` for configuration files
- Keys/Secrets: `keys.ts` for environment variable validation
- Types: `.d.ts` for type definitions

**Directories:**
- Page routes use bracket notation: `[locale]` for dynamic, `[...slug]` for catch-all
- Route groups in parentheses: `(home)`, `(authenticated)`, `(unauthenticated)`
- Feature directories match feature name: `blog`, `contact`, `pricing`
- Component directories: `components/` prefix or feature-local `components/` subdirectory

## Where to Add New Code

**New Feature (Marketing Page):**
- Primary code: `apps/web/app/[locale]/(home)/components/` for new section components
- Page route: `apps/web/app/[locale]/[feature-name]/page.tsx`
- Shared UI: Use components from `packages/design-system/components/`
- i18n strings: Add to `packages/internationalization/dictionaries/en.json`

**New Component/Module (Shared):**
- Implementation: Create subdirectory in `packages/` if cross-cutting (e.g., `packages/my-feature`)
- Export point: `packages/my-feature/index.ts` or `index.tsx` for providers
- Configuration: Add `keys.ts` if needs environment variables
- TypeScript: Include `tsconfig.json` extending root config
- Tests: Add `__tests__/` directory with `.test.ts` files

**API Endpoint (Backend):**
- Webhooks: `apps/api/app/webhooks/[provider]/route.ts`
- Cron jobs: `apps/api/app/cron/[job-name]/route.ts`
- Health checks: `apps/api/app/health/route.ts` (already exists)
- Tests: `apps/api/__tests__/[endpoint].test.ts`

**Authenticated Page (App):**
- Protected: `apps/app/app/(authenticated)/[feature-name]/page.tsx`
- Public auth flow: `apps/app/app/(unauthenticated)/[auth-type]/page.tsx`
- Layout-specific styles: `apps/app/app/[layout-name]/components/`
- Server actions: `apps/app/app/actions/[action-name].ts`

**Utilities/Helpers:**
- Shared helpers: `packages/[feature]/lib/` or `packages/[feature]/utils/`
- App-specific: `apps/[app]/lib/` or `apps/[app]/utils/`

## Special Directories

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes
- Committed: No (in .gitignore)

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (by pnpm)
- Committed: No (in .gitignore)

**`.turbo/`:**
- Purpose: Turbo cache for incremental builds
- Generated: Yes
- Committed: No (in .gitignore)

**`packages/database/generated/`:**
- Purpose: Prisma client auto-generated code
- Generated: Yes (by `prisma generate`)
- Committed: No

**`.planning/`:**
- Purpose: GSD planning and analysis documents
- Generated: Yes (by orchestrator)
- Committed: Yes

---

*Structure analysis: 2026-02-03*
