/**
 * Hero.tsx
 * Full-bleed hero with sky background, blended Black woman portrait, and subtle motion.
 * Includes a "Reduce motion" toggle to disable animations for sensitive users.
 */

import React, { useMemo, useState } from 'react'

/**
 * Props for the Hero component.
 */
export interface HeroProps {
  /** Initial reduce-motion preference; animations are disabled when true. */
  defaultReduceMotion?: boolean
}

/**
 * Hero component
 * Renders a high-contrast, borderless composition:
 * - Moving sky background (very subtle).
 * - Black woman portrait with a soft edge mask to blend into the sky.
 * - Transparent, floating headline and CTAs.
 */
const Hero: React.FC<HeroProps> = ({ defaultReduceMotion = false }) => {
  const [reduceMotion, setReduceMotion] = useState<boolean>(defaultReduceMotion)

  // Inline keyframes to avoid editing Tailwind config; kept minimal and subtle.
  const styles = useMemo(
    () => ({
      keyframes: `
      @keyframes cloudDrift {
        0%   { transform: translateX(0px) }
        100% { transform: translateX(-80px) }
      }
      @keyframes float {
        0%   { transform: translateY(0px) }
        50%  { transform: translateY(-6px) }
        100% { transform: translateY(0px) }
      }
    `,
    }),
    []
  )

  return (
    <section className="relative isolate h-[90vh] min-h-[560px] w-full overflow-hidden rounded-none">
      {/* Local style tag for keyframes */}
      <style>{styles.keyframes}</style>

      {/* Background sky with very subtle horizontal drift */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://pub-cdn.sider.ai/u/U0Y3H76Z3L/web-coder/68a396227b28bae49806fe22/resource/16422d4e-1702-48e4-8061-f519ffd80592.jpg"
          alt="Sky with soft clouds"
          className="h-full w-full object-cover"
          style={{
            animation: reduceMotion ? 'none' : 'cloudDrift 60s linear infinite',
            opacity: 0.9,
            filter: 'saturate(1.05) contrast(1.05)',
          }}
        />
        {/* Gradient overlay to guarantee contrast for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      </div>

      {/* Foreground portrait with edge fade, gently floating */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 flex items-end justify-center"
        aria-hidden
      >
        <img
          src="https://pub-cdn.sider.ai/u/U0Y3H76Z3L/web-coder/68a396227b28bae49806fe22/resource/75f01a0c-2949-437d-b321-5bd318f05a95.jpg"
          alt=""
          className="h-[70%] max-h-[720px] w-auto object-cover drop-shadow-xl"
          style={{
            WebkitMaskImage:
              'radial-gradient(120% 100% at 50% 80%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
            maskImage:
              'radial-gradient(120% 100% at 50% 80%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
            animation: reduceMotion ? 'none' : 'float 10s ease-in-out infinite',
            opacity: 0.96,
          }}
        />
      </div>

      {/* Copy block */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 sm:px-8">
        <div className="max-w-3xl">
          <h1
            className="text-balance font-semibold leading-tight text-white sm:text-6xl text-4xl"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}
          >
            Inside a Black Woman&apos;s Body with Graves’ Disease
          </h1>
          <p
            className="mt-4 max-w-2xl text-white/90 sm:text-lg"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
          >
            A guided, compassionate tour through your body — with optional narration and gentle motion.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-md bg-white/90 px-5 py-2.5 text-sm font-medium text-gray-900 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              Start the tour
            </button>

            <button
              type="button"
              onClick={() => setReduceMotion((v) => !v)}
              className="rounded-md bg-black/40 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/25 hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-pressed={reduceMotion}
            >
              {reduceMotion ? 'Enable motion' : 'Reduce motion'}
            </button>
          </div>

          {/* Small status row */}
          <div className="mt-3 text-xs text-white/80">
            Motion is {reduceMotion ? 'off' : 'on'}. Images are artistic placeholders.
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
