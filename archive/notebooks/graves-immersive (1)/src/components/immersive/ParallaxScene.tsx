/**
 * ParallaxScene.tsx
 * A reusable 3D parallax scene with perspective and layered images that respond to scroll.
 * Each instance computes local scroll progress and applies depth-based transforms to layers.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Image layer configuration for the parallax scene.
 */
export interface ParallaxLayerConfig {
  /** Depth factor: higher => moves more on scroll (e.g., 10 = near, 2 = far) */
  depth: number
  /** Image URL (must follow ImageInsertion rules) */
  src: string
  /** Extra Tailwind classes for sizing/positioning */
  className?: string
  /** Optional overlay color via gradient (e.g., 'from-black/40 to-transparent') */
  overlayGradient?: string
  /** Optional initial opacity */
  opacity?: number
}

/**
 * Props for ParallaxScene
 */
export interface ParallaxSceneProps {
  /** Layers rendered as background volumes */
  layers: ParallaxLayerConfig[]
  /** Optional content overlayed in front (e.g., text cards) */
  children?: React.ReactNode
  /** Min height of the section (default: 'min-h-screen') */
  minHClassName?: string
  /** Reduce motion (disables heavy transforms) */
  reduceMotion?: boolean
  /** Accessible section label */
  ariaLabel?: string
}

/**
 * Clamp a number into [min, max].
 */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/**
 * ParallaxScene
 * - Measures local scroll progress for this section (0..1)
 * - Applies translateY based on depth per layer, creating a 3D feel with perspective.
 */
export default function ParallaxScene({
  layers,
  children,
  minHClassName = 'min-h-[120vh]',
  reduceMotion,
  ariaLabel,
}: ParallaxSceneProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    let rafId = 0

    const onFrame = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Progress is how much of the section has traversed the viewport
      const p = clamp((vh - rect.top) / (vh + rect.height), 0, 1)
      setProgress(p)
      rafId = requestAnimationFrame(onFrame)
    }

    rafId = requestAnimationFrame(onFrame)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const layerNodes = useMemo(() => {
    return layers.map((layer, idx) => {
      const depth = layer.depth
      const move = reduceMotion ? 0 : (progress - 0.5) * 2 * depth * 20 // tune parallax strength
      const opacity = layer.opacity ?? 1

      return (
        <div
          key={idx}
          aria-hidden
          className={`absolute inset-0 will-change-transform select-none pointer-events-none`}
          style={{
            transform: `translate3d(0, ${move}px, 0)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={layer.src}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover ${layer.className ?? ''}`}
            style={{ opacity }}
          />
          {layer.overlayGradient ? (
            <div
              className={`absolute inset-0 pointer-events-none bg-gradient-to-b ${layer.overlayGradient}`}
            />
          ) : null}
        </div>
      )
    })
  }, [layers, progress, reduceMotion])

  return (
    <section
      ref={ref}
      aria-label={ariaLabel}
      className={`relative ${minHClassName} overflow-hidden`}
      style={{
        perspective: 1000,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Layers */}
      <div className="absolute inset-0">
        {layerNodes}
      </div>

      {/* Foreground content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle bottom vignette for contrast */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent z-10" />
    </section>
  )
}
