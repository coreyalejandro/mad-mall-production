# Coding Conventions

**Analysis Date:** 2026-02-03

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `ContactForm.tsx`, `SignIn.tsx`)
- Server/utility files: camelCase (e.g., `contact.tsx` for server actions, `health/route.ts` for API routes)
- Configuration: camelCase with descriptive names (e.g., `prisma.config.ts`, `vitest.config.mts`, `basehub.config`)
- Type definition files: `.d.ts` suffix for type-only files

**Functions:**
- Functions: camelCase (e.g., `createRateLimiter`, `parseError`, `getDictionary`, `latestPost`)
- React components: PascalCase (e.g., `Hero`, `ContactForm`, `SignIn`)
- Async functions explicitly marked: use `async` keyword
- Server actions marked with `"use server"` directive at top of file

**Variables:**
- Constants and exports: camelCase (e.g., `database`, `stripe`, `blog`, `secure`)
- React hooks: camelCase starting with `use` (e.g., `useState`, `useRef`)
- Type instances: camelCase (e.g., `globalForPrisma`)
- Private/global references: camelCase (e.g., `globalForPrisma`)

**Types:**
- Interfaces and types: PascalCase (e.g., `HeroProps`, `ContactFormProps`, `Dictionary`, `Post`, `PostMeta`)
- Type imports: use `type` keyword (e.g., `import type { Dictionary }`)
- Generic/exported types with `export type` syntax
- Fragment types inferred with `fragmentOn.infer<typeof fragment>`

## Code Style

**Formatting:**
- Tool: Biome (configured via `biome.jsonc`)
- Config extends: `ultracite/core`, `ultracite/react`, `ultracite/next`
- Line length: Enforced by Biome
- Indentation: 2 spaces (default Biome)

**Linting:**
- Tool: Biome
- Configuration: `biome.jsonc` at project root
- Exclusions: `packages/design-system/components/ui`, `packages/design-system/lib`, `packages/design-system/hooks`, `packages/collaboration/config.ts`, generated type files
- Global scope: Biome aware of `Liveblocks` global variable

**File Suppressions:**
- Use `// biome-ignore lint/[rule]: [reason]` for suppressing Biome warnings
- Common suppressions observed:
  - `biome-ignore lint/performance/noBarrelFile: re-exporting` - Used in barrel exports (e.g., database index)
  - `biome-ignore lint/suspicious/useAwait: "Server Actions must be async"` - Used in server components with server actions
  - `biome-ignore lint/suspicious/useAwait: rewrites is async` - Used in async Next.js config functions

## Import Organization

**Order:**
1. External dependencies (e.g., `import type NextError from "next/error"`)
2. Type imports from external packages (e.g., `import type { ReactNode } from "react"`)
3. Project packages via `@repo/` (e.g., `import { blog } from "@repo/cms"`)
4. Local imports via path aliases (e.g., `import { env } from "@/env"`)
5. Relative imports if any (rare in this codebase)

**Path Aliases:**
- `@repo/` - Points to `packages/` directory for workspace packages
- `@/` - Points to app root (e.g., `@/env` for environment variables in specific app)
- Used in `tsconfig.json` and `vitest.config.mts` alias resolution

**Specific patterns:**
```typescript
// Type imports first
import type { Dictionary } from "@repo/internationalization";
// Then components/packages
import { blog } from "@repo/cms";
import { Feed } from "@repo/cms/components/feed";
import { Button } from "@repo/design-system/components/ui/button";
// Then icons/utilities
import { MoveRight, PhoneCall } from "lucide-react";
import Link from "next/link";
// Then local
import { env } from "@/env";
```

## Error Handling

**Strategy:** Try-catch with centralized error parsing

**Patterns:**
- Use `try-catch` blocks for error boundaries
- Centralized error parsing via `parseError()` from `@repo/observability/error`
- Throw descriptive `Error` with message for validation/business logic failures
- Return error objects in server actions/API responses (e.g., `{ error?: string; }`)

**Example:**
```typescript
export const contact = async (
  name: string,
  email: string,
  message: string
): Promise<{
  error?: string;
}> => {
  try {
    // Business logic
    return {};
  } catch (error) {
    const errorMessage = parseError(error);
    return { error: errorMessage };
  }
};
```

**Error types:**
- Validation errors: throw new Error with descriptive message
- Network/integration errors: caught and parsed via `parseError()`
- Unhandled errors: Global error boundary via `global-error.tsx` (Next.js)

## Logging

**Framework:** Logtail in production, console in development

**Pattern:**
```typescript
import { log as logtail } from "@logtail/next";

export const log = process.env.NODE_ENV === "production" ? logtail : console;
```

**Usage:**
- Use centralized `log` export from observability package
- Automatic fallback to console in non-production environments
- Integrated with Sentry for error tracking (captures console.log, console.error, console.warn)
- In production: logs sent to Logtail and Sentry

**Console usage:** Direct `console` calls only in development-only code (not production)

## Comments

**When to Comment:**
- Non-obvious business logic requiring context
- Complex algorithms or data transformations
- Integration-specific workarounds or dependencies
- Security considerations or validation requirements

**JSDoc/TSDoc:**
- Minimal use in application code
- Used primarily in generated type definition files (`.d.ts`)
- When used: Standard JSDoc format with `/** */` block syntax
- Exported types documented with inline comments for clarity

**Style:**
```typescript
// Section headers for logical grouping
/* -------------------------------------------------------------------------------------------------
 * Common Fragments
 * -----------------------------------------------------------------------------------------------*/

// Inline comments for clarification
const imageFragment = fragmentOn("BlockImage", {
  url: true, // Full URL to image
  width: true, // Image width in pixels
});
```

## Function Design

**Size:** Prefer small, focused functions (10-30 lines typical)

**Parameters:**
- Use object parameters for related values (e.g., `{ dictionary }: HeroProps`)
- Type props interface for components
- Avoid excessive parameter nesting

**Return Values:**
- Explicit return types (e.g., `Promise<Post | null>`)
- Use discriminated unions for async operations (e.g., `{ error?: string; }`)
- Nullable for optional/missing data (e.g., `Post | null`)

**Async Pattern:**
- Async functions marked with `async` keyword
- Server functions marked with `"use server"` directive
- Client-side async marked with `"use client"` directive

**Example:**
```typescript
export const Hero = async ({ dictionary }: HeroProps) => (
  <div className="w-full">
    {/* JSX content */}
  </div>
);

type HeroProps = {
  dictionary: Dictionary;
};
```

## Module Design

**Exports:**
- Named exports for reusable functions and components
- Default exports rare (only when required by framework, e.g., Next.js pages)
- Explicit export patterns: `export const NAME = ...` or `export type NAME = ...`

**Barrel Files:**
- Used for grouping related exports
- Often re-export from submodules
- Biome suppression applied when appropriate: `// biome-ignore lint/performance/noBarrelFile`

**Example barrel file:**
```typescript
// Export everything from Liveblocks hooks
export * from "@liveblocks/react/suspense";
```

**Private/server-only modules:**
- Use `"server-only"` import guard in server-only modules (e.g., database, auth, payments)
- Prevents accidental client-side imports

## TypeScript Configuration

**Target:** ES2022
**Module:** NodeNext
**Strict mode:** Enabled (`strict: true`)
**Strict null checks:** Enabled (`strictNullChecks: true`)
**Module detection:** Force (`moduleDetection: force`)
**Module resolution:** NodeNext

**Declaration:** Generated with `declaration: true` and `declarationMap: true`

---

*Convention analysis: 2026-02-03*
