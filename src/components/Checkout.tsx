import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { formatPrice, productById } from '../data/catalog'
import {
  loadCheckoutDraft,
  saveCheckoutDraft,
  type Fulfillment,
  type Order,
  type OrderCustomer,
} from '../data/orders'

const ease = [0.16, 1, 0.3, 1] as const

const emptyCustomer: OrderCustomer = {
  name: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  note: '',
  fulfillment: 'atelier',
}

export function Checkout() {
  const { lines, total, setOpen: setCartOpen } = useCart()
  const { checkoutOpen, setCheckoutOpen, placeOrder } = useOrders()
  const [customer, setCustomer] = useState<OrderCustomer>(() => ({
    ...emptyCustomer,
    ...loadCheckoutDraft(),
  }))
  const [placed, setPlaced] = useState<Order | null>(null)

  useEffect(() => {
    saveCheckoutDraft(customer)
  }, [customer])

  useEffect(() => {
    if (!checkoutOpen) setPlaced(null)
  }, [checkoutOpen])

  const onClose = () => setCheckoutOpen(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const order = placeOrder(customer)
    if (order) setPlaced(order)
  }

  const patch = (field: keyof OrderCustomer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center p-3 md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            aria-label="Закрыть оформление"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, y: 36, scale: 0.96, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease }}
            className="glass relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-[32px]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/8"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>

            {placed ? (
              <Receipt order={placed} onClose={onClose} />
            ) : (
              <div className="grid md:grid-cols-2">
                <aside className="border-b border-white/8 p-6 md:border-r md:border-b-0 md:p-8">
                  <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">Заказ</p>
                  <h2 className="mt-3 text-3xl font-light tracking-[-0.03em]">Оформление</h2>
                  <p className="mt-3 text-sm text-white/50">
                    Цена фиксируется в момент подтверждения. Доставка включена. Примерка — 48 часов.
                  </p>
                  <div className="mt-8 space-y-4">
                    {lines.map((line) => {
                      const product = productById(line.productId)
                      if (!product) return null
                      return (
                        <div key={line.key} className="flex gap-3">
                          <img
                            src={product.image}
                            alt=""
                            className="h-16 w-14 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm">{product.name}</p>
                            <p className="mt-1 text-[11px] text-white/40">
                              {line.size} · ×{line.qty}
                            </p>
                          </div>
                          <p className="text-sm text-white/70">
                            {formatPrice(product.price * line.qty)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-8 flex justify-between border-t border-white/10 pt-4 text-sm">
                    <span className="text-white/50">Итого</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutOpen(false)
                      setCartOpen(true)
                    }}
                    className="mt-5 text-[11px] tracking-[0.18em] text-white/40 uppercase"
                  >
                    Вернуться в корзину
                  </button>
                </aside>

                <form onSubmit={onSubmit} className="space-y-5 p-6 md:p-8">
                  <Field label="Имя" name="name" value={customer.name} onChange={patch} required />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={customer.email}
                    onChange={patch}
                    required
                  />
                  <Field
                    label="Телефон"
                    name="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={patch}
                    required
                  />
                  <Field label="Город" name="city" value={customer.city} onChange={patch} required />
                  <fieldset>
                    <legend className="text-[11px] tracking-[0.2em] text-white/45 uppercase">
                      Получение
                    </legend>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <FulfillmentChoice
                        value="atelier"
                        current={customer.fulfillment}
                        title="Ателье"
                        caption="Примерка 48 ч"
                        onSelect={(value) => patch('fulfillment', value)}
                      />
                      <FulfillmentChoice
                        value="courier"
                        current={customer.fulfillment}
                        title="Курьер"
                        caption="5–9 дней"
                        onSelect={(value) => patch('fulfillment', value)}
                      />
                    </div>
                  </fieldset>
                  {customer.fulfillment === 'courier' && (
                    <Field
                      label="Адрес"
                      name="address"
                      value={customer.address}
                      onChange={patch}
                      required
                    />
                  )}
                  <label className="block text-[11px] tracking-[0.2em] text-white/45 uppercase">
                    Комментарий
                    <textarea
                      name="note"
                      rows={2}
                      value={customer.note}
                      onChange={(event) => patch('note', event.target.value)}
                      className="mt-2 w-full resize-none border-b border-white/15 bg-transparent py-2 text-base font-normal tracking-normal text-white outline-none"
                      placeholder="Рост, предпочтения по длине, время примерки"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={lines.length === 0}
                    className="h-12 w-full rounded-full bg-white text-[11px] tracking-[0.24em] text-black uppercase disabled:opacity-40"
                  >
                    Подтвердить заказ
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  name: keyof OrderCustomer
  value: string
  onChange: (name: keyof OrderCustomer, value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block text-[11px] tracking-[0.2em] text-white/45 uppercase">
      {label}
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="mt-2 h-12 w-full border-b border-white/15 bg-transparent text-base font-normal tracking-normal text-white outline-none"
      />
    </label>
  )
}

function FulfillmentChoice({
  value,
  current,
  title,
  caption,
  onSelect,
}: {
  value: Fulfillment
  current: Fulfillment
  title: string
  caption: string
  onSelect: (value: Fulfillment) => void
}) {
  const active = value === current
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-2xl px-4 py-3 text-left ${active ? 'bg-white text-black' : 'bg-white/8 text-white/70'}`}
    >
      <p className="text-[11px] tracking-[0.18em] uppercase">{title}</p>
      <p className={`mt-1 text-[11px] ${active ? 'text-black/50' : 'text-white/40'}`}>{caption}</p>
    </button>
  )
}

function Receipt({ order, onClose }: { order: Order; onClose: () => void }) {
  const when = useMemo(
    () =>
      new Intl.DateTimeFormat('ru', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(order.createdAt)),
    [order.createdAt],
  )

  return (
    <div className="p-6 md:p-10">
      <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">Заказ принят</p>
      <h2 className="mt-3 text-3xl font-light tracking-[-0.03em] md:text-5xl">{order.id}</h2>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
        {order.customer.fulfillment === 'atelier'
          ? `Примерка забронирована. Консьерж напишет на ${order.customer.email} в течение 48 часов.`
          : `Курьер везёт в ${order.customer.city}. Срок 5–9 дней. Трекинг придёт на ${order.customer.email}.`}
      </p>
      <p className="mt-2 text-[11px] tracking-[0.16em] text-white/35 uppercase">{when}</p>

      <div className="mt-8 space-y-3">
        {order.items.map((item) => (
          <div key={item.key} className="flex justify-between gap-4 text-sm">
            <span>
              {item.name} · {item.size} ×{item.qty}
            </span>
            <span className="text-white/70">{formatPrice(item.unitPrice * item.qty)}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-sm">
        <span className="text-white/50">Итого</span>
        <span>{formatPrice(order.subtotal, order.currency)}</span>
      </div>
      <dl className="mt-6 grid gap-2 text-sm text-white/50">
        <div className="flex justify-between gap-4">
          <dt>Клиент</dt>
          <dd className="text-white">{order.customer.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Контакт</dt>
          <dd className="text-right text-white">{order.customer.phone}</dd>
        </div>
        {order.customer.fulfillment === 'courier' && (
          <div className="flex justify-between gap-4">
            <dt>Адрес</dt>
            <dd className="text-right text-white">
              {order.customer.city}, {order.customer.address}
            </dd>
          </div>
        )}
      </dl>
      <button
        type="button"
        onClick={onClose}
        className="glass-pill mt-8 inline-flex h-12 items-center rounded-full px-8 text-[11px] tracking-[0.22em] uppercase"
      >
        Вернуться в дом
      </button>
    </div>
  )
}
