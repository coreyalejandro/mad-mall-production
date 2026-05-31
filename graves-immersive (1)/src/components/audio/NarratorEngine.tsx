/**
 * NarratorEngine.tsx
 * Browser TTS narration of provided text segments, with chunking and controls (play/pause/stop).
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'

export interface NarratorEngineProps {
  enabled: boolean
  /** Array of strings to narrate in order */
  segments: string[]
  /** Speech rate (0.5..2) */
  rate?: number
  /** Speech pitch (0..2) */
  pitch?: number
  /** Language code, e.g., 'en-US' */
  lang?: string
  /** Optional voice URI or name to select a specific voice */
  voiceURI?: string
  voiceName?: string
  /** Callback with current segment index and total */
  onProgress?: (index: number, total: number) => void
  /** Speaking state callback for ducking, etc. */
  onSpeakingChange?: (speaking: boolean) => void
}

/**
 * Breaks long text into safe speech chunks.
 */
function chunkText(text: string, maxLen = 1500): string[] {
  if (text.length <= maxLen) return [text]
  // Prefer splitting on sentence boundaries.
  const sentences = text.match(/[^.!?]+[.!?]+|\s*\S+$/g) || [text]
  const chunks: string[] = []
  let buf = ''
  for (const s of sentences) {
    if ((buf + s).length > maxLen) {
      if (buf) chunks.push(buf.trim())
      if (s.length > maxLen) {
        // Very long sentence: split hard
        for (let i = 0; i < s.length; i += maxLen) {
          chunks.push(s.slice(i, i + maxLen))
        }
        buf = ''
      } else {
        buf = s
      }
    } else {
      buf += s
    }
  }
  if (buf.trim()) chunks.push(buf.trim())
  return chunks
}

/**
 * NarratorEngine
 * - When enabled becomes true, speaks all segments sequentially.
 * - When enabled becomes false, cancels.
 */
export default function NarratorEngine({
  enabled,
  segments,
  rate = 1,
  pitch = 1,
  lang = 'en-US',
  voiceURI,
  voiceName,
  onProgress,
  onSpeakingChange,
}: NarratorEngineProps) {
  const [current, setCurrent] = useState(0)
  const queueRef = useRef<SpeechSynthesisUtterance[] | null>(null)
  const speakingRef = useRef(false)

  const preparedQueue = useMemo(() => {
    // Prepare utterances with chunking
    const list: SpeechSynthesisUtterance[] = []
    const voices = typeof window !== 'undefined' ? window.speechSynthesis.getVoices?.() ?? [] : []
    const sel =
      (voiceURI && voices.find((v) => v.voiceURI === voiceURI)) ||
      (voiceName && voices.find((v) => v.name === voiceName)) ||
      null

    segments.forEach((seg) => {
      const chunks = chunkText(seg)
      chunks.forEach((c) => {
        const u = new SpeechSynthesisUtterance(c)
        u.rate = rate
        u.pitch = pitch
        u.lang = lang
        if (sel) u.voice = sel
        list.push(u)
      })
    })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, rate, pitch, lang, voiceURI, voiceName])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Cancel any ongoing speech when dis/enabling
    window.speechSynthesis.cancel()
    speakingRef.current = false
    setCurrent(0)

    if (!enabled) return

    queueRef.current = preparedQueue
    if (!queueRef.current.length) return

    // Chain utterances
    let index = 0
    const total = queueRef.current.length
    const speakNext = () => {
      const u = queueRef.current![index]
      u.onend = () => {
        index++
        setCurrent(index)
        onProgress?.(index, total)
        if (index < total) {
          window.speechSynthesis.speak(queueRef.current![index])
        } else {
          speakingRef.current = false
        }
      }
      speakingRef.current = true
      onProgress?.(index, total)
      window.speechSynthesis.speak(u)
    }

    speakNext()
    return () => {
      window.speechSynthesis.cancel()
      speakingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, preparedQueue])

  // Keep rate/pitch responsive by cancelling and restarting if user changes them during playback.
  useEffect(() => {
    if (!enabled) return
    // Soft restart: re-trigger effect by toggling enabled externally is simpler.
  }, [rate, pitch])

  return null
}
