import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { productById, type Size } from '../data/catalog'
import { loadCartLines, saveCartLines } from '../data/orders'

export type CartLine = {
  key: string
  productId: string
  size: Size
  qty: number
}

type CartContextValue = {
  lines: CartLine[]
  open: boolean
  setOpen: (open: boolean) => void
  add: (productId: string, size: Size) => void
  remove: (key: string) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadCartLines())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    saveCartLines(lines)
  }, [lines])

  const value = useMemo(() => {
    const add = (productId: string, size: Size) => {
      const key = `${productId}-${size}`
      setLines((current) => {
        const existing = current.find((line) => line.key === key)
        if (existing) {
          return current.map((line) =>
            line.key === key ? { ...line, qty: line.qty + 1 } : line,
          )
        }
        return [...current, { key, productId, size, qty: 1 }]
      })
      setOpen(true)
    }

    const remove = (key: string) => {
      setLines((current) => current.filter((line) => line.key !== key))
    }

    const clear = () => setLines([])

    const total = lines.reduce((sum, line) => {
      const product = productById(line.productId)
      return sum + (product?.price ?? 0) * line.qty
    }, 0)

    const count = lines.reduce((sum, line) => sum + line.qty, 0)

    return { lines, open, setOpen, add, remove, clear, total, count }
  }, [lines, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
