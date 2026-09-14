import { useState } from 'react'
import { giftPicker, gifts } from '../config.js'
import { sfx, unlock } from '../lib/sound.js'
import { cannons, fire } from '../lib/confetti.js'
import { logGifts } from '../lib/track.js'

/**
 * Stage 5 — the gift menu. She picks what she actually wants; the site
 * gets progressively more alarmed the more she selects.
 */
export default function GiftPicker({ onNext }) {
  const [picked, setPicked] = useState([])
  const [sent, setSent] = useState(false)

  function toggle(i) {
    if (sent) return
    unlock()
    setPicked((prev) => {
      const isOn = prev.includes(i)
      const next = isOn ? prev.filter((n) => n !== i) : [...prev, i]

      if (isOn) {
        sfx.tap()
      } else {
        sfx.pop()
        // The more she picks, the bigger the burst.
        fire({
          count: 24 + next.length * 10,
          origin: { x: 0.5, y: 0.62 },
          spread: 90,
          velocity: 12,
        })
        if (next.length === gifts.length) {
          sfx.fanfare()
          cannons()
        }
      }
      return next
    })
  }

  function send() {
    if (sent || picked.length === 0) return
    unlock()
    logGifts(picked.map((i) => gifts[i].title))
    setSent(true)
    sfx.fanfare()
    cannons()
  }

  const count = picked.length
  const reaction = giftPicker.reactions[Math.min(count, giftPicker.reactions.length - 1)]

  return (
    <div className="card card--wide">
      <p className="eyebrow">Step four</p>
      <h1 className="title">{giftPicker.title}</h1>
      <p className="subtitle">{giftPicker.subtitle}</p>

      <div className="gift-menu">
        {gifts.map((g, i) => {
          const on = picked.includes(i)
          return (
            <button
              key={g.title}
              className={`gift-card ${on ? 'gift-card--on' : ''}`}
              onClick={() => toggle(i)}
              aria-pressed={on}
            >
              <span className="gift-check" aria-hidden="true">{on ? '✓' : ''}</span>
              <span className="gift-card-emoji">{g.emoji}</span>
              <span className="gift-card-title">{g.title}</span>
              <span className="gift-card-text">{g.text}</span>
            </button>
          )
        })}
      </div>

      <p className="reaction" aria-live="polite" style={{ minHeight: '1.6em' }}>
        {count === 0 ? giftPicker.emptyNote : reaction}
      </p>

      {count > 0 && (
        <>
          <div className="coupon">
            <div className="coupon-emoji">🧾</div>
            <h2 className="coupon-title">The Official Bill</h2>
            <ul className="bill-list">
              {picked.map((i) => (
                <li key={i}>
                  <span>{gifts[i].emoji} {gifts[i].title}</span>
                  <span className="bill-tick">owed ✓</span>
                </li>
              ))}
            </ul>
            <p className="coupon-text">{sent ? giftPicker.sentNote : giftPicker.confirm}</p>
            <span className="coupon-stamp">
              {sent ? `${giftPicker.sentTitle} · ${count} item${count > 1 ? 's' : ''}` : `${count} item${count > 1 ? 's' : ''} · unpaid`}
            </span>
          </div>

          <div className="btn-row">
            {!sent && (
              <button className="btn btn--mint" onClick={send}>{giftPicker.sendLabel}</button>
            )}
            <button className="btn btn--huge btn--gold" onClick={onNext}>One more thing… 🎡</button>
          </div>
        </>
      )}
    </div>
  )
}
