/**
 * usePrefetchImages.ts
 * Prefetches image URLs for upcoming sections to improve perceived performance.
 * - Observes section elements by id with IntersectionObserver.
 * - When a section becomes visible, prefetches images for the next N sections.
 * - Uses requestIdleCallback when available to avoid competing with main work.
 */

import { useEffect, useMemo, useRef } from 'react'

/** A section's id and the image URLs it needs. */
export interface PrefetchSection {
  /** DOM id of the section to observe */
  id: string
  /** Image URLs to prefetch for this section */
  urls: string[]
}

/**
 * Schedules a callback when the browser is idle (fallbacks to setTimeout).
 */
function onIdle(cb: () => void) {
  const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: any) => number)
  if (typeof ric === 'function') {
    ric(cb, { timeout: 1500 })
  } else {
    setTimeout(cb, 0)
  }
}

/**
 * usePrefetchImages
 * - Looks ahead `lookahead` sections from the currently visible one and prefetches their images.
 */
export function usePrefetchImages(sections: PrefetchSection[], lookahead = 2) {
  const orderedIds = useMemo(() => sections.map((s) => s.id), [sections])
  const byId = useMemo(() => {
    const m = new Map<string, PrefetchSection>()
    sections.forEach((s) => m.set(s.id, s))
    return m
  }, [sections])

  const prefetched = useRef<Set<string>>(new Set())
  const imgCache = useRef<Map<string, HTMLImageElement>>(new Map())

  useEffect(() => {
    if (!sections.length) return

    const elements = orderedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    if (!elements.length) return

    const prefetchUrl = (url: string) => {
      if (!url || prefetched.current.has(url)) return
      prefetched.current.add(url)
      onIdle(() => {
        try {
          const img = new Image()
          // Hint: async decode, but <img> doesn't block decode anyway when not in DOM.
          ;(img as any).decoding = 'async'
          // Kick off request
          img.src = url
          imgCache.current.set(url, img)
        } catch {
          // ignore network or construction errors
        }
      })
    }

    const prefetchForIndex = (index: number) => {
      for (let i = 1; i <= lookahead; i++) {
        const next = sections[index + i]
        if (!next) break
        next.urls.forEach(prefetchUrl)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        // Find most visible entry to reduce noise
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (!visible.length) return
        const id = visible[0].target.id
        const idx = orderedIds.indexOf(id)
        if (idx >= 0) prefetchForIndex(idx)
      },
      { threshold: [0.2, 0.5, 0.8] }
    )

    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections, orderedIds, lookahead, byId])
}
