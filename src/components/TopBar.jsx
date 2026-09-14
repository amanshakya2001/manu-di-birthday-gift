import { useEffect, useState } from 'react'
import { isMuted, onMuteChange, playSong, stopSong, toggleMuted, unlock } from '../lib/sound.js'

export default function TopBar({ steps, current }) {
  const [muted, setMuted] = useState(isMuted())
  const [playing, setPlaying] = useState(false)

  useEffect(() => onMuteChange(setMuted), [])

  function handleMusic() {
    unlock()
    if (playing) {
      stopSong()
      setPlaying(false)
      return
    }
    if (muted) {
      toggleMuted()
      setMuted(false)
    }
    playSong({ loop: true })
    setPlaying(true)
  }

  function handleMute() {
    unlock()
    const next = toggleMuted()
    setMuted(next)
    if (next) setPlaying(false)
  }

  return (
    <div className="topbar">
      <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={steps} aria-valuenow={current + 1} aria-label="Surprise progress">
        {Array.from({ length: steps }, (_, i) => (
          <span
            key={i}
            className={`dot ${i < current ? 'dot--done' : ''} ${i === current ? 'dot--active' : ''}`}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="icon-btn" onClick={handleMusic} aria-pressed={playing}>
          {playing ? '⏸' : '🎵'} <span className="btn-label">{playing ? 'Pause' : 'Music'}</span>
        </button>
        <button className="icon-btn" onClick={handleMute} aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}>
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  )
}
