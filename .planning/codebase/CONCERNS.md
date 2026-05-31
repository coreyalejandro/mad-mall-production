# Codebase Concerns

**Analysis Date:** 2026-02-03

## Tech Debt

**Untyped Proxy Middleware:**
- Issue: The auth middleware uses `any` types for parameters, circumventing TypeScript safety checks
- Files: `packages/auth/proxy.ts`
- Impact: Type checking disabled; future refactoring and error catching will be difficult
- Fix approach: Define proper TypeScript interfaces for `request` and `event` parameters following Next.js middleware types

**ML Package Dependency Management:**
- Issue: Python ML package at `ml/` has minimal dependency specification in `pyproject.toml`
- Files: `ml/pyproject.toml`
- Impact: Missing explicit dependency versions could cause reproducibility issues; version conflicts in production
- Fix approach: Add comprehensive `dependencies` section with pinned versions; create `requirements.txt` for pip compatibility

**AuthProvider is a No-op:**
- Issue: `packages/auth/provider.tsx` returns children unmodified with no actual auth context
- Files: `packages/auth/provider.tsx`
- Impact: Auth state not available in client components; any auth-dependent features will fail
- Fix approach: Integrate with Clerk authentication context provider; expose user session and auth methods

**Content API Path Resolution Complexity:**
- Issue: The content API uses a fallback mechanism for finding content root, making deployment path assumptions
- Files: `apps/web/app/api/content/route.ts` (lines 6-23)
- Impact: Different behavior in dev vs production if directory structure changes; potential for silent failures
- Fix approach: Explicitly configure content root via environment variable; fail fast with clear error messages

## Security Considerations

**Optional Secret Keys Everywhere:**
- Risk: All critical secrets (Clerk, Stripe, Sentry, etc.) are marked as optional in validation schemas, allowing silent failures
- Files: `packages/auth/keys.ts`, `packages/payments/keys.ts`, `packages/observability/keys.ts`
- Current mitigation: Environment variables are checked at runtime but return undefined silently
- Recommendations:
  - Mark secrets as required (remove `.optional()`) in production schemas
  - Add startup validation that checks all critical secrets are present
  - Separate dev and production configuration schemas

**Stripe Agent Toolkit with Create Permissions:**
- Risk: Payment agent has permission to create payment links, products, and prices - could be exploited if agent input is user-controlled
- Files: `packages/payments/ai.ts` (lines 8-17)
- Current mitigation: None visible; direct access to agent toolkit
- Recommendations:
  - Add rate limiting on agent creation endpoints
  - Audit all endpoints that expose the payment agent toolkit
  - Restrict agent to read-only operations unless explicitly required
  - Add logging for all state-changing AI agent actions

**Webhook Signature Verification:**
- Risk: Webhook handlers verify signatures but don't validate timestamp freshness to prevent replay attacks
- Files: `apps/api/app/webhooks/auth/route.ts` (lines 175-186), `apps/api/app/webhooks/payments/route.ts` (lines 78-82)
- Current mitigation: SVIX/Stripe signature verification
- Recommendations:
  - Add timestamp validation with configurable window (e.g., 5 minutes)
  - Track processed webhook IDs to prevent duplicate processing
  - Add warning logging for old webhooks

**Clerk User List Traversal:**
- Risk: `apps/api/app/webhooks/payments/route.ts` loads all users to find by customer ID - N+1 query on every payment webhook
- Files: `apps/api/app/webhooks/payments/route.ts` (lines 11-20)
- Impact: Performance degradation with scale; potential memory exhaustion
- Recommendation: Use Clerk's metadata query capabilities or maintain a customer ID → user ID mapping in database

**Missing Input Validation on Content API:**
- Risk: While path traversal is prevented, markdown files are returned as-is without HTML sanitization
- Files: `apps/web/app/api/content/route.ts` (lines 25-62)
- Impact: Potential for XSS if markdown is rendered client-side without sanitization
- Recommendations:
  - Document that content must be sanitized before rendering
  - Add `Content-Type: text/plain` to prevent browser interpretation
  - Consider returning parsed AST instead of raw markdown

## Performance Bottlenecks

**Full User List Query on Payment Webhooks:**
- Problem: Every payment webhook fetches entire user list from Clerk to find one user by Stripe customer ID
- Files: `apps/api/app/webhooks/payments/route.ts` (line 13)
- Cause: No index/mapping between Stripe customer IDs and Clerk user IDs
- Improvement path:
  - Store Stripe customer ID in Prisma when user creates subscription
  - Query database instead of Clerk for user lookup
  - Fall back to Clerk only if database miss (for backwards compatibility)

**Synchronous Content File Reading:**
- Problem: Content files loaded via `fs.readFile()` are not cached; every request re-reads from disk
- Files: `apps/web/app/api/content/route.ts` (line 58)
- Impact: Unnecessary I/O; slow response times under concurrent requests
- Improvement path:
  - Add in-memory cache with filesystem watcher for invalidation
  - Implement HTTP caching headers (ETag, Cache-Control)
  - Consider pre-loading frequently accessed content

