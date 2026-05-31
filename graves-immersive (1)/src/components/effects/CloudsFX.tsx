/**
 * CloudsFX.tsx
 * Animated procedural "cloud/fog" overlay using SVG feTurbulence and lightweight attribute animation.
 * - Renders as an absolutely-positioned overlay; place above backgrounds and below content.
 * - Honors reduceMotion: when true, renders a static cloud texture (no animation).
 */

import React, { useId } from 'react'

/** Props for CloudsFX */
export interface CloudsFXProps {
  /** Overall opacity of the clouds overlay (0..1) */
  opacity?: number
  /** CSS blend mode for overlay, e.g., 'screen' | 'overlay' | 'soft-light' */
  blendMode?: React.CSSProperties['mixBlendMode']
  /** Base color of the fog (usually white for "screen" blend) */
  color?: string
  /** Animation speed factor (higher = faster) */
  speed?: number
  /** Reduce motion (static texture) */
  reduceMotion?: boolean
  /** Optional extra className for positioning */
  className?: string
}

/**
 * CloudsFX
 * - Uses two layers of fractal noise with different seeds and drift timings for parallax-like motion.
 * - Designed to sit as: <div className="absolute inset-0 z-0 pointer-events-none"><CloudsFX /></div>
 */
export default function CloudsFX({
  opacity = 0.28,
  blendMode = 'screen',
  color = '#ffffff',
  speed = 1,
  reduceMotion = false,
  className,
}: CloudsFXProps) {
  const id = useId().replace(/:/g, '')
  const id1 = `cloudsA-${id}`
  const id2 = `cloudsB-${id}`

  // Durations derive from speed; larger speed => faster anim (shorter dur)
  const dur1 = `${Math.max(10, 80 / speed)}s`
  const dur2 = `${Math.max(10, 120 / speed)}s`
  const drift1 = `${Math.max(10, 140 / speed)}s`
  const drift2 = `${Math.max(10, 200 / speed)}s`

  return (
    <div
      className={className}
      aria-hidden
      style={{
        mixBlendMode: blendMode,
        pointerEvents: 'none',
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Layer A */}
          <filter id={id1} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009"
              numOctaves="2"
              seed="3"
              result="turb"
            >
              {!reduceMotion && (
                <animate
                  attributeName="baseFrequency"
                  values="0.008;0.012;0.008"
                  dur={dur1}
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            {/* Push noise to softer, cloud-like alpha */}
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.35 0.8 0.0" />
            </feComponentTransfer>
          </filter>

          {/* Layer B (different seed/scale) */}
          <filter id={id2} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006"
              numOctaves="3"
              seed="7"
              result="turb"
            >
              {!reduceMotion && (
                <animate
                  attributeName="baseFrequency"
                  values="0.006;0.010;0.006"
                  dur={dur2}
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.22 0.65 0" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Drifting rectangles slightly larger than the viewport to avoid edges */}
        <g opacity={opacity}>
          <rect
            x="-10"
            y="-10"
            width="120"
            height="120"
            fill={color}
            filter={`url(#${id1})`}
          >
            {!reduceMotion && (
              <animate
                attributeName="x"
                values="-10;0;-10"
                dur={drift1}
                repeatCount="indefinite"
              />
            )}
          </rect>

          <rect
            x="0"
            y="0"
            width="120"
            height="120"
            fill={color}
            filter={`url(#${id2})`}
          >
            {!reduceMotion && (
              <animate
                attributeName="x"
                values="0;-10;0"
                dur={drift2}
                repeatCount="indefinite"
              />
            )}
          </rect>
        </g>
      </svg>
    </div>
  )
}
