/**
 * BackToTop.tsx
 * Small button to scroll to the top smoothly.
 */

import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > 600)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!shown) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-1 rounded-full border bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-2 shadow hover:bg-accent"
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={16} />
      <span className="text-sm">Top</span>
    </button>
  )
}
