
import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type ProductRow = {
  id: string
  name: string
  slug: string | null
  description: string | null
  image_url: string | null
  price: number | null
  compare_at_price: number | null
  currency: string | null
  line: string | null
  is_published: boolean
  badge: string | null
  hover_image: string | null
  span: string | null
  story: string | null
  fabric: string | null
}

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  image_url: '',
  price: '',
  compare_at_price: '',
  line: 'Essential',
  badge: '',
  hover_image: '',
  span: 'md:col-span-2',
  story: '',
  fabric: '',
  is_published: true,
}

export function AdminPanel() {
  const [sessionReady, setSessionReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [products, setProducts] = useState<ProductRow[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function checkAccess() {
    setSessionReady(false)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setIsAdmin(false)
      setUserEmail('')
      setSessionReady(true)
      return
    }

    setUserEmail(user.email ?? '')

    const { data, error } = await supabase.rpc('is_admin')

    setIsAdmin(!error && data === true)
    setSessionReady(true)
  }

  async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(`Не удалось загрузить товары: ${error.message}`)
      return
    }

    setProducts((data ?? []) as ProductRow[])
  }

  useEffect(() => {
    let active = true

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!active) return

      if (!user) {
        setSessionReady(true)
        return
      }

      setUserEmail(user.email ?? '')

      const { data, error } = await supabase.rpc('is_admin')

      if (!active) return

      const allowed = !error && data === true
      setIsAdmin(allowed)
      setSessionReady(true)

      if (allowed) {
        const { data: rows, error: loadError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (!active) return

        if (loadError) {
          setMessage(`Ошибка загрузки: ${loadError.message}`)
        } else {
          setProducts((rows ?? []) as ProductRow[])
        }
      }
    }

    void init()

    return () => {
      active = false
    }
  }, [])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setMessage(`Ошибка входа: ${error.message}`)
      setLoading(false)
      return
    }

    await checkAccess()

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.rpc('is_admin')

      if (data === true) {
        await loadProducts()
        setMessage('Доступ администратора подтверждён.')
      } else {
        setMessage('У этого аккаунта нет прав администратора.')
      }
    }

    setLoading(false)
  }

  function startEdit(product: ProductRow) {
    setEditingId(product.id)
    setForm({
      name: product.name ?? '',
      slug: product.slug ?? '',
      description: product.description ?? '',
      image_url: product.image_url ?? '',
      price: product.price == null ? '' : String(product.price),
      compare_at_price: product.compare_at_price == null ? '' : String(product.compare_at_price),
      line: product.line ?? 'Essential',
      badge: product.badge ?? '',
      hover_image: product.hover_image ?? '',
      span: product.span ?? 'md:col-span-2',
      story: product.story ?? '',
      fabric: product.fabric ?? '',
      is_published: product.is_published,
    })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isAdmin) {
      setMessage('Нет прав администратора.')
      return
    }

    const price = Number(form.price)

    if (!form.name.trim() || !form.price.trim() || !Number.isFinite(price) || price < 0) {
      setMessage('Укажи название товара и корректную цену.')
      return
    }

    setLoading(true)
    setMessage('')

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || form.name.trim().toLowerCase()
        .replace(/[^a-z0-9а-яё]+/gi, '-')
        .replace(/^-|-$/g, ''),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      price,
      compare_at_price: form.compare_at_price.trim()
        ? Number(form.compare_at_price)
        : null,
      currency: 'UZS',
      line: form.line.trim(),
      badge: form.badge.trim() || null,
      hover_image: form.hover_image.trim() || null,
      span: form.span,
      story: form.story.trim(),
      fabric: form.fabric.trim(),
      is_published: form.is_published,
      updated_at: new Date().toISOString(),
    }

    const result = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload)

    if (result.error) {
      setMessage(`Не удалось сохранить: ${result.error.message}`)
    } else {
      setMessage(editingId ? 'Товар обновлён.' : 'Товар добавлен.')
      setForm(emptyForm)
      setEditingId(null)
      await loadProducts()
    }

    setLoading(false)
  }

  async function togglePublished(product: ProductRow) {
    if (!isAdmin) return

    const { error } = await supabase
      .from('products')
      .update({
        is_published: !product.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product.id)

    if (error) {
      setMessage(`Не удалось изменить публикацию: ${error.message}`)
    } else {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, is_published: !item.is_published }
            : item,
        ),
      )
      setMessage(product.is_published ? 'Товар скрыт из каталога.' : 'Товар опубликован.')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAdmin(false)
    setUserEmail('')
    setProducts([])
    setMessage('Вы вышли из аккаунта.')
  }

  if (!sessionReady) {
    return <main className="min-h-screen bg-[#030303] p-8 text-white">Проверяем доступ…</main>
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/30'

  return (
    <main className="min-h-screen bg-[#030303] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">ARAL OS · CONTROL</p>
            <h1 className="mt-2 text-3xl font-light sm:text-4xl">Управление магазином</h1>
            <p className="mt-2 text-sm text-white/50">Каталог · цены в сумах · публикации</p>
          </div>

          {isAdmin && (
            <button onClick={() => void handleLogout()} className="rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/10">
              Выйти
            </button>
          )}
        </div>

        {!isAdmin ? (
          <section className="max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl">Вход администратора</h2>
            <p className="mt-2 text-sm text-white/50">Войди в свой аккаунт ARAL Shop.</p>

            <form onSubmit={(event) => void handleLogin(event)} className="mt-6 space-y-4">
              <input className={inputClass} type="email" required autoComplete="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <input className={inputClass} type="password" required autoComplete="current-password" placeholder="Пароль" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button disabled={loading} className="w-full rounded-full bg-white py-3 text-sm font-medium text-black disabled:opacity-50">
                {loading ? 'Проверяем…' : 'Войти'}
              </button>
            </form>
          </section>
        ) : (
          <>
            <p className="mb-6 text-sm text-white/50">Вход выполнен: {userEmail}</p>

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
              <h2 className="text-xl">{editingId ? 'Редактировать товар' : 'Добавить товар'}</h2>

              <form onSubmit={(event) => void handleSave(event)} className="mt-5 grid gap-4 sm:grid-cols-2">
                <input className={inputClass} required placeholder="Название товара *" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <input className={inputClass} placeholder="Slug (например aral-tee)" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
                <input className={inputClass} required type="number" min="0" step="1000" placeholder="Цена в сумах *" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
                <input className={inputClass} type="number" min="0" step="1000" placeholder="Старая цена (необязательно)" value={form.compare_at_price} onChange={(event) => setForm({ ...form, compare_at_price: event.target.value })} />
                <input className={inputClass} placeholder="Линия / коллекция" value={form.line} onChange={(event) => setForm({ ...form, line: event.target.value })} />
                <input className={inputClass} placeholder="Значок (например NEW)" value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} />
                <input className={`${inputClass} sm:col-span-2`} placeholder="URL главного изображения" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
                <input className={`${inputClass} sm:col-span-2`} placeholder="URL второго изображения (необязательно)" value={form.hover_image} onChange={(event) => setForm({ ...form, hover_image: event.target.value })} />
                <textarea className={`${inputClass} sm:col-span-2`} rows={3} placeholder="Описание товара" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                <textarea className={inputClass} rows={3} placeholder="История / story" value={form.story} onChange={(event) => setForm({ ...form, story: event.target.value })} />
                <textarea className={inputClass} rows={3} placeholder="Материал / fabric" value={form.fabric} onChange={(event) => setForm({ ...form, fabric: event.target.value })} />

                <label className="flex items-center gap-3 text-sm text-white/70 sm:col-span-2">
                  <input type="checkbox" checked={form.is_published} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} />
                  Опубликовать товар сразу
                </label>

                <div className="flex flex-wrap gap-3 sm:col-span-2">
                  <button disabled={loading} className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-50">
                    {loading ? 'Сохраняем…' : editingId ? 'Сохранить изменения' : 'Добавить товар'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }} className="rounded-full border border-white/15 px-6 py-3 text-sm">
                      Отмена
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl">Товары ({products.length})</h2>
                <button onClick={() => void loadProducts()} className="text-sm text-white/60 underline underline-offset-4">Обновить</button>
              </div>

              <div className="space-y-3">
                {products.map((product) => (
                  <article key={product.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
                    {product.image_url && (
                      <img src={product.image_url} alt="" className="h-20 w-20 rounded-xl object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="mt-1 text-sm text-white/50">{Number(product.price ?? 0).toLocaleString('ru-RU')} сум</p>
                      <p className="mt-1 text-xs text-white/40">{product.is_published ? 'Опубликован' : 'Скрыт'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => startEdit(product)} className="rounded-full border border-white/15 px-4 py-2 text-sm">Изменить</button>
                      <button onClick={() => void togglePublished(product)} className="rounded-full border border-white/15 px-4 py-2 text-sm">
                        {product.is_published ? 'Скрыть' : 'Опубликовать'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {message && <p role="status" className="mt-6 break-words text-sm text-white/70">{message}</p>}

        <a href="/" className="mt-8 inline-block text-sm text-white/40 underline underline-offset-4">Вернуться в магазин</a>
      </div>
    </main>
  )
}
