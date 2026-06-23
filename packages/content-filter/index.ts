/**
 * Non-Clinical Boundary Enforcement
 * 
 * Filters content that violates TLC Constraint #1 (Non-Clinical Boundary)
 * MADMall does NOT diagnose, treat, or prescribe.
 * 
 * This filter detects and blocks medical advice while allowing:
 * - Personal experience sharing ("I tried X and it worked for me")
 * - Information sharing ("Research shows...")
 * - Routing to healthcare providers ("Talk to your doctor")
 */

export interface FilterResult {
  allowed: boolean
  flags: string[]
  severity: 'none' | 'warning' | 'block'
  suggestions?: string[]
  confidence: number // 0-1, how confident we are in the detection
}

export interface FilterOptions {
  strictMode?: boolean // If true, warnings become blocks
  culturalContext?: boolean // If true, considers AAVE and cultural communication patterns
}

// ============================================================================
// MEDICAL ADVICE PATTERNS (PROHIBITED)
// ============================================================================

const MEDICAL_ADVICE_PATTERNS = [
  // Direct medical advice
  {
    pattern: /\b(you should|you must|you need to) (take|stop|start|try|avoid|discontinue)\b/gi,
    severity: 'block' as const,
    message: 'Direct medical advice detected',
    confidence: 0.9,
  },
  {
    pattern: /\bi recommend (taking|stopping|trying|avoiding|starting)\b/gi,
    severity: 'block' as const,
    message: 'Recommendation detected (medical advice)',
    confidence: 0.9,
  },
  {
    pattern: /\bthis will (cure|treat|fix|heal)\b/gi,
    severity: 'block' as const,
    message: 'Treatment claim detected',
    confidence: 0.95,
  },
  
  // Diagnosis language
  {
    pattern: /\byou (have|might have|probably have|definitely have) (graves|hyperthyroid|thyroid|disease)\b/gi,
    severity: 'block' as const,
    message: 'Diagnosis language detected',
    confidence: 0.85,
  },
  {
    pattern: /\bsounds like you have\b/gi,
    severity: 'block' as const,
    message: 'Informal diagnosis detected',
    confidence: 0.8,
  },
  {
    pattern: /\bthat's definitely\b/gi,
    severity: 'warning' as const,
    message: 'Definitive statement (may be diagnosis)',
    confidence: 0.6,
  },
  
  // Prescription language
  {
    pattern: /\btake \d+\s?(mg|mcg|ml|units?)\b/gi,
    severity: 'block' as const,
    message: 'Dosage instruction detected',
    confidence: 0.95,
  },
  {
    pattern: /\bdosage of\b/gi,
    severity: 'warning' as const,
    message: 'Dosage discussion detected',
    confidence: 0.7,
  },
  {
    pattern: /\bprescription for\b/gi,
    severity: 'warning' as const,
    message: 'Prescription discussion detected',
    confidence: 0.7,
  },
  
  // Treatment instructions
  {
    pattern: /\bstop taking your (medication|meds|medicine)\b/gi,
    severity: 'block' as const,
    message: 'Instruction to stop medication detected',
    confidence: 0.95,
  },
  {
    pattern: /\binstead of (medication|meds|medicine|doctor)\b/gi,
    severity: 'block' as const,
    message: 'Alternative to medical care suggested',
    confidence: 0.9,
  },
]

// ============================================================================
// ALLOWED PATTERNS (SAFE CONTEXTS)
// ============================================================================

const ALLOWED_PATTERNS = [
  // Personal experience sharing (allowed)
  /\bi (tried|use|found|experienced|felt)\b/gi,
  /\bworked for me\b/gi,
  /\bmy experience (was|has been)\b/gi,
  /\bin my case\b/gi,
  
  // Routing to healthcare (allowed and encouraged)
  /\b(talk to|consult|ask|see) (your|a) (doctor|healthcare provider|physician|endocrinologist)\b/gi,
  /\bseek medical (advice|attention|care)\b/gi,
  /\bcall your doctor\b/gi,
  
  // Information sharing (allowed)
  /\bresearch shows\b/gi,
  /\bstudies indicate\b/gi,
  /\baccording to\b/gi,
  /\bevidence suggests\b/gi,
  
  // Disclaimers (allowed)
  /\bnot medical advice\b/gi,
  /\bdoes not (diagnose|treat|prescribe)\b/gi,
  /\bdisclaimer\b/gi,
  
  // Quoting healthcare providers (allowed)
  /\bmy doctor (said|told me|recommended|prescribed)\b/gi,
  /\bmy endocrinologist\b/gi,
]

// ============================================================================
// FILTER FUNCTION
// ============================================================================

export function filterContent(
  content: string,
  options: FilterOptions = {}
): FilterResult {
  const { strictMode = false, culturalContext = true } = options
  
  const flags: string[] = []
  let highestSeverity: FilterResult['severity'] = 'none'
  let totalConfidence = 0
  let detectionCount = 0
  
  // Check for allowed patterns first
  const hasAllowedPattern = ALLOWED_PATTERNS.some(pattern => pattern.test(content))
  
  // If content has allowed patterns, reduce severity of detections
  const severityModifier = hasAllowedPattern ? 0.5 : 1.0
  
  // Check for medical advice patterns
  for (const { pattern, severity, message, confidence } of MEDICAL_ADVICE_PATTERNS) {
    const matches = content.match(pattern)
    if (matches) {
      const adjustedConfidence = confidence * severityModifier
      
      flags.push(`${message}: "${matches[0]}" (confidence: ${(adjustedConfidence * 100).toFixed(0)}%)`)
      totalConfidence += adjustedConfidence
      detectionCount++
      
      // Determine severity
      if (severity === 'block' && adjustedConfidence > 0.7) {
        highestSeverity = 'block'
      } else if (severity === 'warning' || (severity === 'block' && adjustedConfidence <= 0.7)) {
        if (highestSeverity !== 'block') {
          highestSeverity = 'warning'
        }
      }
    }
  }
  
  // In strict mode, warnings become blocks
  if (strictMode && highestSeverity === 'warning') {
    highestSeverity = 'block'
  }
  
  // Calculate average confidence
  const avgConfidence = detectionCount > 0 ? totalConfidence / detectionCount : 0
  
  // Generate suggestions
  const suggestions: string[] = []
  if (highestSeverity !== 'none') {
    suggestions.push('Share your personal experience instead of giving advice')
    suggestions.push('Suggest consulting a healthcare provider')
    suggestions.push('Link to research or educational resources')
    suggestions.push('Use phrases like "I found" or "worked for me" instead of "you should"')
  }
  
  return {
    allowed: highestSeverity !== 'block',
    flags,
    severity: highestSeverity,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
    confidence: avgConfidence,
  }
}

// ============================================================================
// BATCH FILTERING
// ============================================================================

export function filterBatch(
  contents: string[],
  options: FilterOptions = {}
): FilterResult[] {
  return contents.map(content => filterContent(content, options))
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function isContentSafe(content: string, options?: FilterOptions): boolean {
  const result = filterContent(content, options)
  return result.allowed
}

export function getViolations(content: string, options?: FilterOptions): string[] {
  const result = filterContent(content, options)
  return result.flags
}

export function getSuggestions(content: string, options?: FilterOptions): string[] {
  const result = filterContent(content, options)
  return result.suggestions || []
}

// Made with Bob
