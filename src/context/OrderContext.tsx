import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useCart } from './CartContext'
import {
  createOrder,
  loadOrders,
  saveOrders,
  type Order,
  type OrderCustomer,
} from '../data/orders'

type OrderContextValue = {
  orders: Order[]
  lastOrder: Order | null
  checkoutOpen: boolean
  setCheckoutOpen: (open: boolean) => void
  placeOrder: (customer: OrderCustomer) => Order | null
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const { lines, clear, setOpen: setCartOpen } = useCart()
  const [orders, setOrders] = useState<Order[]>(() => loadOrders())
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const value = useMemo(() => {
    const placeOrder = (customer: OrderCustomer) => {
      if (lines.length === 0) return null
      const order = createOrder(lines, customer)
      const next = [order, ...orders]
      setOrders(next)
      saveOrders(next)
      clear()
      setCartOpen(false)
      return order
    }

    return {
      orders,
      lastOrder: orders[0] ?? null,
      checkoutOpen,
      setCheckoutOpen,
      placeOrder,
    }
  }, [lines, orders, checkoutOpen, clear, setCartOpen])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used inside OrderProvider')
  return ctx
}
