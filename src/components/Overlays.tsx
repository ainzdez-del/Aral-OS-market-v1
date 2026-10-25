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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleAuth() {
    setMessage('')
    setLoading(true)

    try {
      const { supabase } = await import('../lib/supabase')

      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() } },
        })

        if (error) throw error

        setMessage(
          data.session
            ? 'Регистрация завершена. Вы вошли в аккаунт.'
            : 'Аккаунт создан. Проверьте почту для подтверждения регистрации.',
        )
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) throw error
        setMessage('Вы успешно вошли в аккаунт.')
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Не удалось выполнить операцию.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Закрыть профиль"
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="glass relative max-h-[86svh] w-full max-w-md overflow-y-auto rounded-[28px] p-8">
        <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">
          ARAL OS · ACCOUNT
        </p>

        <h3 className="mt-3 text-3xl font-light tracking-[-0.03em]">
          {mode === 'login' ? 'С возвращением' : 'Создать аккаунт'}
        </h3>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            void handleAuth()
          }}
        >
          {mode === 'signup' && (
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Ваше имя"
              autoComplete="name"
              required
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Пароль (минимум 6 символов)"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            required
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="glass-pill h-12 w-full rounded-full text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
          >
            {loading ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <button
          type="button"
          className="mt-4 text-sm text-white/60 underline underline-offset-4"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login')
            setMessage('')
          }}
        >
          {mode === 'login'
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </button>

        {message && (
          <p role="status" className="mt-4 break-words text-sm text-white/70">
            {message}
          </p>
        )}

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-[11px] tracking-[0.22em] text-white/40 uppercase">
            Заказы
          </p>

          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-white/45">Пока заказов нет.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="border-b border-white/8 pb-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm">{order.id}</p>
                    <p className="text-sm text-white/70">
                      {formatPrice(order.subtotal)}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] text-white/40">
                    {order.items.map((item) => item.name).join(', ')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
