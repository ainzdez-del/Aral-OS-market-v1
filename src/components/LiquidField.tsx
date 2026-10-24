import { useEffect, useRef } from 'react'

export function LiquidField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const blobs = [
      { x: 0.28, y: 0.4, r: 0.34, hue: 210, speed: 0.0007 },
      { x: 0.72, y: 0.32, r: 0.4, hue: 230, speed: 0.0009 },
      { x: 0.52, y: 0.7, r: 0.38, hue: 190, speed: 0.0006 },
    ]

    const draw = (time: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#030303'
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'
      blobs.forEach((blob, i) => {
        const px = (blob.x + Math.sin(time * blob.speed + i) * 0.08) * w
        const py = (blob.y + Math.cos(time * blob.speed * 1.2 + i) * 0.07) * h
        const radius = blob.r * Math.min(w, h)
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius)
        gradient.addColorStop(0, `hsla(${blob.hue}, 18%, 78%, 0.22)`)
        gradient.addColorStop(0.45, `hsla(${blob.hue + 20}, 12%, 55%, 0.08)`)
        gradient.addColorStop(1, 'rgba(3,3,3,0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="mesh-liquid absolute inset-[-20%] opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#030303]" />
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=70)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'mesh-drift 22s ease-in-out infinite alternate',
        }}
      />
    </div>
  )
}
