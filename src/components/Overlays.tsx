import { useMemo, useState } from 'react'
import { useOrders } from '../context/OrderContext'
import { formatPrice, products, type Product } from '../data/catalog'

export function SearchOverlay({
  open,
  onClose,
  onPick,
}: {
  open: boolean
  onClose: () => void
  onPick: (product: Product) => void
}) {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return products
    return products.filter((item) =>
      `${item.name} ${item.sku} ${item.line} ${item.fabric}`.toLowerCase().includes(query),
    )
  }, [q])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24">
      <button type="button" className="absolute inset-0 bg-black/55 backdrop-blur-md" onClick={onClose} />
      <div className="glass relative w-full max-w-xl rounded-[28px] p-5">
        <input
          autoFocus
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Искать артефакт, SKU, ткань…"
          className="h-12 w-full bg-transparent text-lg outline-none placeholder:text-white/30"
        />
        <div className="mt-4 space-y-1">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPick(item)
                onClose()
              }}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left hover:bg-white/6"
            >
              <span>{item.name}</span>
              <span className="text-[11px] tracking-[0.16em] text-white/40 uppercase">{item.sku}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProfileOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { orders } = useOrders()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/55 backdrop-blur-md" onClick={onClose} />
      <div className="glass relative max-h-[86svh] w-full max-w-md overflow-y-auto rounded-[28px] p-8">
        <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">ARAL Atelier</p>
        <h3 className="mt-3 text-3xl font-light tracking-[-0.03em]">Членство дома</h3>
        <p className="mt-4 text-sm leading-relaxed text-white/55">
          Не аккаунт магазина — доступ к дропам раньше витрины, примерка по записи и архив прошлых
          капсул. Регистрация через лист ожидания ниже.
        </p>
        <div className="mt-8">
          <p className="text-[11px] tracking-[0.22em] text-white/40 uppercase">Заказы</p>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-white/45">Пока пусто. Соберите образ в lookbook.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="border-b border-white/8 pb-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm">{order.id}</p>
                    <p className="text-sm text-white/70">{formatPrice(order.subtotal)}</p>
                  </div>
                  <p className="mt-1 text-[11px] text-white/40">
                    {order.customer.fulfillment === 'atelier' ? 'Ателье' : 'Курьер'} ·{' '}
                    {order.items.map((item) => item.name).join(', ')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <a
          href="#atelier"
          onClick={onClose}
          className="glass-pill mt-6 inline-flex h-11 items-center rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
        >
          Встать в лист
        </a>
      </div>
    </div>
  )
}
