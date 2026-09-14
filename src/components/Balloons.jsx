import { useMemo } from 'react'

const COLORS = ['#ff477e', '#ffc857', '#4cc9f0', '#b388ff', '#ff85a1', '#8ac926']

/** Decorative balloons drifting up behind everything. Purely ambient. */
export default function Balloons({ count = 9 }) {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 100) / count + Math.random() * 7}%`,
        color: COLORS[i % COLORS.length],
        duration: `${17 + Math.random() * 14}s`,
        delay: `${-Math.random() * 24}s`,
        scale: 0.6 + Math.random() * 0.7,
      })),
    [count]
  )

  return (
    <div className="balloons" aria-hidden="true">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{
            left: b.left,
            color: b.color,
            background: `radial-gradient(circle at 32% 28%, #fff6, ${b.color} 42%, #0003)`,
            animationDuration: b.duration,
            animationDelay: b.delay,
            scale: b.scale,
          }}
        />
      ))}
    </div>
  )
}
