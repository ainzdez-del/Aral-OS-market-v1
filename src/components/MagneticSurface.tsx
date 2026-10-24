import { useRef, type MouseEvent, type ReactNode } from 'react'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

export function MagneticSurface({
  children,
  className = '',
  intensity = 10,
}: {
  children: ReactNode
  className?: string
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rx = (0.5 - y) * intensity
    const ry = (x - 0.5) * intensity
    node.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`
    node.style.setProperty('--gx', `${x * 100}%`)
    node.style.setProperty('--gy', `${y * 100}%`)
  }

  const onLeave = () => {
    const node = ref.current
    if (!node) return
    node.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative will-change-transform ${className}`}
      style={{ transition: `transform 700ms ${EASE}` }}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.16), transparent 42%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}
