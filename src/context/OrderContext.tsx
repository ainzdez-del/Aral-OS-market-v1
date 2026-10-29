import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useCart } from './CartContext'
import { createOrder, type Order, type OrderCustomer } from '../data/orders'
import { supabase } from '../lib/supabase'

type OrderContextValue = {
  orders: Order[]
  lastOrder: Order | null
  checkoutOpen: boolean
  setCheckoutOpen: (open: boolean) => void
  placeOrder: (customer: OrderCustomer) => Promise<Order | null>
}

type OrderRow = {
  order_number: string
  created_at: string
  status: string
  customer: OrderCustomer
  items: Order['items']
  subtotal: number | string
  currency: string
}

const OrderContext = createContext<OrderContextValue | null>(null)

function mapOrder(row: OrderRow): Order {
  return {
    id: row.order_number,
    createdAt: row.created_at,
    status: row.status as Order['status'],
    customer: row.customer,
    items: row.items,
    subtotal: Number(row.subtotal),
    currency: row.currency || 'UZS',
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { lines, clear, setOpen: setCartOpen } = useCart()
  const [orders, setOrders] = useState<Order[]>([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    let active = true

    async function loadUserOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!active || !user) {
        if (active) setOrders([])
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select(
          'order_number, created_at, status, customer, items, subtotal, currency',
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        console.error('Не удалось загрузить историю заказов:', error.message)
        return
      }

      setOrders(((data ?? []) as OrderRow[]).map(mapOrder))
    }

    void loadUserOrders()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadUserOrders()
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => {
    const placeOrder = async (
      customer: OrderCustomer,
    ): Promise<Order | null> => {
      if (lines.length === 0) return null

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error('Сначала войди в аккаунт, чтобы оформить заказ.')
      }

      const order = createOrder(lines, customer)

      const orderToSave = {
        order_number: order.id,
        user_id: user.id,
        status: order.status,
        customer,
        items: order.items,
        subtotal: order.subtotal,
        currency: 'UZS',
      }

      const { data, error } = await supabase
        .from('orders')
        .insert(orderToSave)
        .select(
          'order_number, created_at, status, customer, items, subtotal, currency',
        )
        .single()

      if (error) {
        throw new Error(`Не удалось сохранить заказ: ${error.message}`)
      }

      const savedOrder = mapOrder(data as OrderRow)

      setOrders((current) => [savedOrder, ...current])
      clear()
      setCartOpen(false)

      return savedOrder
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

  if (!ctx) {
    throw new Error('useOrders must be used inside OrderProvider')
  }

  return ctx
}
