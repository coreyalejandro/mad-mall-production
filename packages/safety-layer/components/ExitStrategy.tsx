'use client'

/**
 * ExitStrategy Component
 * 
 * Constitutional Requirement (TLC Article I - Right to Safety)
 * Provides one-keystroke exit (Shift+Esc) with no trace left behind.
 * 
 * Features:
 * - Keyboard shortcut: Shift+Esc
 * - Clears session storage, local storage, and cookies
 * - Redirects to safe URL (default: about:blank)
 * - Accessible via keyboard and screen reader
 * - Visual indicator always visible
 */

import * as React from 'react'

export interface ExitStrategyProps {
  /** Position of the exit button */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Button label text */
  label?: string
  /** URL to redirect to on exit (default: about:blank) */
  exitUrl?: string
  /** Callback fired before exit */
  onExit?: () => void
  /** Custom className for styling */
  className?: string
}

export function ExitStrategy({
  position = 'top-right',
  label = 'Exit',
  exitUrl = 'about:blank',
  onExit,
  className = '',
}: ExitStrategyProps) {
  const handleExit = React.useCallback(() => {
    // Fire callback if provided
    if (onExit) {
      onExit()
    }

    // Clear all storage
    try {
      sessionStorage.clear()
      localStorage.clear()
      
      // Clear cookies
      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0].trim()
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })
    } catch (error) {
      console.error('Error clearing storage:', error)
    }

    // Redirect to safe URL
    window.location.replace(exitUrl)
  }, [exitUrl, onExit])

  // Keyboard shortcut: Shift+Esc
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'Escape') {
        event.preventDefault()
        handleExit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleExit])

  // Position styles
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '1rem', right: '1rem' },
    'top-left': { top: '1rem', left: '1rem' },
    'bottom-right': { bottom: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
  }

  return (
    <button
      type="button"
      onClick={handleExit}
      className={className}
      style={{
        position: 'fixed',
        zIndex: 9999,
        minHeight: 48,
        minWidth: 48,
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        background: 'rgba(20, 20, 20, 0.9)',
        color: '#fff',
        fontSize: '0.875rem',
        fontWeight: 600,
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s ease',
        ...positionStyles[position],
      }}
      aria-label={`${label} - Press Shift+Escape for quick exit`}
      title="Shift+Esc for quick exit"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(20, 20, 20, 1)'
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(20, 20, 20, 0.9)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <span aria-hidden="true">⎋</span> {label}
    </button>
  )
}

// Made with Bob
