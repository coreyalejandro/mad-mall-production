/**
 * NarrationProgressBar.tsx
 * A minimal floating bar showing narration progress and speaking state.
 */

import React from 'react'
import { Mic } from 'lucide-react'

/** Props for NarrationProgressBar */
export interface NarrationProgressBarProps {
  /** Current utterance index (0-based) */
  index: number
  /** Total utterances in queue */
  total: number
  /** Whether speech is currently ongoing */
  speaking: boolean
}

/**
 * NarrationProgressBar
 * - Renders a compact progress indicator at the top center.
 */
export default function NarrationProgressBar({ index, total, speaking }: NarrationProgressBarProps) {
  if (!total) return null
  const pct = Math.round(((index ?? 0) / total) * 100)

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 rounded-full border bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-1.5 shadow">
        <Mic size={16} className={speaking ? 'text-green-600' : 'text-foreground/60'} />
        <div className="w-40 h-1.5 rounded bg-foreground/10 overflow-hidden">
          <div
            className="h-full bg-foreground/80 transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
            aria-label="Narration progress"
          />
        </div>
        <span className="text-xs tabular-nums">{pct}%</span>
      </div>
    </div>
  )
}
