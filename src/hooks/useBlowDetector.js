import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Listens to the microphone and reports "blow" events.
 *
 * A blow into a mic is mostly low-frequency broadband noise, so we weight the
 * bottom of the spectrum and require the energy to stay high for a moment —
 * that keeps talking and background music from snuffing the candles.
 */
export default function useBlowDetector({ onBlow, throttleMs = 260 } = {}) {
  const [level, setLevel] = useState(0)
  const [status, setStatus] = useState('idle') // idle | listening | denied | unsupported

  const ctxRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const lastBlowRef = useRef(0)
  const onBlowRef = useRef(onBlow)

  useEffect(() => { onBlowRef.current = onBlow }, [onBlow])

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    ctxRef.current?.close().catch(() => {})
    ctxRef.current = null
    setLevel(0)
    setStatus((s) => (s === 'listening' ? 'idle' : s))
  }, [])

  const start = useCallback(async () => {
    if (status === 'listening') return
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      streamRef.current = stream

      const AC = window.AudioContext || window.webkitAudioContext
      const ctx = new AC()
      ctxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.6
      source.connect(analyser)

      const bins = new Uint8Array(analyser.frequencyBinCount)
      const binHz = ctx.sampleRate / analyser.fftSize
      const lowCutoff = Math.min(Math.floor(600 / binHz), analyser.frequencyBinCount)

      setStatus('listening')

      const loop = () => {
        rafRef.current = requestAnimationFrame(loop)
        analyser.getByteFrequencyData(bins)

        let low = 0
        for (let i = 1; i < lowCutoff; i++) low += bins[i]
        low /= (lowCutoff - 1) * 255

        setLevel(low)

        const now = performance.now()
        if (low > 0.42 && now - lastBlowRef.current > throttleMs) {
          lastBlowRef.current = now
          onBlowRef.current?.()
        }
      }
      loop()
    } catch {
      setStatus('denied')
    }
  }, [status, throttleMs])

  useEffect(() => stop, [stop])

  return { level, status, start, stop }
}
