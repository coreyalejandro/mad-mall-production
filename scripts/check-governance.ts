#!/usr/bin/env node
/**
 * Constitutional Constraint Checker
 * 
 * Enforces TLC Articles before commit
 * Run automatically via pre-commit hook or manually
 * 
 * Usage: tsx scripts/check-governance.ts [files...]
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { glob } from 'glob'

interface ConstraintViolation {
  file: string
  line: number
  constraint: string
  message: string
  severity: 'error' | 'warning'
}

const violations: ConstraintViolation[] = []

// ============================================================================
// CONSTRAINT #1: Non-Clinical Boundary (TLC Article I - Right to Safety)
// ============================================================================

const MEDICAL_ADVICE_PATTERNS = [
  { pattern: /\b(you should|you must) (take|stop|start|try|avoid)\b/gi, severity: 'error' as const },
  { pattern: /\bi recommend (taking|stopping|trying|avoiding)\b/gi, severity: 'error' as const },
  { pattern: /\bthis will (cure|treat|fix|heal)\b/gi, severity: 'error' as const },
  { pattern: /\byou (have|might have|probably have|definitely have) \w+\b/gi, severity: 'error' as const },
  { pattern: /\bdiagnose(d|s)? (you|yourself|them)\b/gi, severity: 'error' as const },
  { pattern: /\bprescribe(d|s)?\b/gi, severity: 'warning' as const },
  { pattern: /\bdosage of \d+/gi, severity: 'warning' as const },
]

const ALLOWED_CONTEXTS = [
  /does NOT (diagnose|treat|prescribe)/i,
  /disclaimer/i,
  /consult (your|a) (doctor|healthcare provider|physician)/i,
  /not medical advice/i,
  /my doctor (said|recommended|prescribed)/i,
  /i (tried|use|found)/i,
  /worked for me/i,
]

function checkNonClinicalBoundary(content: string, file: string) {
  const lines = content.split('\n')
  
  lines.forEach((line, idx) => {
    // Skip if line contains allowed context
    const hasAllowedContext = ALLOWED_CONTEXTS.some(pattern => pattern.test(line))
    if (hasAllowedContext) return
    
    // Check for medical advice patterns
    MEDICAL_ADVICE_PATTERNS.forEach(({ pattern, severity }) => {
      if (pattern.test(line)) {
        violations.push({
          file,
          line: idx + 1,
          constraint: 'Non-clinical boundary (Constraint #1)',
          message: `Potential medical advice detected: "${line.trim().substring(0, 80)}..."`,
          severity,
        })
      }
    })
  })
}

// ============================================================================
// CONSTRAINT #2: Consent-First Data (TLC Article I - Right to Safety)
// ============================================================================

function checkConsentPatterns(content: string, file: string) {
  // Only check API routes and server-side code
  if (!file.includes('api/') && !file.includes('server')) return
  
  const hasDataCollection = /localStorage|sessionStorage|cookies|database|prisma\./i.test(content)
  const hasConsentCheck = /consent|permission|authorized|ConsentRecord/i.test(content)
  
  if (hasDataCollection && !hasConsentCheck) {
    violations.push({
      file,
      line: 0,
      constraint: 'Consent-first data (Constraint #2)',
      message: 'Data collection without consent check detected',
      severity: 'error',
    })
  }
}

// ============================================================================
// CONSTRAINT #3: ML Claims Validation (TLC Article I - Right to Safety)
// ============================================================================

function checkMLClaims(content: string, file: string) {
  const hasMLOutput = /predict|recommend|classify|score|ai\.|openai|anthropic/i.test(content)
  const hasValidation = /validate|verify|check|assert|test/i.test(content)
  
  if (hasMLOutput && !hasValidation) {
    violations.push({
      file,
      line: 0,
      constraint: 'ML claims validation (Constraint #3)',
      message: 'ML output without validation detected',
      severity: 'warning',
    })
  }
}

// ============================================================================
// CONSTRAINT #4: Cognitive Load Limits (TLC Article I - Right to Safety)
// ============================================================================

function checkCognitiveLoad(content: string, file: string) {
  // Check for overly complex components (React/TSX files)
  if (!file.endsWith('.tsx') && !file.endsWith('.jsx')) return
  
  const lines = content.split('\n')
  const componentMatch = content.match(/function\s+(\w+)|const\s+(\w+)\s*=.*?=>/g)
  
  if (componentMatch && lines.length > 500) {
    violations.push({
      file,
      line: 0,
      constraint: 'Cognitive load limits (Constraint #4)',
      message: `Component is ${lines.length} lines - consider breaking into smaller components`,
      severity: 'warning',
    })
  }
  
  // Check for deeply nested JSX
  const maxNesting = lines.reduce((max, line) => {
    const indent = line.match(/^\s*/)?.[0].length || 0
    return Math.max(max, Math.floor(indent / 2))
  }, 0)
  
  if (maxNesting > 8) {
    violations.push({
      file,
      line: 0,
      constraint: 'Cognitive load limits (Constraint #4)',
      message: `JSX nesting depth is ${maxNesting} - consider flattening structure`,
      severity: 'warning',
    })
  }
}

// ============================================================================
// CONSTRAINT #5: Cultural Safety (TLC Article I - Right to Safety)
// ============================================================================

