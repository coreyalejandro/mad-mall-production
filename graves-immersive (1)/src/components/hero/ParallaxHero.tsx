/**
 * ParallaxHero.tsx
 * Full-bleed parallax hero with sky background and a softly blended portrait layer.
 * Text appears directly over the scene (no opaque banner). Motion respects reduced-motion.
 */

import React from 'react'

/**
 * ParallaxHero
 * Renders a sky background with a blended portrait edge-fade and floating motion.
 * Notes:
 * - Uses background-attachment: fixed for simple parallax on the sky layer.
 * - Portrait has a radial mask to avoid hard borders ("blended into the sky").
 * - Motion effects are reduced automatically if the user prefers reduced motion.
 */
export default function ParallaxHero() {
  return (
    <section
      aria-label="Hero introduction"
      className="relative min-h-[80vh] w-full overflow-hidden text-white"
    >
      {/* Sky background parallax */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: 'url(https://sider.ai/autoimage/clouds sky)',
          filter: 'saturate(1.05) brightness(0.9)',
        }}
      />

      {/* Soft vignette for readability */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
      />

      {/* Blended portrait layer (edge fade, subtle motion) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://pub-cdn.sider.ai/u/U0Y3H76Z3L/web-coder/68a396227b28bae49806fe22/resource/8392b18e-6eed-4a15-8b0e-8c557826a8de.jpg"
          alt=""
          aria-hidden
          className="absolute right-0 top-1/2 h-[110%] w-auto -translate-y-1/2 object-cover opacity-70 will-change-transform"
          style={{
            maskImage:
              'radial-gradient(70% 60% at 60% 50%, rgba(0,0,0,0.98) 60%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'radial-gradient(70% 60% at 60% 50%, rgba(0,0,0,0.98) 60%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%)',
            animation: 'heroFloat 18s ease-in-out infinite',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-5xl flex-col gap-4 px-6 py-20 md:py-28">
        <h1 className="text-3xl font-semibold leading-tight drop-shadow md:text-5xl">
          Inside a Black Woman&apos;s Body with Graves’ Disease
        </h1>
        <p className="max-w-2xl text-white/90 md:text-lg">
          A guided, compassionate tour. Parallax visuals are gentle and respect motion
          preferences. No frames; text floats in the sky.
        </p>
        <div className="mt-4 flex gap-3">
          <a
            href="#thyroid"
            className="inline-flex items-center rounded-md bg-white/90 px-5 py-2.5 text-sm font-medium text-gray-900 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            Start the tour
          </a>
          <span className="self-center text-xs text-white/80">
            Tip: enable Reduce Motion in system settings to minimize effects.
          </span>
        </div>
      </div>

      {/* Component-scoped styles for subtle float and reduced motion */}
      <style>
        {`
        @keyframes heroFloat {
          0% { transform: translateY(-50%) translateX(0px) scale(1.02); }
          50% { transform: translateY(calc(-50% - 8px)) translateX(-6px) scale(1.02); }
          100% { transform: translateY(-50%) translateX(0px) scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          img[aria-hidden="true"] { animation: none !important; }
        }
      `}
      </style>
    </section>
  )
}
