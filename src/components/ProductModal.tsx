import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { formatPrice, productById, SIZES, type Look, type Product, type Size } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { MediaImage } from './MediaImage'

const ease = [0.16, 1, 0.3, 1] as const

export function ProductModal({
  look,
  product,
  onClose,
}: {
  look?: Look | null
  product?: Product | null
  onClose: () => void
}) {
  const open = Boolean(look || product)
  const items = look
    ? look.productIds.map((id) => productById(id)).filter((item): item is Product => Boolean(item))
    : product
      ? [product]
      : []
  const hero = look?.image ?? product?.image

  return (
    <AnimatePresence>
      {open && hero && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, scale: 0.92, y: 40, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: 24, filter: 'blur(10px)' }}
            transition={{ duration: 0.7, ease }}
            className="glass relative grid max-h-[90svh] w-full max-w-4xl overflow-hidden rounded-[32px] md:grid-cols-2"
          >
            <div className="relative h-64 md:h-auto">
              <MediaImage src={hero} alt={look?.title ?? product?.name ?? ''} />
            </div>
            <div className="relative overflow-y-auto p-6 md:p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/8"
                aria-label="Закрыть окно"
              >
                <X size={16} />
              </button>
              <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">
                {look ? look.title : product?.sku}
              </p>
              <h3 className="mt-3 pr-10 text-3xl font-light tracking-[-0.03em]">
                {look ? 'Собрать образ' : product?.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {look?.caption ?? product?.story}
              </p>
              <div className="mt-8 space-y-8">
                {items.map((item) => (
                  <LineItem key={item.id} product={item} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function LineItem({ product }: { product: Product }) {
  const { add } = useCart()
  const [size, setSize] = useState<Size>('M')

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-sm">{product.name}</p>
          <p className="mt-1 text-[11px] tracking-[0.18em] text-white/40 uppercase">{product.fabric}</p>
        </div>
        <p className="text-sm text-white/70">{formatPrice(product.price)}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SIZES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setSize(value)}
            className={`h-9 min-w-9 rounded-full px-3 text-[11px] tracking-[0.12em] ${
              size === value ? 'bg-white text-black' : 'bg-white/8 text-white/70'
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => add(product.id, size)}
        className="glass-pill mt-4 inline-flex h-11 w-full items-center justify-center rounded-full text-[11px] tracking-[0.22em] uppercase"
      >
        Добавить в корзину
      </button>
    </div>
  )
}
