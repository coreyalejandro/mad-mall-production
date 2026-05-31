/**
 * useHotkeys.ts
 * Global keyboard shortcuts with cleanup.
 */

import { useEffect } from 'react'

/**
 * useHotkeys
 * - Pass a map of key -> handler.
 * - Handlers receive the KeyboardEvent.
 */
export function useHotkeys(map: Record<string, (e: KeyboardEvent) => void>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const handler = map[key]
      if (handler) {
        handler(e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [map])
}
