/**
 * SafeIntro.tsx
 * Neutral, non-human introduction section using a medical-style thyroid diagram.
 * Purpose: replace any portrait/sexualized visuals with respectful, clinical context.
 */

import React from 'react'

/**
 * SafeIntro
 * Renders a calm gradient background, a medical diagram image, and explanatory copy.
 */
export default function SafeIntro() {
  return (
    <section
      aria-label="Graves disease neutral introduction"
      className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-black text-white"
    >
      {/* Background soft vignette for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-2 md:py-20">
        {/* Image: medical diagram only (no people) */}
        <div className="order-2 md:order-1">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl">
            <div className="relative aspect-[4/3] w-full">
              {/* Smart placeholder system — neutral diagram */}
              <img
                src="https://pub-cdn.sider.ai/u/U0Y3H76Z3L/web-coder/68a396227b28bae49806fe22/resource/6a484f69-ad06-48a3-885c-0ec9dffee828.jpg"
                alt="Illustrated thyroid anatomy diagram"
                className="object-cover absolute inset-0 w-full h-full"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/35 via-black/10 to-transparent" />
            </div>
            <div className="p-4 md:p-5">
              <h2 className="text-xl md:text-2xl font-semibold">Graves’ Disease — Neutral Overview</h2>
              <p className="mt-2 text-sm md:text-base text-white/90">
                This project explains what happens in Graves’ disease using respectful, clinical visuals only.
                No portraits. No suggestive imagery. High‑contrast text for readability.
              </p>
            </div>
          </div>
        </div>

        {/* Copy block */}
        <div className="order-1 md:order-2 flex items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Inside the Body with Graves’ Disease
            </h1>
            <p className="mt-4 text-white/90 md:text-lg">
              A concise, compassionate explanation with medical diagrams. Motion and audio are disabled here for comfort.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#learn-more"
                className="inline-flex items-center rounded-md bg-white/90 px-5 py-2.5 text-sm font-medium text-gray-900 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80"
              >
                Learn more
              </a>
              <span className="text-xs text-white/70">
                Images shown are illustrative diagrams, not real people.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Anchor target for Learn more */}
      <div id="learn-more" className="sr-only">Learn more</div>
    </section>
  )
}
