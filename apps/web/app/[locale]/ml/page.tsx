import Link from "next/link";

export default function MlPage() {
  return (
    <article className="min-h-[calc(100vh-4rem)] bg-zinc-950 py-16">
      <div className="mx-auto max-w-7xl px-8">
        <header className="mb-10">
          <p className="text-xs text-zinc-400 tracking-[0.35em]">
            CORE COMPONENT
          </p>
          <h1 className="mt-4 font-light text-4xl text-zinc-50 tracking-[0.25em]">
            ML TRAINING
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-zinc-300 leading-relaxed">
            MADMall's ML work starts with a training pipeline that can ingest
            byte-size events, validate consent/scope, produce reproducible
            training runs, and emit receipts.
          </p>
        </header>

        <section className="border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="font-light text-2xl text-zinc-50 tracking-wide">
            Two core ideas
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="border border-zinc-800 p-6">
              <h3 className="font-light text-lg text-zinc-50">
                Byte-size collection
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Micro-events throughout the year reduce burden and increase
                signal density.
              </p>
            </div>
            <div className="border border-zinc-800 p-6">
              <h3 className="font-light text-lg text-zinc-50">
                Distributed collection network
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Partner nodes (pharmacies, events, mobile units, mail kits) meet
                people where they already are.
              </p>
            </div>
          </div>

          <div className="mt-8 border border-zinc-800 p-6">
            <h3 className="font-light text-lg text-zinc-50">
              Next implementation steps
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>Define the event schema + consent scope contract.</li>
              <li>Implement ingestion + dataset manifests.</li>
              <li>
                Implement a baseline training runner that fails closed without
                labels.
              </li>
              <li>
                Emit receipts for every run (inputs, hashes, metrics, model
                artifact).
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              className="inline-block border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 tracking-wide hover:border-zinc-500"
              href="/plan"
            >
              Open plan canvas
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
