
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { formatPrice } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'

const ease = [0.16, 1, 0.3, 1] as const

export function CartDrawer() {
  const { lines, open, setOpen, remove, total } = useCart()
  const { setCheckoutOpen } = useOrders()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Закрыть корзину"
            onClick={() => setOpen(false)}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease }}
            className="glass absolute inset-y-0 right-0 flex w-full max-w-md flex-col p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm tracking-[0.28em] uppercase">
                Корзина
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/8"
                aria-label="Закрыть"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-8 flex-1 space-y-6 overflow-y-auto">
              {lines.length === 0 && (
                <p className="text-sm text-white/50">
                  Корзина пуста. Выбери товар из коллекции.
                </p>
              )}

              {lines.map((line) => {
                const product = line.product

                if (!product) {
                  return (
                    <div
                      key={line.key}
                      className="flex items-center justify-between gap-3"
                    >
                      <p className="text-sm text-white/50">
                        Товар больше недоступен. Удали его и добавь заново.
                      </p>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="text-xs text-white/60 underline"
                      >
                        Удалить
                      </button>
                    </div>
                  )
                }

                return (
                  <div key={line.key} className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-20 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm">{product.name}</p>
                      <p className="mt-1 text-[11px] text-white/45">
                        {line.size} · ×{line.qty}
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        {formatPrice(product.price * line.qty)}
                      </p>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="mt-2 text-[11px] tracking-[0.16em] text-white/40 uppercase"
                      >
                        Убрать
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Итого</span>
                <span>{formatPrice(total)}</span>
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-white/35">
                Данные заказа будут сохранены после подтверждения.
              </p>

              <button
                type="button"
                disabled={
                  lines.length === 0 ||
                  lines.some((line) => !line.product)
                }
                onClick={() => {
                  setOpen(false)
                  setCheckoutOpen(true)
                }}
                className="mt-4 h-12 w-full rounded-full bg-white text-[11px] tracking-[0.24em] text-black uppercase disabled:opacity-40"
              >
                Оформить заказ
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
