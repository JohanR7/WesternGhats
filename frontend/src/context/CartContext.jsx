import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [view, setView] = useState('cart')

  function addItem(product) {
    const isFirstAdd = items.length === 0
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...product, qty: 1 }]
    })
    // Only pop the drawer open automatically the first time — after that the
    // shopper knows where the cart is (via the badge) and shouldn't be
    // interrupted while browsing more products.
    if (isFirstAdd) {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clearCart() {
    setItems([])
    setView('cart')
  }

  function updateQty(id, qty) {
    if (qty < 1) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  function openCart() {
    setIsOpen(true)
    setIsMinimized(false)
  }

  function closeCart() {
    setIsOpen(false)
    setView('cart')
  }

  function minimizeCart() {
    setIsMinimized(true)
  }

  function expandCart() {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items])

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    isMinimized,
    view,
    setView,
    openCart,
    closeCart,
    minimizeCart,
    expandCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
