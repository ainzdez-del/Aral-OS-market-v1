export function Footer() {
  return (
    <footer className="border-t border-white/8 px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-[13px] tracking-[0.32em]">ARAL</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
            Дом, который продаёт форму, а не сезон. Доставка 5–9 дней. Примерка в ателье по записи.
            Возврат 14 дней.
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/50">
          <p className="text-[11px] tracking-[0.22em] text-white/35 uppercase">Дом</p>
          <a href="#collection">Коллекция</a>
          <br />
          <a href="#fabric">Ткань</a>
          <br />
          <a href="#lookbook">Lookbook</a>
        </div>
        <div className="space-y-2 text-sm text-white/50">
          <p className="text-[11px] tracking-[0.22em] text-white/35 uppercase">Сервис</p>
          <p>Доставка и возврат</p>
          <p>Размерная сетка</p>
          <p>Консьерж: concierge@aral.shop</p>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-6xl text-[11px] tracking-[0.18em] text-white/25 uppercase">
        © {new Date().getFullYear()} ARAL Shop · Atelier 01
      </p>
    </footer>
  )
}