**Infinite Canvas Repaints:**
- Problem: Plan page (291 lines) re-renders canvas on every wheel/pointer event without optimization
- Files: `apps/web/app/[locale]/plan/page.tsx`
- Impact: Frame drops on slower devices; poor mobile performance
- Improvement path:
  - Memoize board rendering with `React.memo()`
  - Use `useTransition` hook for non-blocking updates
  - Consider canvas-based rendering (HTML5 Canvas/WebGL) for large board counts

## Fragile Areas

**Offline Auth Fallback Missing:**
- Files: `packages/auth/provider.tsx`, `apps/api/app/webhooks/auth/route.ts`
- Why fragile: Complete dependency on Clerk API; no local session caching
- Safe modification: Implement session caching in localStorage/sessionStorage with TTL
- Test coverage gaps: No tests visible for auth flow; webhook handler untested

**Content Routing Assumptions:**
- Files: `apps/web/app/api/content/route.ts` (lines 7-22)
- Why fragile: Hard-coded path candidates; breaks if directory structure changes
- Safe modification: Extract path detection into test-covered utility; use environment variable
- Test coverage gaps: No unit tests for path resolution logic

**Analytics Shutdown Pattern:**
- Files: `apps/api/app/webhooks/auth/route.ts` (line 230), `apps/api/app/webhooks/payments/route.ts` (line 98)
- Why fragile: `analytics.shutdown()` called at end of every webhook; could lose events if called prematurely
- Safe modification: Move analytics shutdown to middleware/cleanup handlers; add timeout
- Test coverage gaps: No tests for webhook handler edge cases

**Multi-Provider Environment Setup:**
- Files: `apps/api/env.ts`, all `keys.ts` files
- Why fragile: Seven environment configuration sources; single missing secret breaks entire app
- Safe modification: Create startup diagnostics script; validate all configs on app initialization
- Test coverage gaps: No startup validation tests

## Scaling Limits

**Stripe Customer Lookup Performance:**
- Current capacity: Fine for < 10k users (Clerk API request scales linearly)
- Limit: Hits Clerk rate limits around 50k users with high payment volume
- Scaling path: Implement customer ID mapping in Prisma; batch lookups where possible

**In-Memory Analytics Batching:**
- Current capacity: Single process handles all analytics events
- Limit: Memory exhaustion if `analytics.shutdown()` called with pending events
- Scaling path: Use Redis-backed analytics queue; make shutdown non-blocking

**Content API Concurrent Requests:**
- Current capacity: File system I/O limited by disk speed
- Limit: Bottleneck at ~1000 concurrent requests on typical server
- Scaling path: CDN caching, edge workers, content database instead of file system

## Dependencies at Risk

**Arcjet Security Integration:**
- Risk: Beta version (`@arcjet/next@1.0.0-beta.15`) in production dependency
- Impact: API changes could break security features; no LTS guarantees
- Migration plan: Monitor for stable release; pin version with monitoring; test beta thoroughly before updating

**Stripe Agent Toolkit Usage:**
- Risk: AI agent has payment creation permissions with unclear constraints
- Impact: Could be exploited if agent receives user input without proper validation
- Migration plan: Audit all agent toolkit usage; restrict to read-only operations; add comprehensive test coverage

## Missing Critical Features

**Missing Environment Validation:**
- Problem: No startup check that all required secrets are present
- Blocks: Production deployment confidence; difficult troubleshooting
- Solution: Add validation script that runs on application startup; document required variables

**Missing Database Connection Pooling Configuration:**
- Problem: Neon adapter setup doesn't configure connection pool size or timeouts
- Blocks: Scaling beyond default pool size (~3-5 connections)
- Solution: Expose Neon configuration options; add environment variables for pool tuning

**No Webhook Replay Protection:**
- Problem: Duplicate webhooks could be processed multiple times
- Blocks: Financial consistency (payment duplicated), data integrity
- Solution: Implement idempotency keys in webhook handlers; store processed webhook IDs

## Test Coverage Gaps

**API Webhook Handlers Untested:**
- What's not tested: Auth webhook handler (`apps/api/app/webhooks/auth/route.ts`)
- Files: `apps/api/app/webhooks/auth/route.ts`
- Risk: Auth sync failures silently fail; user creation events could be lost
- Priority: High - critical business logic

**Payment Webhook Edge Cases:**
- What's not tested: Customer ID lookup failures, missing user metadata, malformed events
- Files: `apps/api/app/webhooks/payments/route.ts`
- Risk: Payment events silently dropped if customer lookup fails
- Priority: High - financial impact

**Content API Security:**
- What's not tested: Path traversal attempts, symlink resolution, permission checks
- Files: `apps/web/app/api/content/route.ts`
- Risk: Undetected security bypass
- Priority: High - public endpoint

**Plan Page Canvas Logic:**
- What's not tested: Zoom/pan boundaries, pointer handling, board loading errors
- Files: `apps/web/app/[locale]/plan/page.tsx`
- Risk: Unexpected interactions on edge cases; poor mobile UX
- Priority: Medium - user-facing but not business-critical

**Environment Configuration:**
- What's not tested: Missing secrets, mismatched keys, invalid values
- Files: All `keys.ts` files
- Risk: Silent failures at startup
- Priority: Medium - affects all deployments

---

*Concerns audit: 2026-02-03*