const CULTURALLY_UNSAFE_PATTERNS = [
  { pattern: /\b(ghetto|hood|ratchet)\b/i, message: 'Potentially stereotyping language' },
  { pattern: /\b(articulate|well-spoken)\s+(Black|African American)/i, message: 'Microaggression: implies surprise at eloquence' },
  { pattern: /\ball lives matter\b/i, message: 'Dismissive of Black Lives Matter movement' },
]

function checkCulturalSafety(content: string, file: string) {
  const lines = content.split('\n')
  
  lines.forEach((line, idx) => {
    CULTURALLY_UNSAFE_PATTERNS.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        violations.push({
          file,
          line: idx + 1,
          constraint: 'Cultural safety (Constraint #5)',
          message: `${message}: "${line.trim().substring(0, 80)}..."`,
          severity: 'error',
        })
      }
    })
  })
}

// ============================================================================
// ADDITIONAL CHECKS
// ============================================================================

function checkHardcodedSecrets(content: string, file: string) {
  const secretPatterns = [
    /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
    /secret\s*=\s*['"][^'"]+['"]/i,
    /password\s*=\s*['"][^'"]+['"]/i,
    /token\s*=\s*['"][^'"]+['"]/i,
  ]
  
  const lines = content.split('\n')
  lines.forEach((line, idx) => {
    // Skip if it's an env variable reference
    if (line.includes('process.env') || line.includes('env.')) return
    
    secretPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        violations.push({
          file,
          line: idx + 1,
          constraint: 'Security (TLC Article II - Execution Law)',
          message: 'Hardcoded secret detected - use environment variables',
          severity: 'error',
        })
      }
    })
  })
}

function checkPurposeMapping(content: string, file: string) {
  // Check if new features have purpose documentation
  if (file.includes('features/') || file.includes('components/')) {
    const hasPurposeComment = /\/\*\*[\s\S]*?purpose:/i.test(content) ||
                             /\/\/.*purpose:/i.test(content)
    
    if (!hasPurposeComment && content.length > 100) {
      violations.push({
        file,
        line: 0,
        constraint: 'Purpose Law (TLC Article III)',
        message: 'Feature/component missing purpose documentation',
        severity: 'warning',
      })
    }
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function checkFile(filePath: string) {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`)
    return
  }
  
  // Skip non-code files
  const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']
  if (!codeExtensions.some(ext => filePath.endsWith(ext))) {
    return
  }
  
  // Skip generated files and dependencies
  if (filePath.includes('node_modules') || 
      filePath.includes('.next') || 
      filePath.includes('dist') ||
      filePath.includes('generated')) {
    return
  }
  
  const content = readFileSync(filePath, 'utf-8')
  
  // Run all checks
  checkNonClinicalBoundary(content, filePath)
  checkConsentPatterns(content, filePath)
  checkMLClaims(content, filePath)
  checkCognitiveLoad(content, filePath)
  checkCulturalSafety(content, filePath)
  checkHardcodedSecrets(content, filePath)
  checkPurposeMapping(content, filePath)
}

async function main() {
  console.log('🔍 Checking constitutional constraints...\n')
  
  // Get files to check
  let filesToCheck: string[] = process.argv.slice(2)
  
  // If no files specified, check all staged files (git)
  if (filesToCheck.length === 0) {
    try {
      const { execSync } = require('child_process')
      const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' })
      filesToCheck = stagedFiles.split('\n').filter(Boolean)
    } catch (error) {
      // If not in git repo, check common directories
      filesToCheck = await glob('**/*.{ts,tsx,js,jsx,md,mdx}', {
        ignore: ['node_modules/**', '.next/**', 'dist/**', '**/generated/**'],
      })
    }
  }
  
  if (filesToCheck.length === 0) {
    console.log('✅ No files to check')
    return
  }
  
  console.log(`Checking ${filesToCheck.length} files...\n`)
  
  // Check each file
  for (const file of filesToCheck) {
    await checkFile(file)
  }
  
  // Report results
  if (violations.length === 0) {
    console.log('✅ All constitutional constraints satisfied\n')
    process.exit(0)
  }
  
  // Group violations by severity
  const errors = violations.filter(v => v.severity === 'error')
  const warnings = violations.filter(v => v.severity === 'warning')
  
  if (errors.length > 0) {
    console.error('\n❌ Constitutional Constraint Violations (ERRORS):\n')
    errors.forEach(v => {
      console.error(`${v.file}:${v.line}`)
      console.error(`  ${v.constraint}`)
      console.error(`  ${v.message}\n`)
    })
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  Constitutional Constraint Warnings:\n')
    warnings.forEach(v => {
      console.warn(`${v.file}:${v.line}`)
      console.warn(`  ${v.constraint}`)
      console.warn(`  ${v.message}\n`)
    })
  }
  
  console.log(`\nFound ${errors.length} errors and ${warnings.length} warnings`)
  
  // Exit with error if there are errors
  if (errors.length > 0) {
    console.error('\n❌ Commit blocked due to constitutional constraint violations')
    console.error('Fix the errors above or use --no-verify to bypass (not recommended)\n')
    process.exit(1)
  }
  
  // Warnings don't block commit
  if (warnings.length > 0) {
    console.warn('\n⚠️  Warnings detected but commit will proceed')
    console.warn('Consider addressing these warnings\n')
  }
  
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Governance check failed:', error)
  process.exit(1)
})

// Made with Bob
