import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { Eye, MoveRight } from "lucide-react";
import Link from "next/link";

type HeroProps = {
  dictionary: Dictionary;
};

/**
 * MADMall Hero — The Sanctuary
 *
 * Design language: ZMUX_MAD_MALL.html (Vellum Clinical)
 * Aesthetic: Condé Nast luxury meets TV Guide familiarity
 * - Vellum background with diffusion blur
 * - Space Grotesk uppercase headings
 * - JetBrains Mono status labels
 * - Soul gold + terracotta accents
 * - Non-clinical disclaimer always visible
 */
export const Hero = ({ dictionary }: HeroProps) => (
  <div className="relative w-full overflow-hidden">
    {/* Vellum diffusion layer */}
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(179, 139, 77, 0.08), transparent),
          radial-gradient(circle at 80% 70%, rgba(75, 106, 109, 0.06), transparent)
        `,
      }}
    />

    <div className="container relative z-10 mx-auto">
      <div className="flex flex-col gap-8 py-20 lg:py-32">
        {/* Construction status bar */}
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.3em]"
            style={{
              borderColor: 'rgba(179, 139, 77, 0.4)',
              color: '#b38b4d',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: '#b38b4d' }}
            />
            {dictionary.web.home.hero.announcement}
          </span>
        </div>

        {/* Main headline — ZMUX style */}
        <div className="flex flex-col gap-2">
          <p
            className="text-sm uppercase tracking-[0.3em]"
            style={{
              color: '#a65d45',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Home Away From Home
          </p>
          <h1
            className="max-w-4xl text-5xl font-bold uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl"
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              color: '#141414',
              mixBlendMode: 'multiply',
            }}
          >
            The
            <br />
            Sanctuary
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="max-w-2xl text-lg leading-relaxed opacity-70"
          style={{ fontSize: '1.1rem' }}
        >
          {dictionary.web.home.meta.description}
        </p>

        {/* CTA row */}
        <div className="flex flex-row gap-3">
          <Button
            asChild
            className="gap-3 rounded-full border-none px-8 py-6 font-bold uppercase tracking-[0.1em] text-xs"
            size="lg"
            style={{
              backgroundColor: '#141414',
              color: '#fcfaf2',
            }}
          >
            <Link href="/contact">
              {dictionary.web.global.primaryCta}
              <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            className="gap-3 rounded-full px-8 py-6 font-bold uppercase tracking-[0.1em] text-xs"
            size="lg"
            variant="outline"
            style={{
              borderColor: 'rgba(20, 20, 20, 0.3)',
              color: '#141414',
            }}
          >
            <Link href="#features">
              <Eye className="h-4 w-4" />
              {dictionary.web.global.secondaryCta}
            </Link>
          </Button>
        </div>

        {/* Caution stripe divider */}
        <div
          className="mt-4 h-1 w-full max-w-md"
          style={{
            background: 'repeating-linear-gradient(45deg, #FFD700, #FFD700 10px, #1a1a1a 10px, #1a1a1a 20px)',
          }}
        />
      </div>
    </div>
  </div>
);
