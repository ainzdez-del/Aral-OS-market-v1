import { motion } from 'framer-motion'
import { fabricSpecs } from '../data/catalog'

const ease = [0.16, 1, 0.3, 1] as const

export function FabricTech() {
  return (
    <section id="fabric" className="relative bg-black">
      <div className="md:grid md:grid-cols-2">
        <div className="relative h-[50vh] md:sticky md:top-0 md:h-screen">
          <img
            src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=1800&q=80"
            alt="Макро текстуры ткани ARAL"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <p className="absolute bottom-8 left-6 text-[11px] tracking-[0.32em] text-white/70 uppercase">
            Wool-silk laminate · 400%
          </p>
        </div>
        <div className="flex flex-col justify-center gap-24 px-6 py-24 md:min-h-[220vh] md:px-16 md:py-40">
          <div>
            <p className="text-[11px] tracking-[0.32em] text-white/45 uppercase">Технологии ткани</p>
            <h2 className="mt-4 max-w-md text-4xl font-light tracking-[-0.04em] md:text-6xl">
              Как чип.
              <br />
              Только мягче.
            </h2>
          </div>
          {fabricSpecs.map((spec) => (
            <motion.article
              key={spec.kicker}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, ease }}
              className="max-w-md"
            >
              <p className="text-[11px] tracking-[0.28em] text-white/40 uppercase">{spec.kicker}</p>
              <h3 className="mt-4 text-3xl font-light tracking-[-0.03em]">{spec.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{spec.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
