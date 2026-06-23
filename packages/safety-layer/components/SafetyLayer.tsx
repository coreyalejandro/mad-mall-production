'use client'

/**
 * SafetyLayer Component
 * 
 * Constitutional Requirement (TLC Article I - Right to Safety)
 * Combines all three safety components into a single layer.
 * 
 * This component should be included in the root layout of every MADMall app.
 */

import * as React from 'react'
import { ExitStrategy, type ExitStrategyProps } from './ExitStrategy'
import { PanicButton, type PanicButtonProps } from './PanicButton'
import { GroundingReset, type GroundingResetProps } from './GroundingReset'

export interface SafetyLayerProps {
  /** ExitStrategy configuration */
  exitStrategy?: Partial<ExitStrategyProps>
  /** PanicButton configuration */
  panicButton?: Partial<PanicButtonProps>
  /** GroundingReset configuration */
  groundingReset?: Partial<GroundingResetProps>
  /** Show grounding button */
  showGroundingButton?: boolean
}

export function SafetyLayer({
  exitStrategy,
  panicButton,
  groundingReset,
  showGroundingButton = true,
}: SafetyLayerProps) {
  const [showGrounding, setShowGrounding] = React.useState(false)

  return (
    <>
      {/* Exit sovereignty - always visible */}
      <ExitStrategy {...exitStrategy} />

      {/* Crisis access - always visible */}
      <PanicButton {...panicButton} />

      {/* Grounding trigger button */}
      {showGroundingButton && (
        <button
          type="button"
          onClick={() => setShowGrounding(true)}
          style={{
            position: 'fixed',
            bottom: '1rem',
            left: '1rem',
            zIndex: 9999,
            minHeight: 48,
            padding: '0.85rem 1.3rem',
            borderRadius: '100px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            color: '#fff',
            background: '#4b6a6d',
            boxShadow: '0 10px 30px rgba(75,106,109,.35)',
            transition: 'all 0.2s ease',
          }}
          aria-haspopup="dialog"
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLButtonElement
            target.style.background = '#3d5557'
            target.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLButtonElement
            target.style.background = '#4b6a6d'
            target.style.transform = 'scale(1)'
          }}
        >
          🌿 Grounding
        </button>
      )}

      {/* Grounding modal */}
      {showGrounding && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Grounding reset"
          onClick={() => setShowGrounding(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(20,20,20,.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GroundingReset {...groundingReset} />
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setShowGrounding(false)}
                style={{
                  border: '1px solid rgba(252,250,242,.4)',
                  background: 'transparent',
                  color: '#fcfaf2',
                  borderRadius: '100px',
                  padding: '0.5rem 1.2rem',
                  cursor: 'pointer',
                  fontSize: '.8rem',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Made with Bob
