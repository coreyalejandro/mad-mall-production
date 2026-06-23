/**
 * API Middleware for Non-Clinical Boundary Enforcement
 * 
 * Provides Next.js middleware and API route helpers for content filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { filterContent, type FilterResult } from './index'

/**
 * Middleware configuration
 */
export interface ContentFilterConfig {
  strictMode?: boolean
  allowWarnings?: boolean
  customErrorMessage?: string
}

/**
 * Create API middleware for content filtering
 */
export function createContentFilterMiddleware(config: ContentFilterConfig = {}) {
  return async (req: NextRequest) => {
    // Only filter POST/PUT/PATCH requests with content
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return NextResponse.next()
    }

    try {
      const body = await req.json()
      
      // Check for content fields that need filtering
      const contentFields = ['content', 'body', 'message', 'text', 'description']
      const fieldsToCheck = contentFields.filter(field => field in body)
      
      if (fieldsToCheck.length === 0) {
        return NextResponse.next()
      }

      // Filter all content fields
      for (const field of fieldsToCheck) {
        const content = body[field]
        if (typeof content !== 'string') continue

        const result = filterContent(content, { strictMode: config.strictMode })
        
        // Block if not allowed
        if (!result.allowed) {
          return NextResponse.json({
            error: config.customErrorMessage || 'Content violates non-clinical boundary',
            details: {
              field,
              severity: result.severity,
              flags: result.flags,
              suggestions: result.suggestions
            }
          }, { status: 400 })
        }
        
        // Optionally block warnings
        if (!config.allowWarnings && result.severity === 'warning') {
          return NextResponse.json({
            error: 'Content may contain medical advice',
            details: {
              field,
              severity: result.severity,
              flags: result.flags,
              suggestions: result.suggestions
            }
          }, { status: 400 })
        }
      }

      return NextResponse.next()
    } catch (error) {
      // If we can't parse the body, let it through (other middleware will handle)
      return NextResponse.next()
    }
  }
}

/**
 * API route helper for content validation
 */
export async function validateContent(
  req: NextRequest,
  config: ContentFilterConfig = {}
): Promise<{ valid: true } | { valid: false; error: NextResponse }> {
  try {
    const body = await req.json()
    
    // Check for content fields
    const contentFields = ['content', 'body', 'message', 'text', 'description']
    const fieldsToCheck = contentFields.filter(field => field in body)
    
    if (fieldsToCheck.length === 0) {
      return { valid: true }
    }

    // Filter all content fields
    for (const field of fieldsToCheck) {
      const content = body[field]
      if (typeof content !== 'string') continue

      const result = filterContent(content, { strictMode: config.strictMode })
      
      if (!result.allowed) {
        return {
          valid: false,
          error: NextResponse.json({
            error: config.customErrorMessage || 'Content violates non-clinical boundary',
            details: {
              field,
              severity: result.severity,
              flags: result.flags,
              suggestions: result.suggestions
            }
          }, { status: 400 })
        }
      }
      
      if (!config.allowWarnings && result.severity === 'warning') {
        return {
          valid: false,
          error: NextResponse.json({
            error: 'Content may contain medical advice',
            details: {
              field,
              severity: result.severity,
              flags: result.flags,
              suggestions: result.suggestions
            }
          }, { status: 400 })
        }
      }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: NextResponse.json({
        error: 'Invalid request body'
      }, { status: 400 })
    }
  }
}

/**
 * Express-style middleware (for non-Next.js apps)
 */
export function expressContentFilter(config: ContentFilterConfig = {}) {
  return (req: any, res: any, next: any) => {
    // Only filter POST/PUT/PATCH requests
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return next()
    }

    const body = req.body
    if (!body) {
      return next()
    }

    // Check for content fields
    const contentFields = ['content', 'body', 'message', 'text', 'description']
    const fieldsToCheck = contentFields.filter(field => field in body)
    
    if (fieldsToCheck.length === 0) {
      return next()
    }

    // Filter all content fields
    for (const field of fieldsToCheck) {
      const content = body[field]
      if (typeof content !== 'string') continue

      const result = filterContent(content, { strictMode: config.strictMode })
      
      if (!result.allowed) {
        return res.status(400).json({
          error: config.customErrorMessage || 'Content violates non-clinical boundary',
          details: {
            field,
            severity: result.severity,
            flags: result.flags,
            suggestions: result.suggestions
          }
        })
      }
      
      if (!config.allowWarnings && result.severity === 'warning') {
        return res.status(400).json({
          error: 'Content may contain medical advice',
          details: {
            field,
            severity: result.severity,
            flags: result.flags,
            suggestions: result.suggestions
          }
        })
      }
    }

    next()
  }
}

/**
 * Webhook validation helper
 */
export function validateWebhookContent(
  payload: any,
  config: ContentFilterConfig = {}
): { valid: true } | { valid: false; error: string; details: any } {
  const contentFields = ['content', 'body', 'message', 'text', 'description']
  const fieldsToCheck = contentFields.filter(field => field in payload)
  
  if (fieldsToCheck.length === 0) {
    return { valid: true }
  }

  for (const field of fieldsToCheck) {
    const content = payload[field]
    if (typeof content !== 'string') continue

    const result = filterContent(content, { strictMode: config.strictMode })
    
    if (!result.allowed) {
      return {
        valid: false,
        error: config.customErrorMessage || 'Content violates non-clinical boundary',
        details: {
          field,
          severity: result.severity,
          flags: result.flags,
          suggestions: result.suggestions
        }
      }
    }
    
    if (!config.allowWarnings && result.severity === 'warning') {
      return {
        valid: false,
        error: 'Content may contain medical advice',
        details: {
          field,
          severity: result.severity,
          flags: result.flags,
          suggestions: result.suggestions
        }
      }
    }
  }

  return { valid: true }
}

// Made with Bob
