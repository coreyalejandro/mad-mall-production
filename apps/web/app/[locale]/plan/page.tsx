"use client";

import { getToneClass, type PlanBoard, usePlanPage } from "./use-plan-page";

export default function PlanPage() {
  const {
    boards,
    containerRef,
    error,
    listView,
    transformStyle,
    selected,
    selectedDoc,
    setListView,
    setSelected,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    resetView,
  } = usePlanPage();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-400 tracking-[0.35em]">
              CONSTRUCTION SITE
            </p>
            <h1 className="mt-2 font-light text-3xl text-zinc-50 tracking-[0.25em]">
              PLAN
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Infinite canvas. Click a poster to read the corresponding plan
              section.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 tracking-wide hover:border-zinc-500"
              onClick={() => setListView((v) => !v)}
              type="button"
            >
              {listView ? "Canvas view" : "List view"}
            </button>
            <button
              className="border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 tracking-wide hover:border-zinc-500"
              onClick={resetView}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        {error ? <p className="mt-6 text-red-300 text-sm">{error}</p> : null}

        {listView ? (
          <ListSection boards={boards} onSelect={setSelected} />
        ) : (
          <CanvasSection
            boards={boards}
            containerRef={containerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onSelect={setSelected}
            onWheel={onWheel}
            selected={selected}
            transformStyle={transformStyle}
          />
        )}

        {selected ? (
          <DocSection
            onClose={() => setSelected(null)}
            selected={selected}
            selectedDoc={selectedDoc}
          />
        ) : null}
      </div>
    </div>
  );
}

function ListSection({
  boards,
  onSelect,
}: {
  boards: PlanBoard[];
  onSelect: (b: PlanBoard) => void;
}) {
  return (
    <section className="mt-8">
      <div className="grid gap-4 md:grid-cols-2">
        {boards.map((b) => (
          <button
            className="border border-zinc-800 bg-zinc-950 p-4 text-left hover:border-zinc-500"
            key={b.id}
            onClick={() => onSelect(b)}
            type="button"
          >
            <h2 className="font-light text-lg text-zinc-50">{b.title}</h2>
            <p className="text-sm text-zinc-400">{b.subtitle}</p>
            <p className="mt-2 text-xs text-zinc-500">{b.doc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function CanvasSection({
  boards,
  containerRef,
  selected,
  transformStyle,
  onSelect,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
}: {
  boards: PlanBoard[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  selected: PlanBoard | null;
  transformStyle: { transform: string };
  onSelect: (b: PlanBoard) => void;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
}) {
  return (
    <section
      className="madmall-grid mt-8 border border-zinc-800 bg-zinc-950"
      style={{ height: "70vh" }}
    >
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden"
        onPointerCancel={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        role="application"
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={transformStyle}
        >
          {boards.map((b) => (
            <BoardPoster
              board={b}
              isSelected={selected?.id === b.id}
              key={b.id}
              onSelect={() => onSelect(b)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BoardPoster({
  board: b,
  isSelected,
  onSelect,
}: {
  board: PlanBoard;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const toneClass = getToneClass(b.tone);
  const borderClass = isSelected ? "border-zinc-200" : "border-zinc-700";
  return (
    <button
      className={`absolute border bg-zinc-950 p-6 text-left transition-colors hover:border-zinc-400 ${borderClass} ${toneClass}`}
      onClick={onSelect}
      style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
      type="button"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400 tracking-[0.35em]">POSTER</span>
        <span className="text-[11px] text-zinc-500">{b.id}</span>
      </div>
      <h2 className="mt-3 font-light text-xl text-zinc-50 tracking-wide">
        {b.title}
      </h2>
      <p className="mt-2 text-sm text-zinc-300">{b.subtitle}</p>
      <p className="mt-4 text-xs text-zinc-500">Click to open</p>
    </button>
  );
}

function DocSection({
  selected,
  selectedDoc,
  onClose,
}: {
  selected: PlanBoard;
  selectedDoc: string;
  onClose: () => void;
}) {
  return (
    <section className="mt-8 border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-light text-xl text-zinc-50">{selected.title}</h2>
          <p className="text-sm text-zinc-400">{selected.doc}</p>
        </div>
        <button
          className="border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 tracking-wide hover:border-zinc-500"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap text-sm text-zinc-200">
        {selectedDoc || "Loading…"}
      </pre>
    </section>
  );
}
