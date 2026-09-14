import { useCallback, useEffect, useState } from 'react'
import { logEvent, logVisit } from './lib/track.js'
import Balloons from './components/Balloons.jsx'
import TopBar from './components/TopBar.jsx'
import GiftGate from './stages/GiftGate.jsx'
import TheQuestion from './stages/TheQuestion.jsx'
import CakeStage from './stages/CakeStage.jsx'
import QuizStage from './stages/QuizStage.jsx'
import GiftPicker from './stages/GiftPicker.jsx'
import WishWheel from './stages/WishWheel.jsx'
import FinalLetter from './stages/FinalLetter.jsx'

const STAGES = [GiftGate, TheQuestion, CakeStage, QuizStage, GiftPicker, WishWheel, FinalLetter]
const STAGE_NAMES = ['Gift box', 'The question', 'Cake', 'Quiz', 'Gift picks', 'Wheel', 'Letter']

export default function App() {
  const [index, setIndex] = useState(0)

  useEffect(() => { logVisit() }, [])
  useEffect(() => { logEvent('reached stage', STAGE_NAMES[index]) }, [index])

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, STAGES.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const replay = useCallback(() => setIndex(0), [])

  const Stage = STAGES[index]

  return (
    <div className="app">
      <Balloons />
      <TopBar steps={STAGES.length} current={index} />

      <main className="stage-wrap">
        {/* key forces a fresh mount per stage so entrance animations replay */}
        <Stage key={index} onNext={next} onReplay={replay} />
      </main>
    </div>
  )
}
