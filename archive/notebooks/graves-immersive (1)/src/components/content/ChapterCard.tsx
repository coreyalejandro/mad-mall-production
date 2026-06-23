/**
 * ChapterCard.tsx
 * High-contrast glass card to display chapter title and paragraphs over the parallax scene.
 * - Integrates in-view haptic feedback safely inside the component to keep hooks order stable.
 */

import React, { forwardRef, useRef } from 'react'
import { useHapticsOnView } from '../haptics/useHapticsOnView'

/** Props for ChapterCard */
export interface ChapterCardProps {
  /** Section anchor id for in-page navigation */
  id?: string
  /** Title at the top of the card */
  title: string
  /** Body paragraphs to render */
  paragraphs: string[]
  /** Optional className for layout overrides */
  className?: string
  /** Enable haptic feedback when the card enters the viewport */
  hapticsEnabled?: boolean
  /** Reduce motion for entrance effects */
  reduceMotion?: boolean
}

/**
 * Utility: merges a forwarded ref and a local ref into the same DOM node.
 * Ensures both refs receive the element reference.
 */
function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((r) => {
      if (!r) return
      if (typeof r === 'function') {
        r(node)
      } else {
        try {
          ;(r as React.MutableRefObject<T | null>).current = node
        } catch {
          // ignore
        }
      }
    })
  }
}

/**
 * ChapterCard
 * - Semi-transparent panel with good readability and accessible contrast.
 * - Triggers optional haptic vibration when the card becomes visible.
 */
const ChapterCard = forwardRef<HTMLDivElement, ChapterCardProps>(function ChapterCard(
  { id, title, paragraphs, className, hapticsEnabled },
  ref
) {
  const localRef = useRef<HTMLDivElement | null>(null)

  // Attach haptic observer to the card root. This keeps hooks order stable across renders.
  useHapticsOnView(localRef, { enabled: !!hapticsEnabled, threshold: 0.6, pattern: [12, 20, 12] })

  return (
    <div
      id={id}
      ref={mergeRefs(ref, localRef)}
      className={`mx-auto max-w-3xl rounded-xl border bg-white/85 dark:bg-black/60 backdrop-blur-md shadow-xl px-6 sm:px-8 py-6 sm:py-8 text-sm sm:text-base leading-relaxed ${className ?? ''}`}
    >
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">{title}</h2>
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-foreground/95">
            {p}
          </p>
        ))}
      </div>
    </div>
  )
})

export default ChapterCard
