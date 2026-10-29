
import type { Product, Size } from './catalog'

export type Fulfillment = 'atelier' | 'courier'

export type OrderCustomer = {
  name: string
  email: string
  phone: string
  city: string
  address: string
  note: string
  fulfillment: Fulfillment
}

export type OrderItem = {
  key: string
  productId: string
  name: string
  sku: string
  image: string
  size: Size
  qty: number
  unitPrice: number
}

export type OrderStatus =
  | 'confirmed'
  | 'atelier'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type Order = {
  id: string
  createdAt: string
  status: OrderStatus
  customer: OrderCustomer
  items: OrderItem[]
  subtotal: number
  currency: string
}

export type SnapshotLine = {
  key: string
  productId: string
  size: Size
  qty: number
  product?: Product
}

const CART_KEY = 'aral.cart'
const DRAFT_KEY = 'aral.checkout-draft'

export function linesToItems(lines: SnapshotLine[]): OrderItem[] {
  return lines.flatMap((line) => {
    const product = line.product
    if (!product) return []

    return [{
      key: line.key,
      productId: line.productId,
      name: product.name,
      sku: product.sku,
      image: product.image,
      size: line.size,
      qty: line.qty,
      unitPrice: product.price,
    }]
  })
}

export function createOrder(
  lines: SnapshotLine[],
  customer: OrderCustomer,
): Order {
  const items = linesToItems(lines)
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0,
  )
  const stamp = Date.now().toString(36).toUpperCase()

  return {
    id: `ARAL-${stamp}`,
    createdAt: new Date().toISOString(),
    status: customer.fulfillment === 'atelier' ? 'atelier' : 'confirmed',
    customer,
    items,
    subtotal,
    currency: 'UZS',
  }
}

export function loadCartLines(): SnapshotLine[] {
  return readJson<SnapshotLine[]>(CART_KEY, [])
}

export function saveCartLines(lines: SnapshotLine[]) {
  writeJson(CART_KEY, lines)
}

export function loadCheckoutDraft(): Partial<OrderCustomer> | null {
  return readJson<Partial<OrderCustomer> | null>(DRAFT_KEY, null)
}

export function saveCheckoutDraft(draft: Partial<OrderCustomer>) {
  writeJson(DRAFT_KEY, draft)
}

export function formatOrderTotal(order: Order) {
  return `${new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(order.subtotal)} сум`
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Не удалось сохранить данные ARAL:', error)
  }
}
