# MADMall Setup Guide

## Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL (for database)

## Installation

### 1. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

This will install dependencies for:
- Root workspace
- All packages (safety-layer, content-filter, database, etc.)
- All apps (madmall)

### 2. Set Up Database

```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
pnpm prisma generate

# Push schema to database
pnpm prisma db push

# Seed database with sample data
pnpm prisma db seed
```

### 3. Environment Variables

Create `.env` files in relevant packages:

**packages/database/.env**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/madmall"
```

**apps/madmall/.env.local**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/madmall"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Governance Check

```bash
# From root directory
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

### 5. Run Tests

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test constitutional-constraints
pnpm test safety-components
pnpm test content-filter
```

### 6. Start Development Server

```bash
# Start MADMall application
pnpm dev:madmall
```

Open [http://localhost:3000](http://localhost:3000)

## TypeScript Errors Before Installation

**Note**: You will see TypeScript errors in your editor before running `pnpm install`. This is expected because:

1. React types are not installed yet
2. Next.js types are not installed yet
3. Package dependencies are not linked

**These errors will disappear after running `pnpm install`.**

## Troubleshooting

### "Cannot find module 'react'"

Run `pnpm install` from the root directory.

### "Prisma Client not generated"

```bash
cd packages/database
pnpm prisma generate
```

### "Database connection failed"

1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env files
3. Verify database exists: `createdb madmall`

### TypeScript errors persist after install

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist

# Reinstall
pnpm install
```

## Verification

After setup, verify everything works:

```bash
# 1. Governance check passes
pnpm check:governance

# 2. Tests pass
pnpm test

# 3. App builds
cd apps/madmall
pnpm build

# 4. App runs
pnpm dev
```

## Next Steps

1. Review [README.md](README.md) for project overview
2. Read [Constitution documentation](src/constitution/README.md)
3. Check [Implementation reports](docs/reports/)
4. Explore [Safety Layer](packages/safety-layer/README.md)
5. Review [Content Filter](packages/content-filter/README.md)

## Development Workflow

```bash
# Start development
pnpm dev:madmall

# Run tests in watch mode
pnpm test --watch

# Check governance before commit
pnpm check:governance

# Build for production
pnpm build
```

## CI/CD

GitHub Actions will automatically:
1. Run governance checks
2. Run all tests
3. Block merge if checks fail

See `.github/workflows/governance.yml`