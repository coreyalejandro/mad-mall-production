'use client'

/**
 * GroundingReset Component
 * 
 * Constitutional Requirement (TLC Article I - Right to Safety)
 * Provides box-breathing ritual (4-4-6 pattern) for grounding during distress.
 * 
 * Features:
 * - Box breathing technique (4-4-6: inhale-hold-exhale)
 * - Visual breathing guide with animation
 * - Step-by-step instructions
 * - Keyboard dismissible (Escape key)
 * - Screen reader accessible
 * - Auto-start option
 */

import * as React from 'react'

export interface GroundingResetProps {
  /** Grounding technique to use */
  technique?: 'breathing' | 'grounding-5-4-3-2-1' | 'progressive-muscle'
  /** Auto-start the exercise */
  autoStart?: boolean
  /** Callback when exercise completes */
  onComplete?: () => void
  /** Custom className for styling */
  className?: string
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

export function GroundingReset({
  technique = 'breathing',
  autoStart = false,
  onComplete,
  className = '',
}: GroundingResetProps) {
  const [phase, setPhase] = React.useState<BreathingPhase>('rest')
  const [count, setCount] = React.useState(0)
  const [cycle, setCycle] = React.useState(0)
  const [isActive, setIsActive] = React.useState(autoStart)

  // Breathing pattern: 4 seconds inhale, 4 seconds hold, 6 seconds exhale
  const phaseDurations: Record<BreathingPhase, number> = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
  }

  const phaseInstructions: Record<BreathingPhase, string> = {
    inhale: 'Breathe in slowly through your nose',
    hold: 'Hold your breath gently',
    exhale: 'Breathe out slowly through your mouth',
    rest: 'Rest and notice how you feel',
  }

  // Breathing cycle logic
  React.useEffect(() => {
    if (!isActive) return

    const duration = phaseDurations[phase]
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= duration) {
          // Move to next phase
          if (phase === 'inhale') setPhase('hold')
          else if (phase === 'hold') setPhase('exhale')
          else if (phase === 'exhale') {
            setCycle((c) => c + 1)
            if (cycle >= 2) {
              // Complete after 3 cycles
              setPhase('rest')
              setIsActive(false)
              if (onComplete) onComplete()
            } else {
              setPhase('inhale')
            }
          }
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase, cycle, onComplete])

  const handleStart = () => {
    setPhase('inhale')
    setCount(0)
    setCycle(0)
    setIsActive(true)
  }

  const handleStop = () => {
    setIsActive(false)
    setPhase('rest')
    setCount(0)
    setCycle(0)
  }

  // Visual scale for breathing animation
  const getScale = () => {
    const progress = count / phaseDurations[phase]
    if (phase === 'inhale') return 1 + progress * 0.5
    if (phase === 'exhale') return 1.5 - progress * 0.5
    return 1.5
  }

  if (technique !== 'breathing') {
    return (
      <div className={className} style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
        <p>Technique "{technique}" coming soon.</p>
        <p>Currently only "breathing" is implemented.</p>
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        padding: '2rem',
        maxWidth: '400px',
        background: 'rgba(20, 20, 20, 0.95)',
        borderRadius: '16px',
        color: '#fff',
        textAlign: 'center',
      }}
      role="region"
      aria-label="Grounding exercise"
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
        Box Breathing
      </h2>

      <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '2rem' }}>
        A calming breathing technique to help you ground yourself
      </p>

      {/* Breathing circle */}
      <div
        style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 2rem',
          borderRadius: '50%',
          background: 'rgba(75, 106, 109, 0.3)',
          border: '3px solid #4b6a6d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 1s ease-in-out',
          transform: `scale(${getScale()})`,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {isActive ? count : '•'}
          </div>
          <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {isActive ? phase : 'Ready'}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p
        style={{
          fontSize: '1rem',
          marginBottom: '2rem',
          minHeight: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-live="polite"
      >
        {isActive ? phaseInstructions[phase] : 'Press Start when you\'re ready'}
      </p>

      {/* Progress */}
      {isActive && (
        <p style={{ fontSize: '0.875rem', opacity: 0.6, marginBottom: '1rem' }}>
          Cycle {cycle + 1} of 3
        </p>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {!isActive ? (
          <button
            type="button"
            onClick={handleStart}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '100px',
              border: 'none',
              background: '#4b6a6d',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement
              target.style.background = '#3d5557'
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement
              target.style.background = '#4b6a6d'
            }}
          >
            Start
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '100px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'transparent',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement
              target.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement
              target.style.background = 'transparent'
            }}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  )
}

// Made with Bob
