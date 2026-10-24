import { Search, ShoppingBag, User } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCart } from '../context/CartContext'

export function Header({
  onSearch,
  onProfile,
}: {
  onSearch: () => void
  onProfile: () => void
}) {
  const { count, setOpen } = useCart()

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 md:px-5">
        <a href="#top" className="text-[13px] font-medium tracking-[0.28em]">
          ARAL
        </a>
        <div className="hidden items-center gap-7 text-[11px] tracking-[0.22em] text-white/70 uppercase md:flex">
          <a href="#collection" className="transition-colors hover:text-white">
            Коллекция
          </a>
          <a href="#fabric" className="transition-colors hover:text-white">
            Ткань
          </a>
          <a href="#lookbook" className="transition-colors hover:text-white">
            Lookbook
          </a>
          <a href="#atelier" className="transition-colors hover:text-white">
            Ателье
          </a>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Поиск" onClick={onSearch}>
            <Search size={16} strokeWidth={1.4} />
          </IconButton>
          <IconButton label="Профиль ателье" onClick={onProfile}>
            <User size={16} strokeWidth={1.4} />
          </IconButton>
          <IconButton label="Корзина" onClick={() => setOpen(true)}>
            <span className="relative">
              <ShoppingBag size={16} strokeWidth={1.4} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-white px-0.5 text-[8px] font-medium text-black">
                  {count}
                </span>
              )}
            </span>
          </IconButton>
        </div>
      </nav>
    </header>
  )
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/8 hover:text-white"
    >
      {children}
    </button>
  )
}
