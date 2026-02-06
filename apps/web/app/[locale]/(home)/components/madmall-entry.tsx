import Link from "next/link";

export const MadmallEntry = () => (
  <section className="w-full bg-zinc-950 py-16">
    <div className="container mx-auto px-8">
      <header className="mb-10">
        <p className="text-xs text-zinc-400 tracking-[0.35em]">
          RIBBON CUT • SITE UNDER CONSTRUCTION
        </p>
        <h2 className="mt-4 font-light text-4xl text-zinc-50 tracking-[0.25em]">
          MADMall
        </h2>
        <p className="mt-4 max-w-3xl text-sm text-zinc-300 leading-relaxed">
          A virtual luxury outdoor mall + teaching clinic for Black women with
          Graves' disease. This interface intentionally looks like a
          construction site: the first thing you see is the plan, rendered as
          wall-sized "posters" you can navigate on an infinite canvas.
        </p>
      </header>

      <div className="madmall-grid border border-zinc-800 p-8">
        <h3 className="font-light text-2xl text-zinc-50 tracking-wide">
          What You Can Do Right Now
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Link
            className="block border border-zinc-700 bg-zinc-950 p-6 transition-colors hover:border-zinc-500"
            href="/plan"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 tracking-[0.35em]">
                POSTERS
              </span>
              <span className="text-xs text-zinc-500">INFINITE CANVAS</span>
            </div>
            <h4 className="mt-3 font-light text-lg text-zinc-50 tracking-wide">
              Plan (Interactive)
            </h4>
            <p className="mt-2 text-sm text-zinc-400">
              Navigate the ALLINONE plan as a construction-site wall of
              blueprints.
            </p>
          </Link>

          <Link
            className="block border border-zinc-700 bg-zinc-950 p-6 transition-colors hover:border-zinc-500"
            href="/ml"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 tracking-[0.35em]">
                CORE
              </span>
              <span className="text-xs text-zinc-500">TRAINING</span>
            </div>
            <h4 className="mt-3 font-light text-lg text-zinc-50 tracking-wide">
              ML Training
            </h4>
            <p className="mt-2 text-sm text-zinc-400">
              Byte-size data collection + distributed collection network → model
              training pipeline.
            </p>
          </Link>

          <Link
            className="block border border-zinc-700 bg-zinc-950 p-6 transition-colors hover:border-zinc-500"
            href="/agents"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 tracking-[0.35em]">
                INVENTORY
              </span>
              <span className="text-xs text-zinc-500">IBM</span>
            </div>
            <h4 className="mt-3 font-light text-lg text-zinc-50 tracking-wide">
              Agents
            </h4>
            <p className="mt-2 text-sm text-zinc-400">
              Imported IBM agent curriculum artifacts (role mapping comes next).
            </p>
          </Link>
        </div>

        <div className="madmall-caution mt-8 border border-zinc-700 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-300 leading-relaxed">
            NOTICE: This is an "under construction" environment. No medical
            advice is provided. No PHI is collected. This repo is building the
            training + governance architecture first.
          </p>
        </div>
      </div>
    </div>
  </section>
);
