/**
 * ThyroidParallax.tsx
 * Section highlighting "The Thyroid: Tiny Gland, Big Drama" with a parallax medical diagram.
 * Image: uses a provided CDN URL; replace THYROID_IMG if you need to switch assets.
 */

import React, { useEffect, useRef, useState } from 'react'

/** Absolute URL for the thyroid diagram image. */
const THYROID_IMG =
  'https://pub-cdn.sider.ai/u/U0Y3H76Z3L/web-coder/68a396227b28bae49806fe22/resource/0cba0a31-4074-4dff-9699-a52f3a712d49.png'

/**
 * useScrollParallax
 * Small hook that returns a translateY value based on the element's position in viewport.
 */
function useScrollParallax(ref: React.RefObject<HTMLElement>, ratio = 0.15) {
  const [y, setY] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      setY(0)
      return
    }

    const update = () => {
      const rect = el.getBoundingClientRect()
      const offset = rect.top - window.innerHeight / 2
      setY(offset * ratio)
    }
    update()

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref, ratio])

  return y
}

/**
 * ThyroidParallax
 * Renders copy with an overlaid, lightly animated image that moves slower than scroll (parallax).
 */
export default function ThyroidParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const y = useScrollParallax(containerRef, 0.12)

  return (
    <section
      id="thyroid"
      aria-label="The Thyroid: Tiny Gland, Big Drama"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black text-white"
    >
      <div
        ref={containerRef}
        className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2"
      >
        {/* Copy block */}
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">
            The Thyroid: Tiny Gland, Big Drama
          </h2>
          <p className="mt-4 text-white/90 md:text-base">
            In Graves’ disease, antibodies overstimulate the thyroid, causing excess hormone
            production, heat intolerance, and a goiter. The diagram shows the gland and increased
            blood flow in a neutral, clinical style.
          </p>
          <p className="mt-3 text-sm text-white/70">
            Parallax is subtle and respects reduce‑motion preferences.
          </p>
        </div>

        {/* Image with parallax */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl">
            <div className="relative aspect-[4/3] w-full">
              <img
                src={THYROID_IMG}
                alt="Medical diagram of thyroid and goiter with blood flow labels"
                className="absolute inset-0 h-full w-full object-cover will-change-transform"
                style={{ transform: `translateY(${y}px) scale(1.02)` }}
                loading="lazy"
                decoding="async"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/35 via-black/10 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
