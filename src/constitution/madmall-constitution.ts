/**
 * MADMall Constitution v1.0
 * 
 * A TLC Runtime-compliant constitution for the MADMall platform.
 * Implements the Constitutional Interface from TLC 2.0.
 * 
 * @see https://github.com/coreyalejandro/the-living-constitution-2.0
 */

import type {
  Constitution,
  ConstitutionalInvariant,
  Context,
  InvariantState,
  RepairAction,
} from './tlc-interface'

// ────────────────────────────────────────────────────────────────────────────
// Invariant I1: Non-Clinical Boundary (Upstream)
// ────────────────────────────────────────────────────────────────────────────

class NonClinicalBoundaryInvariant implements ConstitutionalInvariant {
  id = 'I1_NonClinicalBoundary'
  description = 'MADMall does NOT diagnose, treat, or prescribe. Routes to healthcare providers and supports personal experience sharing.'
  isUpstream = true
  dependents = ['I2_ConsentFirst', 'I3_MLValidation', 'I4_CognitiveLoad', 'I5_CulturalSafety']

  evaluate(context: Context): InvariantState {
    const { payload } = context
    
    // Check if content exists
    const content = payload.content as string | undefined
    if (!content) return 'NOT_APPLICABLE'

    // Import content filter (would be actual import in production)
    const medicalAdvicePatterns = [
      /you should (take|stop|start|try)/i,
      /this will (cure|treat|fix)/i,
      /you (have|definitely have|probably have)/i,
      /\d+\s*mg\s+(daily|twice|once)/i,
      /(stop|discontinue) (taking|your) medication/i,
    ]

    const allowedContexts = [
      /i (tried|experienced|found)/i,
      /my doctor (said|recommended|prescribed)/i,
      /talk to your doctor/i,
      /consult (a|an|your) (doctor|physician|endocrinologist)/i,
      /this is not medical advice/i,
    ]

    // Check for medical advice patterns
    const hasMedicalAdvice = medicalAdvicePatterns.some(pattern => 
      pattern.test(content)
    )

    // Check for allowed contexts
    const hasAllowedContext = allowedContexts.some(pattern =>
      pattern.test(content)
    )

    if (hasMedicalAdvice && !hasAllowedContext) {
      return 'VIOLATED'
    }

    if (hasMedicalAdvice && hasAllowedContext) {
      return 'AMBIGUOUS' // Needs human review
    }

    return 'SATISFIED'
  }

