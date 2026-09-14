import { useEffect, useRef, useState } from 'react'
import { letter, person } from '../config.js'
import { playSong, sfx, unlock } from '../lib/sound.js'
import { celebrate } from '../lib/confetti.js'

const CHAR_MS = 26
const LINE_PAUSE_MS = 420

/** Stage 7 — the actual message, typed out, then the big finale. */
export default function FinalLetter({ onReplay }) {
  const [line, setLine] = useState(0)
  const [chars, setChars] = useState(0)
  const [done, setDone] = useState(false)
  const [eggOut, setEggOut] = useState(false)
  const stopPartyRef = useRef(null)

  // Typewriter: walk through the lines one character at a time.
  useEffect(() => {
    if (done) return
    const text = letter.lines[line]

    if (chars < text.length) {
      const id = setTimeout(() => setChars((c) => c + 1), CHAR_MS)
      return () => clearTimeout(id)
    }
    if (line < letter.lines.length - 1) {
      const id = setTimeout(() => { setLine((l) => l + 1); setChars(0) }, LINE_PAUSE_MS)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => setDone(true), 500)
    return () => clearTimeout(id)
  }, [line, chars, done])

  // The finale.
  useEffect(() => {
    if (!done) return
    unlock()
    sfx.fanfare()
    playSong()
    stopPartyRef.current = celebrate(4200)
    return () => stopPartyRef.current?.()
  }, [done])

  return (
    <div className="card card--wide">
      <h1 className="big-wish">{letter.title}</h1>
      <p className="subtitle">for {person.fullName}, on her favourite day of the year</p>

      <div className="letter">
        {letter.lines.slice(0, line + 1).map((text, i) => (
          <p key={i}>
            {i === line && !done ? text.slice(0, chars) : text}
            {i === line && !done && <span className="caret" />}
          </p>
        ))}
        {done && <p className="signoff">{letter.signoff}</p>}
      </div>

      {done && (
        <div className="btn-row">
          <button
            className="btn btn--huge btn--gold"
            onClick={() => { unlock(); sfx.fanfare(); celebrate(2600) }}
          >
            More confetti! 🎊
          </button>
          <button className="btn btn--ghost" onClick={onReplay}>{letter.replayLabel}</button>
        </div>
      )}

      {done && (
        <div className="egg">
          <button
            className="egg-btn"
            onClick={() => { unlock(); sfx.boing(); setEggOut(true) }}
          >
            {eggOut ? '🙈' : letter.easterEggLabel}
          </button>
          {eggOut && <p className="egg-reply">{letter.easterEggReply}</p>}
        </div>
      )}
    </div>
  )
}
