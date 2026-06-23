'use client'

/**
 * PanicButton Component
 * 
 * Constitutional Requirement (TLC Article I - Right to Safety)
 * Provides immediate access to 988 crisis line, always visible.
 * 
 * Features:
 * - Direct link to 988 crisis line
 * - Always visible (fixed position)
 * - Optional pulse animation
 * - High contrast for visibility
 * - Touch-friendly (48px minimum tap target)
 * - Accessible via keyboard and screen reader
 */

import * as React from 'react'

export interface PanicButtonProps {
  /** Position type */
  position?: 'fixed' | 'absolute'
  /** Button label text */
  label?: string
  /** Enable pulse animation */
  pulse?: boolean
  /** Crisis line number (default: 988) */
  crisisLine?: string
  /** Custom className for styling */
  className?: string
}

export function PanicButton({
  position = 'fixed',
  label = 'Get Help',
  pulse = false,
  crisisLine = '988',
  className = '',
}: PanicButtonProps) {
  const crisisUrl = `tel:${crisisLine}`

  return (
    <>
      {pulse && (
        <style>{`
          @keyframes panic-pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
          .panic-button-pulse {
            animation: panic-pulse 2s ease-in-out infinite;
          }
        `}</style>
      )}
      <a
        href={crisisUrl}
        className={`${className} ${pulse ? 'panic-button-pulse' : ''}`}
        style={{
          position,
          bottom: '1rem',
          right: '1rem',
          zIndex: 9999,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          minHeight: 48,
          minWidth: 48,
          padding: '0.85rem 1.3rem',
          borderRadius: '100px',
          border: 'none',
          background: '#dc2626',
          color: '#fff',
          fontSize: '0.875rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        aria-label={`${label} - Call ${crisisLine} crisis line`}
        role="button"
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLAnchorElement
          target.style.background = '#b91c1c'
          target.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLAnchorElement
          target.style.background = '#dc2626'
          target.style.transform = 'scale(1)'
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>
          🆘
        </span>
        <span>{label}</span>
      </a>
    </>
  )
}

// Made with Bob
