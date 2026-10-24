import { useEffect, useRef } from 'react'
import { looks, type Look } from '../data/catalog'
import { MediaImage } from './MediaImage'

export function Lookbook({ onOpen }: { onOpen: (look: Look) => void }) {
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = scroller.current
    if (!node) return

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth < 768) return
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return
      event.preventDefault()
      node.scrollLeft += event.deltaY
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <section id="lookbook" className="py-24 md:py-32">
      <div className="mx-auto mb-10 max-w-6xl px-5 md:px-8">
        <p className="text-[11px] tracking-[0.32em] text-white/45 uppercase">Lookbook · горизонталь</p>
        <h2 className="mt-3 text-4xl font-light tracking-[-0.04em] md:text-6xl">Образы, не SKU</h2>
        <p className="mt-4 max-w-md text-sm text-white/50">
          Скролл вниз двигает карусель вбок. Клик не уводит со страницы — образ раскрывается стеклом.
          Полный look поднимает средний чек.
        </p>
      </div>
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:px-8"
      >
        {looks.map((look) => (
          <button
            key={look.id}
            type="button"
            onClick={() => onOpen(look)}
            className="group relative h-[70vh] w-[78vw] shrink-0 snap-center overflow-hidden rounded-[28px] md:w-[38vw]"
          >
            <MediaImage
              src={look.image}
              alt={look.title}
              className="transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
            <div className="glass absolute inset-x-4 bottom-4 rounded-2xl p-5 text-left">
              <p className="text-[11px] tracking-[0.22em] text-white/55 uppercase">{look.title}</p>
              <p className="mt-2 text-sm text-white/80">{look.caption}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