  repair(context: Context): RepairAction {
    const state = this.evaluate(context)
    
    if (state === 'VIOLATED') {
      return {
        type: 'HALT',
        message: 'Content violates non-clinical boundary. Contains medical advice without proper context. Rephrase as personal experience or route to healthcare provider.',
        blocking: true,
        evidencePath: `evidence/${context.sessionId}/I1_violation_${context.turn}.json`
      }
    }

    if (state === 'AMBIGUOUS') {
      return {
        type: 'PROMPT_USER',
        message: 'Content contains medical terminology. Is this: (a) personal experience sharing, (b) routing to healthcare, or (c) medical advice?',
        blocking: true,
        evidencePath: `evidence/${context.sessionId}/I1_ambiguous_${context.turn}.json`
      }
    }

    return {
      type: 'DISCLOSE',
      message: 'Content cleared non-clinical boundary check',
      blocking: false
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Invariant I2: Consent-First Data
// ────────────────────────────────────────────────────────────────────────────

class ConsentFirstInvariant implements ConstitutionalInvariant {
  id = 'I2_ConsentFirst'
  description = 'All data collection requires explicit, granular, revocable consent. No data collection without user acknowledgment.'
  isUpstream = false
  dependents = []

  evaluate(context: Context): InvariantState {
    const { payload } = context
    
    // Check if this is a data collection action
    const isDataCollection = payload.action === 'collect_data' || 
                            payload.action === 'track_event' ||
                            payload.action === 'store_user_data'
    
    if (!isDataCollection) return 'NOT_APPLICABLE'

    // Check for consent record
    const hasConsent = payload.consentGranted === true
    const consentType = payload.consentType as string | undefined
    const dataTypes = payload.dataTypes as string[] | undefined

    if (!hasConsent) return 'VIOLATED'
    if (!consentType || !dataTypes || dataTypes.length === 0) return 'AMBIGUOUS'

    return 'SATISFIED'
  }

  repair(context: Context): RepairAction {
    const state = this.evaluate(context)
    
    if (state === 'VIOLATED') {
      return {
        type: 'HALT',
        message: 'Data collection attempted without user consent. Present consent dialog before proceeding.',
        blocking: true,
        evidencePath: `evidence/${context.sessionId}/I2_violation_${context.turn}.json`
      }
    }

    if (state === 'AMBIGUOUS') {
      return {
        type: 'PROMPT_USER',
        message: 'Consent record incomplete. Specify: (a) consent type, (b) data types being collected, (c) purpose.',
        blocking: true,
        evidencePath: `evidence/${context.sessionId}/I2_ambiguous_${context.turn}.json`
      }
    }

    return {
      type: 'DISCLOSE',
      message: 'Consent verified for data collection',
      blocking: false
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Invariant I3: ML Validation Required
// ────────────────────────────────────────────────────────────────────────────

class MLValidationInvariant implements ConstitutionalInvariant {
  id = 'I3_MLValidation'
  description = 'All ML-generated content must be validated by qualified humans before publication. No unvalidated ML outputs.'
  isUpstream = false
  dependents = []

  evaluate(context: Context): InvariantState {
    const { payload } = context
    
    // Check if this is ML-generated content
    const isMLGenerated = payload.source === 'ml_model' || 
                         payload.mlGenerated === true
    
    if (!isMLGenerated) return 'NOT_APPLICABLE'

    // Check validation status
    const validationStatus = payload.validationStatus as string | undefined
    const validatedBy = payload.validatedBy as string | undefined

    if (!validationStatus) return 'VIOLATED'
    if (validationStatus === 'PENDING') return 'AMBIGUOUS'
    if (validationStatus === 'REJECTED') return 'VIOLATED'
    if (validationStatus === 'APPROVED' && validatedBy) return 'SATISFIED'

    return 'AMBIGUOUS'
  }

  repair(context: Context): RepairAction {
    const state = this.evaluate(context)
    
    if (state === 'VIOLATED') {
      return {
        type: 'HALT',
        message: 'ML-generated content requires validation before publication. Route to qualified validator.',
        blocking: true,
        evidencePath: `evidence/${context.sessionId}/I3_violation_${context.turn}.json`
      }
    }

    if (state === 'AMBIGUOUS') {
      return {
        type: 'ESCALATE',
        message: 'ML content validation pending. Assign to validator and await approval.',
        blocking: true,
        evidencePath: `evidence/${context.sessionId}/I3_ambiguous_${context.turn}.json`
      }
    }

    return {
      type: 'DISCLOSE',
      message: 'ML content validated and approved',
      blocking: false
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Invariant I4: Cognitive Load Limits
// ────────────────────────────────────────────────────────────────────────────

class CognitiveLoadInvariant implements ConstitutionalInvariant {
  id = 'I4_CognitiveLoad'
  description = 'Content and interactions must respect cognitive load limits. No overwhelming complexity or information density.'
  isUpstream = false
  dependents = []

  evaluate(context: Context): InvariantState {
    const { payload } = context
    
    const content = payload.content as string | undefined
    if (!content) return 'NOT_APPLICABLE'

    // Check content length (5000 char limit)
    if (content.length > 5000) return 'VIOLATED'

    // Check nested complexity (max 3 levels)
    const nestedData = payload.nestedData as any
    if (nestedData) {
      const depth = this.getDepth(nestedData)
      if (depth > 3) return 'VIOLATED'
    }

    // Check concurrent operations
    const concurrentOps = payload.concurrentOperations as number | undefined
    if (concurrentOps && concurrentOps > 5) return 'VIOLATED'

    return 'SATISFIED'
  }

  private getDepth(obj: any, depth = 0): number {
    if (typeof obj !== 'object' || obj === null) return depth
    return Math.max(...Object.values(obj).map(v => this.getDepth(v, depth + 1)))
  }

  repair(context: Context): RepairAction {
    const state = this.evaluate(context)
    
    if (state === 'VIOLATED') {
      return {
        type: 'HALT',
        message: 'Content exceeds cognitive load limits. Simplify: reduce length, flatten structure, or limit concurrent operations.',
        blocking: true,
        evidencePath: `evidence/${context.sessionId}/I4_violation_${context.turn}.json`
      }
    }

    return {
      type: 'DISCLOSE',
      message: 'Content within cognitive load limits',
      blocking: false
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Invariant I5: Cultural Safety
// ────────────────────────────────────────────────────────────────────────────

class CulturalSafetyInvariant implements ConstitutionalInvariant {
  id = 'I5_CulturalSafety'
  description = 'Content must respect cultural context and community norms. No culturally insensitive or harmful content.'
  isUpstream = false
  dependents = []

  evaluate(context: Context): InvariantState {
    const { payload } = context
    
    const content = payload.content as string | undefined
    if (!content) return 'NOT_APPLICABLE'

    // Check for cultural context
    const culturalContext = payload.culturalContext as any
    const community = payload.community as string | undefined

    // If cultural context is provided, check for sensitivity flags
    const culturalSafetyFlag = payload.culturalSafetyFlag as boolean | undefined
    
    if (culturalSafetyFlag === true) return 'AMBIGUOUS'
    if (culturalContext && community) return 'SATISFIED'
    
    // Default to satisfied if no cultural concerns flagged
    return 'SATISFIED'
  }

  repair(context: Context): RepairAction {
    const state = this.evaluate(context)
    
    if (state === 'AMBIGUOUS') {
      return {
        type: 'ESCALATE',
        message: 'Content flagged for cultural safety review. Route to community moderator for evaluation.',
        blocking: true,
        evidencePath: `evidence/${context.sessionId}/I5_ambiguous_${context.turn}.json`
      }
    }

    return {
      type: 'DISCLOSE',
      message: 'Content respects cultural safety guidelines',
      blocking: false
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// MADMall Constitution
// ────────────────────────────────────────────────────────────────────────────

export class MADMallConstitution implements Constitution {
  id = 'madmall'
  version = '1.0.0'
  
  invariants: ConstitutionalInvariant[] = [
    new NonClinicalBoundaryInvariant(),
    new ConsentFirstInvariant(),
    new MLValidationInvariant(),
    new CognitiveLoadInvariant(),
    new CulturalSafetyInvariant(),
  ]

  getUpstreamInvariant(): ConstitutionalInvariant | null {
    return this.invariants.find(inv => inv.isUpstream) || null
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Export
// ────────────────────────────────────────────────────────────────────────────

export const madmallConstitution = new MADMallConstitution()

// Made with Bob
