/**
 * useHapticsOnView.ts
 * Intersection-based haptic feedback. Vibrates when the element becomes visible.
 */

import { useEffect } from 'react'

/**
 * Triggers a vibration pattern when the target element enters the viewport.
 * - Uses IntersectionObserver with provided threshold.
 * - No vibration on unsupported devices or when disabled.
 */
export function useHapticsOnView(
  ref: React.RefObject<Element | null>,
  opts: {
    enabled: boolean
    threshold?: number
    pattern?: number | number[]
  } = { enabled: false }
) {
  const { enabled, threshold = 0.6, pattern = [20, 40, 20] } = opts

  useEffect(() => {
    if (!ref.current) return
    if (!enabled) return
    if (typeof window === 'undefined') return
    if (!('vibrate' in navigator)) return

    const el = ref.current
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              navigator.vibrate(pattern as number[])
            } catch {
              // ignore
            }
          }
        })
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, enabled, threshold, pattern])
}
