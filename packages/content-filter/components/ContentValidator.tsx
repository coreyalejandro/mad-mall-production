/**
 * React Component for Content Validation
 * 
 * Provides real-time content filtering UI for forms
 */

'use client'

import { useState, useEffect } from 'react'
import { filterContent, type FilterResult } from '../index'

export interface ContentValidatorProps {
  content: string
  onChange?: (isValid: boolean, result: FilterResult) => void
  showWarnings?: boolean
  strictMode?: boolean
  className?: string
}

/**
 * Real-time content validator component
 */
export function ContentValidator({
  content,
  onChange,
  showWarnings = true,
  strictMode = false,
  className = ''
}: ContentValidatorProps) {
  const [result, setResult] = useState<FilterResult | null>(null)

  useEffect(() => {
    if (!content) {
      setResult(null)
      onChange?.(true, { allowed: true, severity: 'none', flags: [], confidence: 1 })
      return
    }

    const filterResult = filterContent(content, { strictMode })
    setResult(filterResult)
    onChange?.(filterResult.allowed, filterResult)
  }, [content, strictMode, onChange])

  if (!result || result.severity === 'none') {
    return null
  }

  const isError = result.severity === 'block' || (strictMode && result.severity === 'warning')
  const isWarning = result.severity === 'warning' && !strictMode

  if (!showWarnings && isWarning) {
    return null
  }

  return (
    <div className={`content-validator ${className}`}>
      <div className={`alert ${isError ? 'alert-error' : 'alert-warning'}`}>
        <div className="alert-icon">
          {isError ? '🚫' : '⚠️'}
        </div>
        <div className="alert-content">
          <div className="alert-title">
            {isError ? 'Content Blocked' : 'Content Warning'}
          </div>
          <div className="alert-message">
            {isError 
              ? 'This content violates our non-clinical boundary policy.'
              : 'This content may contain medical advice.'}
          </div>
          {result.flags.length > 0 && (
            <div className="alert-flags">
              <strong>Issues detected:</strong>
              <ul>
                {result.flags.map((flag, i) => (
                  <li key={i}>{flag.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
          )}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="alert-suggestions">
              <strong>Suggestions:</strong>
              <ul>
                {result.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .content-validator {
          margin-top: 0.5rem;
        }
        .alert {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        .alert-error {
          background-color: #fee;
          border: 1px solid #fcc;
          color: #c00;
        }
        .alert-warning {
          background-color: #ffc;
          border: 1px solid #fc0;
          color: #840;
        }
        .alert-icon {
          font-size: 1.5rem;
          line-height: 1;
        }
        .alert-content {
          flex: 1;
        }
        .alert-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .alert-message {
          margin-bottom: 0.5rem;
        }
        .alert-flags,
        .alert-suggestions {
          margin-top: 0.5rem;
        }
        .alert-flags ul,
        .alert-suggestions ul {
          margin: 0.25rem 0 0 1.25rem;
          padding: 0;
        }
        .alert-flags li,
        .alert-suggestions li {
          margin: 0.125rem 0;
        }
      `}</style>
    </div>
  )
}

/**
 * Hook for content validation
 */
export function useContentValidation(
  content: string,
  options: { strictMode?: boolean } = {}
) {
  const [result, setResult] = useState<FilterResult | null>(null)
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    if (!content) {
      setResult(null)
      setIsValid(true)
      return
    }

    const filterResult = filterContent(content, options)
    setResult(filterResult)
    setIsValid(filterResult.allowed)
  }, [content, options.strictMode])

  return {
    result,
    isValid,
    isBlocked: result?.severity === 'block',
    hasWarning: result?.severity === 'warning',
    flags: result?.flags || [],
    suggestions: result?.suggestions || []
  }
}

/**
 * Inline validation badge
 */
export function ValidationBadge({ 
  content, 
  strictMode = false 
}: { 
  content: string
  strictMode?: boolean 
}) {
  const { isValid, isBlocked, hasWarning } = useContentValidation(content, { strictMode })

  if (isValid && !hasWarning) {
    return (
      <span className="badge badge-success">
        ✓ Safe
      </span>
    )
  }

  if (isBlocked) {
    return (
      <span className="badge badge-error">
        ✗ Blocked
      </span>
    )
  }

  if (hasWarning) {
    return (
      <span className="badge badge-warning">
        ⚠ Warning
      </span>
    )
  }

  return null
}

// Made with Bob
