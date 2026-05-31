import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { MoveRight, Heart } from "lucide-react";
import Link from "next/link";

type CTAProps = {
  dictionary: Dictionary;
};

/**
 * CTA — The Concierge Welcome
 *
 * Design: ZMUX concierge panel — dark ink background,
 * vellum text, soul gold accents, monolithic border-radius.
 * Condé Nast editorial CTA with warmth.
 */
export const CTA = ({ dictionary }: CTAProps) => (
  <div className="w-full py-20 lg:py-32">
    <div className="container mx-auto">
      <div
        className="flex flex-col items-center gap-8 rounded-[40px] p-8 text-center lg:p-16"
        style={{
          backgroundColor: '#141414',
          color: '#fcfaf2',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Status pill */}
        <span
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs"
          style={{
            borderColor: 'rgba(252, 250, 242, 0.3)',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <Heart className="h-3 w-3" style={{ color: '#a65d45' }} />
          Welcome to the Sanctuary
        </span>

        <div className="flex flex-col gap-4">
          <h3
            className="max-w-xl text-3xl font-light md:text-5xl"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            {dictionary.web.home.cta.title}
          </h3>
          <p
            className="max-w-xl text-lg leading-relaxed"
            style={{ opacity: 0.6 }}
          >
            {dictionary.web.home.cta.description}
          </p>
        </div>

        <div className="flex flex-row gap-4">
          <Button
            asChild
            className="gap-3 rounded-full px-8 py-6 font-bold uppercase tracking-[0.1em] text-xs"
            style={{
              backgroundColor: '#b38b4d',
              color: '#141414',
              border: 'none',
            }}
          >
            <Link href="/contact">
              {dictionary.web.global.primaryCta}
              <Heart className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            className="gap-3 rounded-full px-8 py-6 font-bold uppercase tracking-[0.1em] text-xs"
            variant="outline"
            style={{
              borderColor: 'rgba(252, 250, 242, 0.3)',
              color: '#fcfaf2',
            }}
          >
            <Link href="#features">
              {dictionary.web.global.secondaryCta}
              <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Non-clinical disclaimer */}
        <p
          className="mt-4 max-w-lg text-xs leading-relaxed"
          style={{
            opacity: 0.4,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          MADMall is a non-clinical wellness community. We do not diagnose,
          treat, or prescribe. This boundary is a constitutional constraint
          enforced at every level.
        </p>
      </div>
    </div>
  </div>
);
