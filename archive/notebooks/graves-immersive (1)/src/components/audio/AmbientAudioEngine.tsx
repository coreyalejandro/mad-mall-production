/**
 * AmbientAudioEngine.tsx
 * Web Audio ambient "surround" with rotating panner nodes to simulate spatial sound.
 * - Creates low drone + airy noise, moves sources on a circular path.
 * - Controlled by `enabled` and `volume` props.
 */

import React, { useEffect, useRef } from 'react'

export interface AmbientAudioEngineProps {
  enabled: boolean
  volume: number // 0..1
  /** Global motion reduction (slows or stops rotation) */
  reduceMotion?: boolean
}

export default function AmbientAudioEngine({ enabled, volume, reduceMotion }: AmbientAudioEngineProps) {
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const panner1Ref = useRef<PannerNode | null>(null)
  const panner2Ref = useRef<PannerNode | null>(null)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)

  // Create or resume audio context on enable
  useEffect(() => {
    if (!enabled) {
      // Stop audio context and nodes if they exist
      stopAudio()
      return
    }
    // Initialize on first enable
    startAudio()

    // Suspend on tab hidden; resume on visible
    const onVis = () => {
      const ctx = ctxRef.current
      if (!ctx) return
      try {
        if (document.hidden) {
          ctx.suspend()
        } else {
          ctx.resume()
        }
      } catch {
        // ignore
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      stopAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  // Volume control
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = Math.max(0, Math.min(1, volume))
    }
  }, [volume])

  // Rotation loop
  useEffect(() => {
    if (!enabled) return
    const ctx = ctxRef.current
    const p1 = panner1Ref.current
    const p2 = panner2Ref.current
    if (!ctx || !p1 || !p2) return

    const loop = () => {
      const t = (ctx.currentTime - startTimeRef.current)
      const speed = reduceMotion ? 0.02 : 0.07
      // Circular movement around listener
      const r = 0.8
      const x1 = Math.cos(t * speed) * r
      const z1 = Math.sin(t * speed) * r
      const x2 = Math.cos((t * speed) + Math.PI) * r
      const z2 = Math.sin((t * speed) + Math.PI) * r

      try {
        p1.positionX.value = x1
        p1.positionY.value = 0
        p1.positionZ.value = z1

        p2.positionX.value = x2
        p2.positionY.value = 0
        p2.positionZ.value = z2
      } catch {
        // older browsers: setPosition
        // @ts-ignore
        p1.setPosition(x1, 0, z1)
        // @ts-ignore
        p2.setPosition(x2, 0, z2)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [enabled, reduceMotion])

  function startAudio() {
    if (ctxRef.current) {
      // resume if suspended
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
      return
    }
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    ctxRef.current = ctx
    startTimeRef.current = ctx.currentTime

    // Master gain
    const gain = ctx.createGain()
    gain.gain.value = Math.max(0, Math.min(1, volume))
    gainRef.current = gain
    gain.connect(ctx.destination)

    // Listener defaults
    try {
      ctx.listener.positionX.value = 0
      ctx.listener.positionY.value = 0
      ctx.listener.positionZ.value = 0.1
    } catch {
      // @ts-ignore
      ctx.listener.setPosition(0, 0, 0.1)
    }

    // Create two panners
    const p1 = ctx.createPanner()
    p1.panningModel = 'HRTF'
    p1.distanceModel = 'inverse'
    p1.refDistance = 1
    p1.maxDistance = 10
    p1.rolloffFactor = 1
    p1.coneInnerAngle = 360
    p1.coneOuterAngle = 0
    p1.coneOuterGain = 0
    p1.connect(gain)
    panner1Ref.current = p1

    const p2 = ctx.createPanner()
    p2.panningModel = 'HRTF'
    p2.distanceModel = 'inverse'
    p2.refDistance = 1
    p2.maxDistance = 10
    p2.rolloffFactor = 1
    p2.coneInnerAngle = 360
    p2.coneOuterAngle = 0
    p2.coneOuterGain = 0
    p2.connect(gain)
    panner2Ref.current = p2

    // Low drone oscillator -> panner1
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 38 // deep cinematic rumble
    const oscGain = ctx.createGain()
    oscGain.gain.value = 0.08
    osc.connect(oscGain).connect(p1)
    osc.start()
    oscRef.current = osc

    // Subtle airy noise -> panner2
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      // gentle pink-ish noise approximation
      data[i] = (Math.random() * 2 - 1) * 0.04
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.06
    noise.connect(noiseGain).connect(p2)
    noise.start()
    noiseNodeRef.current = noise
  }

  function stopAudio() {
    try {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop(0)
        noiseNodeRef.current.disconnect()
        noiseNodeRef.current = null
      }
      if (oscRef.current) {
        oscRef.current.stop(0)
        oscRef.current.disconnect()
        oscRef.current = null
      }
      if (gainRef.current) {
        gainRef.current.disconnect()
        gainRef.current = null
      }
      if (panner1Ref.current) {
        panner1Ref.current.disconnect()
        panner1Ref.current = null
      }
      if (panner2Ref.current) {
        panner2Ref.current.disconnect()
        panner2Ref.current = null
      }
      if (ctxRef.current) {
        // close to free resources
        ctxRef.current.close()
        ctxRef.current = null
      }
    } catch {
      // ignore
    }
  }

  return null
}
