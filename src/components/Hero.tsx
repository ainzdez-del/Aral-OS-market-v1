import { motion } from 'framer-motion'
import { LiquidField } from './LiquidField'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <LiquidField />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-16 pt-32 md:px-8 md:pb-20">
        <p className="text-[11px] tracking-[0.38em] text-white/55 uppercase">
          Atelier 01 · AW26 · 48 изделий
        </p>
        <div className="reveal-mask max-w-4xl">
          <motion.h1
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.15, ease }}
            className="text-[14vw] leading-[0.86] font-light tracking-[-0.055em] md:text-[7.4vw]"
          >
            Будущее
            <br />
            формы
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="max-w-md text-sm leading-relaxed text-white/65 md:text-base"
        >
          Одежда как высокотехнологичный артефакт. Не витрина — лаборатория силуэта.
          Ткань течёт, корпус держит геометрию.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#collection"
            className="glass-pill group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-8 text-[11px] tracking-[0.24em] uppercase"
          >
            <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.28),transparent_55%)]" />
            </span>
            <span className="relative">Исследовать коллекцию</span>
          </a>
          <a
            href="#atelier"
            className="inline-flex h-12 items-center justify-center px-2 text-[11px] tracking-[0.22em] text-white/60 uppercase transition-colors hover:text-white"
          >
            Записать примерку
          </a>
        </motion.div>
      </div>
    </section>
  )
}
