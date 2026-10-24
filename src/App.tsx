import { useEffect, useState } from 'react'
import { Atelier } from './components/Atelier'
import { BentoCollection } from './components/BentoCollection'
import { CartDrawer } from './components/CartDrawer'
import { Checkout } from './components/Checkout'
import { FabricTech } from './components/FabricTech'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Lookbook } from './components/Lookbook'
import { ProfileOverlay, SearchOverlay } from './components/Overlays'
import { ProductModal } from './components/ProductModal'
import { CartProvider, useCart } from './context/CartContext'
import { OrderProvider, useOrders } from './context/OrderContext'
import type { Look, Product } from './data/catalog'

export default function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <Store />
      </OrderProvider>
    </CartProvider>
  )
}

function Store() {
  const { open: cartOpen } = useCart()
  const { checkoutOpen } = useOrders()
  const [look, setLook] = useState<Look | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState(false)
  const [profile, setProfile] = useState(false)

  useEffect(() => {
    if (cartOpen || checkoutOpen) {
      setLook(null)
      setProduct(null)
    }
  }, [cartOpen, checkoutOpen])

  return (
    <div className="min-h-svh bg-[#030303] text-white">
      <Header onSearch={() => setSearch(true)} onProfile={() => setProfile(true)} />
      <main>
        <Hero />
        <BentoCollection onSelect={setProduct} />
        <FabricTech />
        <Lookbook onOpen={setLook} />
        <Atelier />
      </main>
      <Footer />
      <CartDrawer />
      <Checkout />
      <ProductModal
        look={look}
        product={product}
        onClose={() => {
          setLook(null)
          setProduct(null)
        }}
      />
      <SearchOverlay
        open={search}
        onClose={() => setSearch(false)}
        onPick={setProduct}
      />
      <ProfileOverlay open={profile} onClose={() => setProfile(false)} />
    </div>
  )
}
