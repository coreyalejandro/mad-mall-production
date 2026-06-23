/**
 * useLocalStorage.ts
 * Small hook to persist a stateful value in localStorage with a key.
 */

import { useCallback, useEffect, useState } from 'react'

/**
 * Safely parses a JSON value, returning fallback if invalid.
 */
function safeParse<T>(raw: string | null, fallback: T): T {
  if (raw == null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/**
 * useLocalStorage
 * - Mirrors a state value into localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    return safeParse<T>(window.localStorage.getItem(key), initialValue)
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota/availability errors
    }
  }, [key, value])

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === 'function' ? (next as (p: T) => T)(prev) : next))
  }, [])

  return [value, update] as const
}
