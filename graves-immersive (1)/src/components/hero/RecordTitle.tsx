/**
 * RecordTitle.tsx
 * A compact spinning "vinyl record" style title disc for the hero section.
 * - Spins continuously (if not reduced-motion) and acts as a CTA to start the tour.
 * - Minimal footprint to keep the background visible.
 */

import React, { useState } from 'react'

/** Props for RecordTitle */
export interface RecordTitleProps {
  /** Main headline (may be short; text rotates with disc) */
  title: string
  /** Optional subline (rotates with disc) */
  subtitle?: string
  /** Optional anchor to navigate on click (e.g., #intro) */
  href?: string
  /** Whether the disc should spin (disable when reduceMotion is true) */
  spinning?: boolean
}

/**
 * RecordTitle
 * - Renders a layered circular disc with subtle radial grooves and a center label.
 * - Uses CSS gradients; hover pauses spin for readability.
 */
export default function RecordTitle({ title, subtitle, href, spinning = true }: RecordTitleProps) {
  const [hover, setHover] = useState(false)

  // Compose animation string; pause on hover for legibility
  const animation = spinning && !hover ? 'spin 16s linear infinite' : undefined

  const Disc = (
    <div
      className="relative grid place-items-center rounded-full shadow-2xl border border-white/10 dark:border-white/10 overflow-hidden select-none"
      style={{
        width: '14rem',
        height: '14rem',
        // Layered gradients for "vinyl" look
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 55%, rgba(0,0,0,0.7) 75%),
          repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)
        `,
        backgroundColor: 'rgba(0,0,0,0.6)',
        animation,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Start the tour"
    >
      {/* Highlight sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18), rgba(255,255,255,0) 40%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Center label */}
      <div className="relative z-10 grid place-items-center rounded-full border shadow bg-white/90 dark:bg-black/75 border-black/10 dark:border-white/10"
        style={{ width: '6.2rem', height: '6.2rem', backdropFilter: 'blur(6px)' }}
      >
        <div className="px-3 text-center leading-tight">
          <div className="text-xs uppercase tracking-wide opacity-70">The Tour</div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle ? <div className="text-[10px] opacity-70">{subtitle}</div> : null}
        </div>
      </div>
      {/* Tiny center spindle */}
      <div className="absolute w-2 h-2 rounded-full bg-black/80 dark:bg-white/80" />
      {/* Outer ring glow for contrast */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 0 70px 10px rgba(255,255,255,0.12) inset, 0 8px 30px rgba(0,0,0,0.35)',
        }}
      />
    </div>
  )

  return href ? (
    <a href={href} className="group" aria-label="Start the tour via spinning record">
      {Disc}
    </a>
  ) : (
    Disc
  )
}
