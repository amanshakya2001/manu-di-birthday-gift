// A tiny dependency-free confetti engine.
// One shared full-screen canvas, one RAF loop, particles opt in and out.

const COLORS = [
  '#ff477e', '#ff85a1', '#ffc2d1', '#ffd166',
  '#8ac926', '#4cc9f0', '#b388ff', '#fff1a8', '#ff9f1c',
]

let canvas = null
let ctx = null
let particles = []
let rafId = null
let dpr = 1

function ensureCanvas() {
  if (canvas) return
  canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999',
  })
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
}

function resize() {
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(window.innerWidth * dpr)
  canvas.height = Math.floor(window.innerHeight * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function spawn({ x, y, angle, spread, velocity, colors, shapes }) {
  const rad = (angle * Math.PI) / 180
  const spreadRad = (spread * Math.PI) / 180
  const a = rad + (Math.random() - 0.5) * spreadRad
  const v = velocity * (0.65 + Math.random() * 0.7)
  return {
    x,
    y,
    vx: Math.cos(a) * v,
    vy: -Math.sin(a) * v,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    color: colors[(Math.random() * colors.length) | 0],
    shape: shapes[(Math.random() * shapes.length) | 0],
    rot: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.35,
    wobble: Math.random() * Math.PI * 2,
    life: 0,
    ttl: 140 + Math.random() * 120,
    gravity: 0.24 + Math.random() * 0.12,
    drag: 0.985,
  }
}

function tick() {
  rafId = requestAnimationFrame(tick)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const h = window.innerHeight
  particles = particles.filter((p) => p.life < p.ttl && p.y < h + 60)

  for (const p of particles) {
    p.life += 1
    p.vy += p.gravity
    p.vx *= p.drag
    p.vy *= p.drag
    p.wobble += 0.1
    p.x += p.vx + Math.sin(p.wobble) * 0.9
    p.y += p.vy
    p.rot += p.spin

    const fade = Math.max(0, 1 - p.life / p.ttl)
    ctx.save()
    ctx.globalAlpha = fade
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.fillStyle = p.color

    if (p.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (p.shape === 'ribbon') {
      // squashed rectangle that "flips" as it spins — reads as a paper streamer
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.wobble)))
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
    }
    ctx.restore()
  }

  if (particles.length === 0) {
    cancelAnimationFrame(rafId)
    rafId = null
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

/**
 * Fire a burst of confetti.
 * origin is in viewport fractions: { x: 0.5, y: 0.5 } is dead centre.
 */
export function fire({
  count = 60,
  origin = { x: 0.5, y: 0.5 },
  angle = 90,
  spread = 70,
  velocity = 12,
  colors = COLORS,
  shapes = ['square', 'circle', 'ribbon'],
} = {}) {
  if (prefersReducedMotion()) return
  ensureCanvas()
  const x = origin.x * window.innerWidth
  const y = origin.y * window.innerHeight
  const n = Math.min(count, 300)
  for (let i = 0; i < n; i++) {
    particles.push(spawn({ x, y, angle, spread, velocity, colors, shapes }))
  }
  if (particles.length > 900) particles = particles.slice(-900)
  if (!rafId) rafId = requestAnimationFrame(tick)
}

/** Confetti cannons from both bottom corners. */
export function cannons() {
  fire({ count: 70, origin: { x: 0, y: 1 }, angle: 60, spread: 55, velocity: 22 })
  fire({ count: 70, origin: { x: 1, y: 1 }, angle: 120, spread: 55, velocity: 22 })
}

/** A sustained celebration — used for the big finale. */
export function celebrate(durationMs = 2600) {
  if (prefersReducedMotion()) return () => {}
  const end = Date.now() + durationMs
  const id = setInterval(() => {
    if (Date.now() > end) return clearInterval(id)
    fire({
      count: 18,
      origin: { x: Math.random(), y: -0.05 },
      angle: 270,
      spread: 120,
      velocity: 6,
    })
  }, 180)
  cannons()
  return () => clearInterval(id)
}
