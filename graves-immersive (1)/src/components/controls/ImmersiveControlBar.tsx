/**
 * ImmersiveControlBar.tsx
 * Floating control bar for Ambient audio, Narration, Haptics, Reduce Motion, Volume and Speech Rate.
 */

import React from 'react'
import { Volume2, VolumeX, Waves, Mic, MicOff, Vibrate, Accessibility, Pause, Play, Square } from 'lucide-react'

/** Props for the control bar */
export interface ImmersiveControlBarProps {
  ambientEnabled: boolean
  onToggleAmbient: () => void
  narrationEnabled: boolean
  onToggleNarration: () => void
  onPlayNarration: () => void
  onPauseNarration: () => void
  onStopNarration: () => void
  volume: number
  onVolumeChange: (v: number) => void
  speakRate: number
  onSpeakRateChange: (v: number) => void
  hapticsEnabled: boolean
  onToggleHaptics: () => void
  reduceMotion: boolean
  onToggleReduceMotion: () => void
}

/**
 * ImmersiveControlBar
 * - Compact, keyboard accessible, high-contrast control surface.
 */
export default function ImmersiveControlBar({
  ambientEnabled,
  onToggleAmbient,
  narrationEnabled,
  onToggleNarration,
  onPlayNarration,
  onPauseNarration,
  onStopNarration,
  volume,
  onVolumeChange,
  speakRate,
  onSpeakRateChange,
  hapticsEnabled,
  onToggleHaptics,
  reduceMotion,
  onToggleReduceMotion,
  voices = [],
  selectedVoiceURI,
  onSelectVoice,
  lang,
  onLangChange,
}: ImmersiveControlBarProps) {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(100%,900px)] px-3"
      role="region"
      aria-label="Immersive controls"
    >
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border bg-white/90 dark:bg-black/70 backdrop-blur-md shadow-2xl px-3 sm:px-4 py-3">
        {/* Audio group */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-accent/40 transition ${
              ambientEnabled ? 'bg-accent' : ''
            }`}
            onClick={onToggleAmbient}
            aria-pressed={ambientEnabled}
            title="Toggle ambient surround"
          >
            <Waves size={18} />
            <span className="hidden sm:inline">Ambient</span>
          </button>

          <button
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-accent/40 transition ${
              narrationEnabled ? 'bg-accent' : ''
            }`}
            onClick={onToggleNarration}
            aria-pressed={narrationEnabled}
            title="Toggle narration engine"
          >
            {narrationEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            <span className="hidden sm:inline">Narration</span>
          </button>

          <div className="inline-flex items-center gap-1 border rounded-lg px-1.5 py-1.5">
            <button
              className="p-1 rounded hover:bg-accent/50"
              onClick={onPlayNarration}
              title="Play"
              aria-label="Play narration"
            >
              <Play size={16} />
            </button>
            <button
              className="p-1 rounded hover:bg-accent/50"
              onClick={onPauseNarration}
              title="Pause"
              aria-label="Pause narration"
            >
              <Pause size={16} />
            </button>
            <button
              className="p-1 rounded hover:bg-accent/50"
              onClick={onStopNarration}
              title="Stop"
              aria-label="Stop narration"
            >
              <Square size={16} />
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <label className="flex items-center gap-2">
            {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="Ambient volume"
              className="w-full accent-foreground"
            />
            <span className="w-10 text-xs tabular-nums">{Math.round(volume * 100)}%</span>
          </label>

          <label className="flex items-center gap-2">
            <Mic size={18} />
            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.05}
              value={speakRate}
              onChange={(e) => onSpeakRateChange(parseFloat(e.target.value))}
              aria-label="Speech rate"
              className="w-full accent-foreground"
            />
            <span className="w-10 text-xs tabular-nums">{speakRate.toFixed(2)}x</span>
          </label>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-accent/40 transition ${
              hapticsEnabled ? 'bg-accent' : ''
            }`}
            onClick={onToggleHaptics}
            aria-pressed={hapticsEnabled}
            title="Toggle haptics"
          >
            <Vibrate size={18} />
            <span className="hidden sm:inline">Haptics</span>
          </button>
          <button
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-accent/40 transition ${
              reduceMotion ? 'bg-accent' : ''
            }`}
            onClick={onToggleReduceMotion}
            aria-pressed={reduceMotion}
            title="Reduce Motion"
          >
            <Accessibility size={18} />
            <span className="hidden sm:inline">Reduce motion</span>
          </button>
        </div>
      </div>
    </div>
  )
}
