import { useRef, useState } from 'react'
import { wheel } from '../config.js'
import { sfx, unlock } from '../lib/sound.js'
import { fire } from '../lib/confetti.js'

const SEGMENT_COLORS = ['#ff477e', '#ffc857', '#4cc9f0', '#b388ff', '#8ac926', '#ff9f1c']
const SEGMENT_EMOJI = ['💖', '✨', '🌟', '🎈', '🍰', '🌻', '🦋', '🎶', '🔮', '🥳']

export default function WishWheel({ onNext }) {
  const count = wheel.compliments.length
  const seg = 360 / count

  const rotationRef = useRef(0)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [spins, setSpins] = useState(0)

  function spin() {
    if (spinning) return
    unlock()
    setSpinning(true)
    setResult(null)
    sfx.whoosh()

    const target = Math.floor(Math.random() * count)
    // Land the middle of `target` under the pointer at the top, after 5 full turns.
    const desired = -(target * seg + seg / 2)
    const current = rotationRef.current
    const delta = ((desired - current) % 360 + 360) % 360
    const next = current + 360 * 5 + delta

    rotationRef.current = next
    setRotation(next)

    setTimeout(() => {
      setSpinning(false)
      setResult(wheel.compliments[target])
      setSpins((s) => s + 1)
      sfx.sparkle()
      fire({ count: 50, origin: { x: 0.5, y: 0.45 }, spread: 100, velocity: 13 })
    }, 4300)
  }

  const background = `conic-gradient(${wheel.compliments
    .map((_, i) => `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]} ${i * seg}deg ${(i + 1) * seg}deg`)
    .join(', ')})`

  return (
    <div className="card">
      <p className="eyebrow">Step five</p>
      <h1 className="title">{wheel.title}</h1>
      <p className="subtitle">{wheel.subtitle}</p>

      <div className="wheel-stage">
        <div className="wheel-pointer" aria-hidden="true">🔻</div>
        <div className="wheel" style={{ background, transform: `rotate(${rotation}deg)` }} aria-hidden="true">
          {wheel.compliments.map((_, i) => {
            const angle = i * seg + seg / 2
            return (
              <span
                key={i}
                className="wheel-emoji"
                style={{
                  transform: `rotate(${angle}deg) translate(0, calc(-1 * var(--r))) rotate(${-angle}deg) translate(-50%, -50%)`,
                }}
              >
                {SEGMENT_EMOJI[i % SEGMENT_EMOJI.length]}
              </span>
            )
          })}
        </div>
        <div className="wheel-hub" aria-hidden="true">🎂</div>
      </div>

      <div aria-live="polite" style={{ minHeight: '4.2em' }}>
        {result ? <p className="compliment">“{result}”</p> : null}
        {spinning ? <p className="mic-hint">Spinning…</p> : null}
      </div>

      <div className="btn-row">
        <button className="btn btn--mint" onClick={spin} disabled={spinning}>
          {spins === 0 ? 'Spin it! 🎡' : 'Spin again 🔄'}
        </button>
        {spins > 0 && !spinning && (
          <button className="btn btn--huge" onClick={onNext}>I'm ready 💌</button>
        )}
      </div>
    </div>
  )
}
