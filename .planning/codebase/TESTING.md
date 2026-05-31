# Testing Patterns

**Analysis Date:** 2026-02-03

## Test Framework

**Runner:**
- Vitest 4.0.15
- Config files: `vitest.config.mts` in app/api test directories
- Configured for jsdom environment (browser-like testing)

**Assertion Library:**
- Vitest built-in expect API (compatible with Jest)
- Testing Library React for component testing

**Run Commands:**
```bash
npm run test                    # Run all tests (NODE_ENV=test vitest run)
npm run typecheck             # Type checking without emitting
```

**Configuration Details:**
- Environment: `jsdom` (DOM API simulation for React components)
- React plugin: `@vitejs/plugin-react` for JSX support
- Path aliases configured to match app structure

## Test File Organization

**Location:**
- Tests co-located in `__tests__/` directory at app root
- Pattern: `__tests__/` directory in same app folder

**Naming:**
- Pattern: `[name].test.ts` or `[name].test.tsx`
- Files: `sign-in.test.tsx`, `sign-up.test.tsx`, `health.test.ts`

**Structure:**
```
apps/
├── app/
│   └── __tests__/
│       ├── sign-in.test.tsx
│       └── sign-up.test.tsx
└── api/
    └── __tests__/
        └── health.test.ts
```

## Test Structure

**Suite Organization:**
Tests use simple, flat structure without describe blocks in observed patterns.

```typescript
import { expect, test } from "vitest";
import { GET } from "../app/health/route";

test("Health Check", async () => {
  const response = await GET();
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("OK");
});
```

**Patterns:**
- Use `test()` function directly from vitest
- Single test per file or grouped logically
- Test name describes behavior: "Health Check", "Sign In Page", "Sign Up Page"

## Mocking

**Framework:** Vitest built-in mocking (vi namespace)

**Patterns:**
Not extensively observed in current tests. When mocking is needed:
- Use Vitest's `vi.mock()` for module mocking
- Manual mocks in test files using jest-compatible API
- vitest-compatible with existing Jest patterns

**What to Mock:**
- External API calls
- Clerk authentication components (wrapped/mocked at test level if needed)
- Database calls
- Environment variables

**What NOT to Mock:**
- Next.js route handlers (directly import and test)
- React components rendering behavior (use Testing Library instead)
- Built-in modules unless testing error paths

## Fixtures and Factories

**Test Data:**
Minimal use observed. Tests typically:
- Import actual components/functions
- Use real rendering where appropriate
- Pass minimal required props

**Example:**
```typescript
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Page from "../app/(unauthenticated)/sign-in/[[...sign-in]]/page";

test("Sign In Page", () => {
  const { container } = render(<Page />);
  expect(container).toBeDefined();
});
```

**Location:**
- Fixtures would go in `__tests__/fixtures/` if needed (not currently established)
- Factory patterns not yet established; consider creating if needed

## Coverage

**Requirements:** Not enforced (no configuration found)

**View Coverage:**
```bash
# Add if needed
npm run test -- --coverage
```

**Current gaps:** No coverage reporting configured; would require:
- `@vitest/coverage-v8` or similar
- vitest config update with coverage settings

## Test Types

**Unit Tests:**
- Scope: Individual functions and route handlers
- Approach: Direct import and function call
- Example: `apps/api/__tests__/health.test.ts` - Tests GET route handler directly

**Integration Tests:**
- Scope: Component rendering with dependencies
- Approach: Render component, verify output
- Example: `apps/app/__tests__/sign-in.test.tsx` - Renders Sign In page component
- Uses real routing and component imports

**E2E Tests:**
- Framework: Not used
- Would require separate setup (e.g., Playwright, Cypress)
- Consider for future: Testing full user flows across apps

## Common Patterns

**Async Testing:**
```typescript
test("Health Check", async () => {
  const response = await GET();
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("OK");
});
```

**Component Testing:**
```typescript
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("Sign In Page", () => {
  const { container } = render(<Page />);
  expect(container).toBeDefined();
});
```

**Patterns to Use:**
- Import from `vitest` not `jest`: `import { expect, test } from "vitest"`
- Use `@testing-library/react` for component testing
- Set `NODE_ENV=test` when running tests (automatic in npm scripts)
- Use async/await for promise-based code
- Import actual route handlers and components directly

## Dependencies

**Testing Libraries:**
- `vitest@^4.0.15` - Test runner
- `@testing-library/react@^16.3.0` - React component testing
- `@testing-library/dom@^10.4.1` - DOM utilities
- `@vitejs/plugin-react@^5.1.1` - React/JSX support in Vitest
- `jsdom@^27.2.0` - DOM implementation for Node.js environment

**Configuration:**
- TypeScript support: Configured via `vitest.config.mts`
- Path aliases resolved through vitest config (@ and @repo aliases)

## Best Practices

**When Writing Tests:**
1. Keep tests focused on a single behavior
2. Use descriptive test names that explain what is being tested
3. Import actual implementations rather than mocking when possible
4. Use render() from @testing-library/react for component tests
5. Await async operations completely before assertions
6. Set NODE_ENV=test in test runner scripts

**Test Coverage Goals:**
- Critical paths: Business logic, error handling, integrations
- Server routes: All success and error paths
- Components: Basic rendering for complex components
- Utilities: Essential helper functions

---

*Testing analysis: 2026-02-03*
