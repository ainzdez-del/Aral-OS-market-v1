import { useState, type FormEvent } from 'react'

export function Atelier() {
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section id="atelier" className="relative overflow-hidden py-24 md:py-32">
      <div className="mesh-liquid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center md:px-8">
        <div>
          <p className="text-[11px] tracking-[0.32em] text-white/45 uppercase">Private drop · CRM</p>
          <h2 className="mt-3 text-4xl font-light tracking-[-0.04em] md:text-6xl">
            Лист ателье
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
            Роскошь не скидка — доступ. Кто в листе, видит капсулу за 72 часа до сайта и бронирует
            примерку. Это не рассылка: это очередь в дом.
          </p>
        </div>
        <form onSubmit={onSubmit} className="glass rounded-[28px] p-6 md:p-8">
          {sent ? (
            <p className="text-lg font-light">Вы в очереди. Письмо придёт с кодом примерки.</p>
          ) : (
            <>
              <label className="block text-[11px] tracking-[0.2em] text-white/45 uppercase">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 h-12 w-full border-b border-white/15 bg-transparent text-base outline-none"
                  placeholder="you@atelier.com"
                />
              </label>
              <label className="mt-6 block text-[11px] tracking-[0.2em] text-white/45 uppercase">
                Город
                <input
                  required
                  name="city"
                  className="mt-2 h-12 w-full border-b border-white/15 bg-transparent text-base outline-none"
                  placeholder="Алматы / Дубай / Москва"
                />
              </label>
              <button
                type="submit"
                className="mt-8 h-12 w-full rounded-full bg-white text-[11px] tracking-[0.24em] text-black uppercase"
              >
                Запросить доступ
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
