import { useCallback, useEffect, useState } from 'react'
import { cake, person } from '../config.js'
import { sfx, unlock } from '../lib/sound.js'
import { celebrate, fire } from '../lib/confetti.js'
import useBlowDetector from '../hooks/useBlowDetector.js'

const CANDLE_COUNT = 5

export default function CakeStage({ onNext }) {
  const [lit, setLit] = useState(() => Array(CANDLE_COUNT).fill(true))
  const allOut = lit.every((l) => !l)

  const snuffOne = useCallback((index) => {
    setLit((prev) => {
      if (index === undefined) {
        // Mic blow: put out the left-most candle still burning.
        index = prev.findIndex(Boolean)
        if (index === -1) return prev
      }
      if (!prev[index]) return prev
      const next = [...prev]
      next[index] = false
      return next
    })
  }, [])

  const { level, status, start, stop } = useBlowDetector({
    onBlow: () => {
      snuffOne()
      sfx.blow()
    },
  })

  function tapCandle(i) {
    unlock()
    if (!lit[i]) return
    snuffOne(i)
    sfx.blow()
  }

  useEffect(() => {
    if (!allOut) return
    stop()
    sfx.sparkle()
    const stopParty = celebrate(1800)
    fire({ count: 80, origin: { x: 0.5, y: 0.6 }, spread: 110, velocity: 16 })
    return stopParty
  }, [allOut, stop])

  return (
    <div className="card">
      <p className="eyebrow">Step two</p>
      <h1 className="title">{allOut ? cake.doneTitle : cake.title}</h1>
      <p className="subtitle">{allOut ? cake.doneSubtitle : cake.subtitle}</p>

      <div className="cake-scene">
        <div className="cake-candles">
          {lit.map((isLit, i) => (
            <button
              key={i}
              className={`candle ${isLit ? '' : 'candle--out'}`}
              onClick={() => tapCandle(i)}
              aria-label={isLit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
            >
              <span className="flame" />
              {!isLit && <span className="smoke" />}
            </button>
          ))}
        </div>

        <div className="cake-tier cake-tier--top">
          {person.age != null && <span className="cake-age">{person.age}</span>}
        </div>
        <div className="cake-tier cake-tier--bottom" />
        <div className="cake-plate" />
      </div>

      {!allOut && (
        <>
          {status === 'listening' ? (
            <>
              <div className="mic-meter" aria-hidden="true">
                <i style={{ width: `${Math.min(100, level * 160)}%` }} />
              </div>
              <p className="mic-hint">🎤 Listening… blow at your screen!</p>
            </>
          ) : (
            <div className="btn-row">
              <button className="btn btn--mint" onClick={() => { unlock(); start() }}>
                🎤 Blow with my mic
              </button>
            </div>
          )}

          {status === 'denied' && <p className="mic-hint">No mic access — tapping the candles works just as well. 👆</p>}
          {status === 'unsupported' && <p className="mic-hint">Your browser won’t share a mic. Tap the candles instead. 👆</p>}
        </>
      )}

      {allOut && (
        <div className="btn-row">
          <button className="btn btn--huge" onClick={onNext}>Now the quiz 🧠</button>
        </div>
      )}
    </div>
  )
}
