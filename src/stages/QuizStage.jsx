import { useState } from 'react'
import { quiz } from '../config.js'
import { sfx, unlock } from '../lib/sound.js'
import { fire } from '../lib/confetti.js'

const KEYS = ['A', 'B', 'C', 'D', 'E']

/** Stage 4 — a quiz where every single answer is correct. That's the bit. */
export default function QuizStage({ onNext }) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [finished, setFinished] = useState(false)

  const q = quiz.questions[index]
  const isLast = index === quiz.questions.length - 1

  function choose(i) {
    if (chosen !== null) return
    unlock()
    setChosen(i)
    sfx.correct()
    fire({ count: 34, origin: { x: 0.5, y: 0.72 }, spread: 90, velocity: 11 })
  }

  function advance() {
    if (isLast) {
      setFinished(true)
      sfx.fanfare()
      fire({ count: 90, origin: { x: 0.5, y: 0.6 }, spread: 120, velocity: 16 })
      return
    }
    setChosen(null)
    setIndex((i) => i + 1)
  }

  if (finished) {
    return (
      <div className="card">
        <p className="eyebrow">Results are in</p>
        <h1 className="title">Perfect score 🏆</h1>
        <p className="subtitle">{quiz.finalNote}</p>
        <div className="btn-row">
          <button className="btn btn--huge" onClick={onNext}>Claim your gifts 🎁</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <p className="quiz-count">Question {index + 1} of {quiz.questions.length}</p>
      <h1 className="title">{index === 0 ? quiz.title : q.q}</h1>
      {index === 0 ? <p className="subtitle">{quiz.subtitle}</p> : null}
      {index === 0 ? <h2 className="title" style={{ fontSize: 'clamp(1.15rem, 3.4vw, 1.5rem)' }}>{q.q}</h2> : null}

      <div className="options">
        {q.options.map((opt, i) => (
          <button
            key={opt}
            className={`option ${chosen === i ? 'option--chosen' : ''}`}
            onClick={() => choose(i)}
            disabled={chosen !== null}
          >
            <span className="option-key">{KEYS[i]}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {chosen !== null && (
        <>
          <p className="reaction">✅ {q.reactions[chosen]}</p>
          <div className="btn-row">
            <button className="btn" onClick={advance}>
              {isLast ? 'See my score 📊' : 'Next question →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
