// Every sound on this site is synthesised at runtime with the Web Audio API,
// so there are zero audio files to host and nothing to download.

let ctx = null
let master = null
let muted = false
let songTimer = null
const listeners = new Set()

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 0.9
    master.connect(ctx.destination)
  }
  // Browsers suspend the context until a user gesture happens.
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Call from any click handler so audio is allowed to start. */
export function unlock() {
  audio()
}

export function isMuted() {
  return muted
}

export function setMuted(next) {
  muted = next
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.02)
  if (muted) stopSong()
  listeners.forEach((fn) => fn(muted))
}

export function toggleMuted() {
  setMuted(!muted)
  return muted
}

export function onMuteChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** One note with a soft attack/decay envelope. */
function note(freq, startAt, duration, { type = 'triangle', gain = 0.22, detune = 0 } = {}) {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const env = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.detune.value = detune
  env.gain.setValueAtTime(0.0001, startAt)
  env.gain.exponentialRampToValueAtTime(gain, startAt + 0.02)
  env.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
  osc.connect(env).connect(master)
  osc.start(startAt)
  osc.stop(startAt + duration + 0.05)
}

/** A short pitch sweep — used for pops, whooshes and boings. */
function sweep(from, to, duration, { type = 'sine', gain = 0.25, curve = 'exp' } = {}) {
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime
  const osc = ac.createOscillator()
  const env = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  if (curve === 'exp') osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + duration)
  else osc.frequency.linearRampToValueAtTime(to, t + duration)
  env.gain.setValueAtTime(gain, t)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(env).connect(master)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

function noise(duration = 0.25, { gain = 0.18, filterFreq = 1200 } = {}) {
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime
  const frames = Math.floor(ac.sampleRate * duration)
  const buffer = ac.createBuffer(1, frames, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
  const src = ac.createBufferSource()
  src.buffer = buffer
  const lp = ac.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = filterFreq
  const env = ac.createGain()
  env.gain.value = gain
  src.connect(lp).connect(env).connect(master)
  src.start(t)
}

// ── Sound effects ────────────────────────────────────────────
export const sfx = {
  pop: () => sweep(420, 900, 0.12, { type: 'sine', gain: 0.22 }),
  tap: () => sweep(700, 480, 0.07, { type: 'square', gain: 0.1 }),
  boing: () => sweep(520, 130, 0.22, { type: 'sawtooth', gain: 0.14 }),
  whoosh: () => noise(0.3, { gain: 0.12, filterFreq: 900 }),
  blow: () => noise(0.45, { gain: 0.2, filterFreq: 700 }),
  correct: () => {
    const ac = audio()
    if (!ac) return
    const t = ac.currentTime
    ;[523.25, 659.25, 783.99].forEach((f, i) => note(f, t + i * 0.07, 0.3, { gain: 0.18 }))
  },
  sparkle: () => {
    const ac = audio()
    if (!ac) return
    const t = ac.currentTime
    ;[1046.5, 1318.5, 1568, 2093].forEach((f, i) =>
      note(f, t + i * 0.05, 0.35, { type: 'sine', gain: 0.1 })
    )
  },
  unwrap: () => {
    noise(0.35, { gain: 0.15, filterFreq: 2400 })
    sweep(300, 800, 0.3, { type: 'triangle', gain: 0.12 })
  },
  fanfare: () => {
    const ac = audio()
    if (!ac) return
    const t = ac.currentTime
    const seq = [
      [523.25, 0, 0.18],
      [659.25, 0.16, 0.18],
      [783.99, 0.32, 0.18],
      [1046.5, 0.48, 0.55],
    ]
    seq.forEach(([f, at, dur]) => {
      note(f, t + at, dur, { type: 'triangle', gain: 0.22 })
      note(f * 2, t + at, dur, { type: 'sine', gain: 0.07 })
    })
  },
}

// ── "Happy Birthday", played live ────────────────────────────
const N = {
  G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
}

// [frequency, beats]
const MELODY = [
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 1],
  [N.F5, 0.75], [N.F5, 0.25], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 2],
]

const BEAT = 0.42 // seconds per beat

function scheduleSong() {
  const ac = audio()
  if (!ac || muted) return 0
  let at = ac.currentTime + 0.15
  for (const [freq, beats] of MELODY) {
    const dur = beats * BEAT
    note(freq, at, dur * 0.92, { type: 'triangle', gain: 0.14 })
    note(freq / 2, at, dur * 0.92, { type: 'sine', gain: 0.05 }) // gentle octave below
    at += dur
  }
  return at - ac.currentTime
}

/** Play the melody once, or on a gentle loop for background music. */
export function playSong({ loop = false } = {}) {
  stopSong()
  const length = scheduleSong()
  if (!length) return
  if (loop) {
    songTimer = setTimeout(() => playSong({ loop: true }), (length + 1.6) * 1000)
  }
}

export function stopSong() {
  if (songTimer) {
    clearTimeout(songTimer)
    songTimer = null
  }
}
