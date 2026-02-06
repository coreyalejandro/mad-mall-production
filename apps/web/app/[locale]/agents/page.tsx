import fs from "node:fs/promises";
import path from "node:path";

type Manifest = {
  source: string;
  imported_at: string;
  items: Array<{ filename: string; path: string }>;
  notes: string[];
};

export default async function AgentsPage() {
  let manifest: Manifest;

  try {
    const manifestPath = path.join(
      process.cwd(),
      "agents",
      "ibm",
      "manifest.json"
    );
    const raw = await fs.readFile(manifestPath, "utf8");
    manifest = JSON.parse(raw) as Manifest;
  } catch {
    manifest = {
      source: "Not configured",
      imported_at: "N/A",
      items: [],
      notes: [
        "Manifest not found. Place agents/ibm/manifest.json in the web app root.",
      ],
    };
  }

  return (
    <article className="min-h-[calc(100vh-4rem)] bg-zinc-950 py-16">
      <div className="mx-auto max-w-7xl px-8">
        <header className="mb-10">
          <p className="text-xs text-zinc-400 tracking-[0.35em]">
            CURRICULUM IMPORT
          </p>
          <h1 className="mt-4 font-light text-4xl text-zinc-50 tracking-[0.25em]">
            AGENTS (IBM)
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-zinc-300 leading-relaxed">
            Imported IBM agent curriculum artifacts. This page is inventory only
            (role mapping + assessment comes next).
          </p>
        </header>

        <section className="border border-zinc-800 bg-zinc-950 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-light text-2xl text-zinc-50 tracking-wide">
                Manifest
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Source: {manifest.source}
              </p>
              <p className="text-sm text-zinc-400">
                Imported: {manifest.imported_at}
              </p>
            </div>
            <div className="text-sm text-zinc-400">
              Count: {manifest.items.length}
            </div>
          </div>

          {manifest.items.length > 0 ? (
            <ul className="mt-6 space-y-2">
              {manifest.items.map((item) => (
                <li
                  className="flex items-center justify-between border-zinc-800 border-b py-2"
                  key={item.path}
                >
                  <span className="text-sm text-zinc-200">{item.filename}</span>
                  <span className="text-xs text-zinc-500">{item.path}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-zinc-400">No items imported yet.</p>
          )}

          <div className="mt-6 border border-zinc-800 p-4">
            <h3 className="font-light text-lg text-zinc-50">Notes</h3>
            <ul className="mt-2 space-y-2 text-sm text-zinc-300">
              {manifest.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </article>
  );
}
