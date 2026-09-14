import { useEffect, useState } from 'react'
import { gate } from '../config.js'
import { sfx, unlock } from '../lib/sound.js'
import { fire } from '../lib/confetti.js'

/** Stage 1 — a wrapped box that gets increasingly impatient. */
export default function GiftGate({ onNext }) {
  const [opened, setOpened] = useState(false)
  const [nagIndex, setNagIndex] = useState(-1)

  // Every few seconds of hesitation, the box says something.
  useEffect(() => {
    if (opened) return
    const id = setInterval(() => {
      setNagIndex((i) => Math.min(i + 1, gate.nags.length - 1))
    }, 4200)
    return () => clearInterval(id)
  }, [opened])

  function open() {
    if (opened) return
    unlock()
    setOpened(true)
    sfx.unwrap()
    setTimeout(() => {
      sfx.fanfare()
      fire({ count: 90, origin: { x: 0.5, y: 0.62 }, spread: 100, velocity: 16 })
    }, 380)
    setTimeout(onNext, 1400)
  }

  return (
    <div className="card card--bare" style={{ color: '#fff' }}>
      <p className="eyebrow" style={{ color: 'var(--gold)' }}>{gate.eyebrow}</p>
      <h1 className="title" style={{ color: '#fff' }}>{gate.title}</h1>

      <button className={`giftbox ${opened ? 'giftbox--open' : ''}`} onClick={open} aria-label="Open the gift box">
        <span className="gift-glow" />
        <span className="gift-body" />
        <span className="gift-ribbon-v" />
        <span className="gift-lid" />
        <span className="gift-ribbon-h" />
        <span className="gift-bow">🎀</span>
      </button>

      {opened ? (
        <p className="nag" style={{ color: 'var(--gold)' }}>Opening… 🎉</p>
      ) : (
        <p className="nag">{nagIndex < 0 ? `👆 ${gate.hint}` : gate.nags[nagIndex]}</p>
      )}
    </div>
  )
}
