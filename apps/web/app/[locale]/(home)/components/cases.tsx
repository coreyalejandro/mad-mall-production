import type { Dictionary } from "@repo/internationalization";
import {
  Shield,
  Scale,
  Target,
  Users,
  RefreshCw,
} from "lucide-react";

type CasesProps = {
  dictionary: Dictionary;
};

/**
 * Cases — The Living Constitution Articles
 *
 * Replaces generic logo carousel with 5 governance pillars.
 * Design: ZMUX viz-card style with monolithic shadows.
 * Layout: Magazine editorial — large type, asymmetric grid.
 */

const articles = [
  {
    number: "I",
    title: "Bill of Rights",
    description: "Safety, accessibility, dignity, clarity, and truth — your non-negotiable rights.",
    icon: Shield,
    accent: "#b38b4d",
  },
  {
    number: "II",
    title: "Execution Law",
    description: "Immutable code. Honest status. No shortcuts. No mutation.",
    icon: Scale,
    accent: "#a65d45",
  },
  {
    number: "III",
    title: "Purpose Law",
    description: "Every feature traces to a theory of change. No work without purpose.",
    icon: Target,
    accent: "#4b6a6d",
  },
  {
    number: "IV",
    title: "Separation of Powers",
    description: "Agents have boundaries. Humans approve what matters.",
    icon: Users,
    accent: "#b38b4d",
  },
  {
    number: "V",
    title: "Amendment Process",
    description: "The Constitution is alive. It learns from mistakes.",
    icon: RefreshCw,
    accent: "#a65d45",
  },
];

export const Cases = ({ dictionary }: CasesProps) => (
  <div className="w-full py-20 lg:py-32">
    <div className="container mx-auto">
      <div className="flex flex-col gap-12">
        {/* Editorial heading */}
        <div className="flex flex-col gap-2">
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{
              color: '#a65d45',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Governance
          </p>
          <h2
            className="max-w-xl text-left text-3xl font-bold uppercase tracking-tight md:text-5xl"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            {dictionary.web.home.cases.title}
          </h2>
        </div>

        {/* Article cards — magazine grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {articles.map((article) => (
            <div
              className="group relative flex flex-col justify-between rounded-[30px] p-6 transition-all duration-500 hover:-translate-y-1"
              key={article.number}
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '20px 20px 60px rgba(0, 0, 0, 0.08), -10px -10px 40px rgba(255, 255, 255, 0.8)',
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="font-mono text-xs uppercase tracking-[0.3em] opacity-60"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  Article {article.number}
                </span>
                <article.icon
                  className="h-5 w-5"
                  style={{ color: article.accent }}
                />
              </div>
              <div>
                <h3
                  className="text-lg font-bold uppercase tracking-tight"
                  style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                >
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed opacity-60">
                  {article.description}
                </p>
              </div>
              {/* Gold accent line */}
              <div
                className="mt-4 h-0.5 w-12 transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: article.accent }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
