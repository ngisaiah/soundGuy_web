import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 110

function makeParticle(w, h) {
  // Concentrate particles in the upper ~55% of the viewport, near the glow
  const yBias = Math.pow(Math.random(), 1.8) // skews toward 0 (top)
  return {
    x: Math.random() * w,
    y: yBias * h * 0.55,
    size: Math.random() * 1.4 + 0.3,          // 0.3–1.7 px radius
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.12 - 0.04, // slight upward drift
    opacity: Math.random() * 0.55 + 0.1,
    // each particle twinkles at its own rate
    twinkleSpeed: Math.random() * 0.02 + 0.008,
    twinkleOffset: Math.random() * Math.PI * 2,
  }
}

export default function BackgroundCanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      // Re-seed any out-of-bounds particles after resize
      particles.forEach((p) => {
        if (p.x > w) p.x = Math.random() * w
      })
    }

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Seed particles before first resize so makeParticle gets valid w/h
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight

    const particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(w, h))

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    const waves = [
      { yFrac: 0.12, freq: 0.0055, amp: 28, speed: 0.45, phase: 0.0, opacity: 0.22, width: 1.5 },
      { yFrac: 0.26, freq: 0.0040, amp: 38, speed: 0.30, phase: 1.2, opacity: 0.18, width: 1.2 },
      { yFrac: 0.40, freq: 0.0068, amp: 22, speed: 0.55, phase: 2.5, opacity: 0.15, width: 1.0 },
      { yFrac: 0.54, freq: 0.0032, amp: 42, speed: 0.25, phase: 0.7, opacity: 0.12, width: 1.3 },
      { yFrac: 0.66, freq: 0.0060, amp: 26, speed: 0.40, phase: 3.8, opacity: 0.10, width: 1.0 },
      { yFrac: 0.78, freq: 0.0048, amp: 20, speed: 0.35, phase: 1.9, opacity: 0.08, width: 0.9 },
      { yFrac: 0.90, freq: 0.0075, amp: 16, speed: 0.50, phase: 4.4, opacity: 0.06, width: 0.8 },
    ]

    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // --- Dust particles ---
      particles.forEach((p) => {
        // Gentle mouse repulsion within ~130px
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 130) {
          const force = (1 - dist / 130) * 0.3
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Drift with slight speed damping
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98

        // Wrap horizontally; respawn from top when drifting off the top
        if (p.x < -2)  p.x = w + 2
        if (p.x > w + 2) p.x = -2
        if (p.y < -4) {
          Object.assign(p, makeParticle(w, h))
          p.y = h * 0.55 // respawn at bottom of glow zone
        }
        if (p.y > h * 0.6) {
          Object.assign(p, makeParticle(w, h))
        }

        // Twinkle: opacity pulses gently over time
        const twinkle = 0.5 + 0.5 * Math.sin(t * p.twinkleSpeed * 60 + p.twinkleOffset)
        const alpha = p.opacity * (0.4 + 0.6 * twinkle)

        // Proximity glow: particles near the mouse get slightly brighter
        const proximity = dist < 160 ? (1 - dist / 160) * 0.4 : 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 168, 255, ${Math.min(1, alpha + proximity)})`
        ctx.fill()
      })

      // --- Wave lines ---
      waves.forEach((wave) => {
        const baseY = wave.yFrac * h

        ctx.beginPath()

        for (let x = 0; x <= w; x += 2) {
          const sine = Math.sin(x * wave.freq + t * wave.speed + wave.phase)

          const dx = x - mx
          const dy = baseY - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const pull = Math.max(0, 1 - dist / 220)
          const ripple = pull * 35 * Math.sin(t * 2.5 + wave.phase)

          const y = baseY + sine * wave.amp + ripple
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }

        const grad = ctx.createLinearGradient(0, 0, w, 0)
        grad.addColorStop(0,    `rgba(100, 88, 255, ${wave.opacity * 0.5})`)
        grad.addColorStop(0.35, `rgba(124, 111, 255, ${wave.opacity})`)
        grad.addColorStop(0.65, `rgba(148, 130, 255, ${wave.opacity * 0.85})`)
        grad.addColorStop(1,    `rgba(100, 88, 255, ${wave.opacity * 0.4})`)

        ctx.strokeStyle = grad
        ctx.lineWidth = wave.width
        ctx.stroke()
      })

      t += 0.012
      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
