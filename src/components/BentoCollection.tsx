import { motion } from 'framer-motion'
import { formatPrice, products, type Product } from '../data/catalog'
import { MagneticSurface } from './MagneticSurface'
import { MediaImage } from './MediaImage'

const ease = [0.16, 1, 0.3, 1] as const

export function BentoCollection({ onSelect }: { onSelect: (product: Product) => void }) {
  return (
    <section id="collection" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.32em] text-white/45 uppercase">Коллекция · Drop 01</p>
          <h2 className="mt-3 max-w-xl text-4xl font-light tracking-[-0.04em] md:text-6xl">
            Артефакты сезона
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-white/50">
          Крупный блок — halo-изделие: оно продаёт дом. Мелкие — вход в чек. Цену читают после
          касания ткани.
        </p>
      </div>

      <div className="grid auto-rows-[220px] grid-cols-1 gap-3 md:auto-rows-[260px] md:grid-cols-6">
        {products.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: index * 0.06, ease }}
            className={`group min-h-[220px] ${product.span}`}
          >
            <MagneticSurface className="h-full rounded-[28px]">
              <button
                type="button"
                onClick={() => onSelect(product)}
                className="relative block h-full w-full overflow-hidden rounded-[28px] text-left"
              >
                <MediaImage
                  src={product.image}
                  alt={product.name}
                  className="transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                {product.hoverImage && (
                  <img
                    src={product.hoverImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="glass absolute inset-x-3 bottom-3 rounded-2xl p-4 md:inset-x-4 md:bottom-4">
                  <p className="text-[10px] tracking-[0.28em] text-white/55 uppercase">
                    {product.sku} · {product.line}
                  </p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <h3 className="text-lg tracking-[-0.03em] md:text-xl">{product.name}</h3>
                    <span className="text-sm text-white/70">{formatPrice(product.price)}</span>
                  </div>
                </div>
              </button>
            </MagneticSurface>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
