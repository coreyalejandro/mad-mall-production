/**
 * StickyToc.tsx
 * Floating mini table-of-contents listing chapters and highlighting current section in view.
 */

import React, { useEffect, useMemo, useState } from 'react'

export interface TocItem {
  id: string
  title: string
}

/** Props for StickyToc */
export interface StickyTocProps {
  items: TocItem[]
}

/**
 * StickyToc
 * - Uses IntersectionObserver to highlight current section id.
 */
export default function StickyToc({ items }: StickyTocProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')

  const ids = useMemo(() => items.map((i) => i.id), [items])

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (!sections.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      { threshold: [0.2, 0.5, 0.8] }
    )

    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [ids])

  if (!items.length) return null

  return (
    <nav
      aria-label="In-page navigation"
      className="hidden lg:block fixed top-24 right-4 z-40 w-60 rounded-xl border bg-white/80 dark:bg-black/60 backdrop-blur shadow"
    >
      <ul className="p-3 space-y-1">
        {items.map((it) => {
          const isActive = it.id === active
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`block rounded px-2 py-1.5 text-sm transition ${
                  isActive ? 'bg-accent text-foreground' : 'hover:bg-accent/50'
                }`}
              >
                {it.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
