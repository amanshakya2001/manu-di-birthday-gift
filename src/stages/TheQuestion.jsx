import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { question } from '../config.js'
import { sfx, unlock } from '../lib/sound.js'
import { cannons, fire } from '../lib/confetti.js'

/**
 * Stage 2 — "Are you ready?" with Yes / No.
 * The No button physically dodges the cursor, renames itself each time,
 * and eventually gives up. It can never actually be clicked.
 */
export default function TheQuestion({ onNext }) {
  const arenaRef = useRef(null)
  const noRef = useRef(null)
  const baseRect = useRef(null)

  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)
  const [gaveUp, setGaveUp] = useState(false)
  const [accepted, setAccepted] = useState(false)

  // Remember where the No button naturally sits so dodges stay inside the arena.
  const measure = useCallback(() => {
    if (!noRef.current || !arenaRef.current) return
    const prev = noRef.current.style.transform
    noRef.current.style.transform = 'none'
    const btn = noRef.current.getBoundingClientRect()
    const arena = arenaRef.current.getBoundingClientRect()
    noRef.current.style.transform = prev
    baseRect.current = {
      minX: arena.left - btn.left + 6,
      maxX: arena.right - btn.right - 6,
      minY: arena.top - btn.top + 6,
      maxY: arena.bottom - btn.bottom - 6,
    }
  }, [])

  useLayoutEffect(() => {
    measure()
    // On resize the old offset may now point off-screen, so send it home.
    const onResize = () => { measure(); setOffset({ x: 0, y: 0 }) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [measure])

  function dodge() {
    if (gaveUp || accepted) return
    const b = baseRect.current
    const next = dodges + 1

    if (next >= question.noLabels.length) {
      setDodges(next)
      setGaveUp(true)
      sfx.boing()
      return
    }

    if (b) {
      // Jump somewhere new, and make sure it is actually far from where it was.
      let x = offset.x
      let y = offset.y
      for (let i = 0; i < 12; i++) {
        const cx = b.minX + Math.random() * Math.max(1, b.maxX - b.minX)
        const cy = b.minY + Math.random() * Math.max(1, b.maxY - b.minY)
        if (Math.hypot(cx - offset.x, cy - offset.y) > 90 || i === 11) {
          x = cx
          y = cy
          break
        }
      }
      setOffset({ x, y })
    }

    setDodges(next)
    sfx.boing()
  }

  function sayYes() {
    if (accepted) return
    unlock()
    setAccepted(true)
    sfx.fanfare()
    cannons()
    fire({ count: 100, origin: { x: 0.5, y: 0.55 }, spread: 120, velocity: 18 })
    setTimeout(onNext, 1500)
  }

  useEffect(() => { unlock() }, [])

  const yesScale = Math.min(1 + dodges * 0.09, 1.7)
  const noScale = Math.max(1 - dodges * 0.07, 0.45)
  const label = question.noLabels[Math.min(dodges, question.noLabels.length - 1)]

  return (
    <div className="card">
      <p className="eyebrow">Step one</p>
      <h1 className="title">{question.title}</h1>
      <p className="subtitle">{question.subtitle}</p>

      <div className="question-arena" ref={arenaRef}>
        <button
          className="btn btn--huge btn--yes pulse"
          style={{ transform: `scale(${yesScale})` }}
          onClick={sayYes}
        >
          {accepted ? 'I KNEW IT! 🥳' : question.yesLabel}
        </button>

        {!gaveUp && !accepted && (
          <button
            ref={noRef}
            className="btn btn--ghost btn--no"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${noScale})` }}
            onMouseEnter={dodge}
            onPointerDown={(e) => { e.preventDefault(); dodge() }}
            onFocus={dodge}
            onClick={(e) => e.preventDefault()}
          >
            {label}
          </button>
        )}

        {gaveUp && !accepted && (
          <p className="runaway-note">
            The “No” button left the building. 🏃‍♀️💨 Only one option now.
          </p>
        )}
      </div>
    </div>
  )
}
