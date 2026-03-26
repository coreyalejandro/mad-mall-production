import Link from "next/link";

/**
 * MadmallEntry — The Magazine Spread
 *
 * Condé Nast (luxury editorial) × TV Guide (familiar grid) × Amazon (convenience).
 * ZMUX Vellum Clinical aesthetic: vellum cards, soul gold accents,
 * monolithic border-radius, JetBrains Mono labels.
 *
 * This is the "What You Can Do Right Now" section — the mall directory
 * presented as a luxury magazine table of contents.
 */
export const MadmallEntry = () => (
  <section
    className="w-full py-16"
    style={{ backgroundColor: '#141414' }}
  >
    <div className="container mx-auto px-8">
      {/* Magazine masthead */}
      <header className="mb-12">
        <div className="flex items-center gap-4">
          <span
            className="inline-block rounded-full border px-4 py-1.5 text-xs"
            style={{
              borderColor: 'rgba(252, 250, 242, 0.3)',
              color: '#fcfaf2',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            ● SITE UNDER CONSTRUCTION
          </span>
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{
              color: '#b38b4d',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Ribbon Cut
          </span>
        </div>
        <h2
          className="mt-6 text-4xl font-light uppercase tracking-[0.25em] md:text-5xl"
          style={{
            color: '#fcfaf2',
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
          }}
        >
          MADMall
        </h2>
        <p
          className="mt-4 max-w-3xl text-sm leading-relaxed"
          style={{ color: 'rgba(252, 250, 242, 0.6)' }}
        >
          A virtual luxury outdoor mall + teaching clinic for Black women with
          Graves&apos; disease. The first thing you see is the plan — rendered as
          wall-sized blueprints you can navigate.
        </p>
      </header>

      {/* Magazine grid — TV Guide meets Condé Nast */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Feature card 1 — Plan (large editorial) */}
        <Link
          className="group block rounded-[30px] p-8 transition-all duration-500 hover:-translate-y-1"
          href="/plan"
          style={{
            background: 'rgba(252, 250, 242, 0.05)',
            border: '1px solid rgba(252, 250, 242, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-[0.35em]"
              style={{
                color: 'rgba(252, 250, 242, 0.4)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              Posters
            </span>
            <span
              className="text-xs"
              style={{
                color: 'rgba(252, 250, 242, 0.3)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              Infinite Canvas
            </span>
          </div>
          <h4
            className="mt-4 text-xl font-light uppercase tracking-wide transition-colors duration-500 group-hover:text-[#b38b4d]"
            style={{
              color: '#fcfaf2',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
            }}
          >
            Plan (Interactive)
          </h4>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'rgba(252, 250, 242, 0.4)' }}
          >
            Navigate the ALLINONE plan as a construction-site wall of
            blueprints.
          </p>
          {/* Gold accent line */}
          <div
            className="mt-6 h-0.5 w-12 transition-all duration-500 group-hover:w-full"
            style={{ backgroundColor: '#b38b4d' }}
          />
        </Link>

        {/* Feature card 2 — ML Training */}
        <Link
          className="group block rounded-[30px] p-8 transition-all duration-500 hover:-translate-y-1"
          href="/ml"
          style={{
            background: '#b38b4d',
            color: '#fcfaf2',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-[0.35em]"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              Core
            </span>
            <span
              className="text-xs"
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              Training
            </span>
          </div>
          <h4
            className="mt-4 text-xl font-light uppercase tracking-wide"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            ML Training
          </h4>
          <p className="mt-3 text-sm leading-relaxed opacity-80">
            Byte-size data collection + distributed collection network →
            model training pipeline.
          </p>
          <div
            className="mt-6 h-0.5 w-12 transition-all duration-500 group-hover:w-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
          />
        </Link>

        {/* Feature card 3 — Agents */}
        <Link
          className="group block rounded-[30px] p-8 transition-all duration-500 hover:-translate-y-1"
          href="/agents"
          style={{
            background: 'rgba(252, 250, 242, 0.05)',
            border: '1px solid rgba(252, 250, 242, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-[0.35em]"
              style={{
                color: 'rgba(252, 250, 242, 0.4)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              Inventory
            </span>
            <span
              className="text-xs"
              style={{
                color: 'rgba(252, 250, 242, 0.3)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              IBM
            </span>
          </div>
          <h4
            className="mt-4 text-xl font-light uppercase tracking-wide transition-colors duration-500 group-hover:text-[#b38b4d]"
            style={{
              color: '#fcfaf2',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
            }}
          >
            Agents
          </h4>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'rgba(252, 250, 242, 0.4)' }}
          >
            Imported IBM agent curriculum artifacts (role mapping comes next).
          </p>
          <div
            className="mt-6 h-0.5 w-12 transition-all duration-500 group-hover:w-full"
            style={{ backgroundColor: '#a65d45' }}
          />
        </Link>
      </div>

      {/* Construction notice — non-clinical */}
      <div
        className="mt-8 rounded-[20px] p-6"
        style={{
          background: 'rgba(252, 250, 242, 0.03)',
          border: '1px solid rgba(252, 250, 242, 0.08)',
        }}
      >
        <p
          className="text-xs leading-relaxed"
          style={{
            color: 'rgba(252, 250, 242, 0.4)',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          NOTICE: This is an &quot;under construction&quot; environment. No medical
          advice is provided. No PHI is collected. This repo is building the
          training + governance architecture first.
        </p>
      </div>
    </div>
  </section>
);
