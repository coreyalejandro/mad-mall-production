"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type BoardTone = "grid" | "caution" | "none";

export type PlanBoard = {
  id: string;
  title: string;
  subtitle: string;
  doc: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: BoardTone;
};

type BoardsFile = {
  schema: string;
  canvas?: { initial?: { x?: number; y?: number; scale?: number } };
  boards: PlanBoard[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getBounds(boards: PlanBoard[]) {
  if (boards.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const b of boards) {
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.w);
    maxY = Math.max(maxY, b.y + b.h);
  }
  return { minX, minY, maxX, maxY };
}

export function getToneClass(tone: BoardTone | undefined): string {
  if (tone === "caution") {
    return "madmall-caution";
  }
  if (tone === "grid") {
    return "madmall-grid";
  }
  return "";
}

async function fetchBoards(
  setBoardsFile: (f: BoardsFile | null) => void,
  setError: (e: string | null) => void,
  setOffset: (o: { x: number; y: number }) => void,
  setScale: (s: number) => void
): Promise<void> {
  try {
    const res = await fetch("/api/content?doc=plan/boards.json");
    if (!res.ok) {
      throw new Error("Failed to load boards config");
    }
    const json = (await res.json()) as { content?: string };
    if (!json.content) {
      throw new Error("Missing boards config");
    }
    const parsed = JSON.parse(json.content) as BoardsFile;
    setBoardsFile(parsed);
    const initial = parsed.canvas?.initial;
    setOffset({ x: initial?.x ?? -200, y: initial?.y ?? -150 });
    setScale(initial?.scale ?? 1);
  } catch (e) {
    setError(e instanceof Error ? e.message : "Unknown error");
  }
}

async function fetchDocForBoard(
  doc: string,
  setSelectedDoc: (s: string) => void
): Promise<void> {
  setSelectedDoc("");
  const res = await fetch(`/api/content?doc=${encodeURIComponent(doc)}`);
  if (!res.ok) {
    setSelectedDoc("Doc not found.");
    return;
  }
  const json = (await res.json()) as { content?: string };
  setSelectedDoc(json.content ?? "Doc not found.");
}

export function usePlanPage() {
  const [boardsFile, setBoardsFile] = useState<BoardsFile | null>(null);
  const [selected, setSelected] = useState<PlanBoard | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [listView, setListView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panStart = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);

  useEffect(() => {
    fetchBoards(setBoardsFile, setError, setOffset, setScale);
  }, []);

  useEffect(() => {
    if (!selected) {
      return;
    }
    fetchDocForBoard(selected.doc, setSelectedDoc);
  }, [selected]);

  const boards = boardsFile?.boards ?? [];

  const transformStyle = useMemo(
    () => ({
      transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
    }),
    [offset.x, offset.y, scale]
  );

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const delta = -event.deltaY;
    const factor = delta > 0 ? 1.07 : 0.93;

    // Get cursor position in viewport coordinates
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportX = event.clientX - rect.left;
    const viewportY = event.clientY - rect.top;

    // Calculate new scale (clamped before offset calculation)
    const newScale = clamp(scale * factor, 0.4, 2.2);
    const scaleRatio = newScale / scale;

    // Apply cursor-centered zoom formula
    setOffset({
      x: viewportX - (viewportX - offset.x) * scaleRatio,
      y: viewportY - (viewportY - offset.y) * scaleRatio,
    });
    setScale(newScale);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }
    setIsPanning(true);
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
    panStart.current = {
      x: event.clientX,
      y: event.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isPanning) {
      return;
    }
    if (!panStart.current) {
      return;
    }
    const dx = event.clientX - panStart.current.x;
    const dy = event.clientY - panStart.current.y;
    setOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
  }

  function onPointerUp() {
    setIsPanning(false);
    panStart.current = null;
  }

  function resetView() {
    if (boards.length === 0) {
      setOffset({ x: 0, y: 0 });
      setScale(1);
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      setOffset({ x: 0, y: 0 });
      setScale(1);
      return;
    }

    const { minX, minY, maxX, maxY } = getBounds(boards);
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // 40px padding on each side
    const padding = 80;
    const scaleX = (rect.width - padding) / contentWidth;
    const scaleY = (rect.height - padding) / contentHeight;
    const fitScale = Math.min(scaleX, scaleY, 1);

    // Center the content
    const x = rect.width / 2 - (minX + contentWidth / 2) * fitScale;
    const y = rect.height / 2 - (minY + contentHeight / 2) * fitScale;

    setOffset({ x, y });
    setScale(fitScale);
  }

  return {
    boards,
    containerRef,
    error,
    listView,
    offset,
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
  };
}
