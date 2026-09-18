import { useCart } from '../context/CartContext'

export default function CartButton() {
  const { totalItems, expandCart, isOpen, isMinimized } = useCart()

  if (isOpen && !isMinimized) return null

  return (
    <button type="button" className="cart-fab" onClick={expandCart} aria-label="Open cart">
      <svg viewBox="0 0 24 24" className="cart-fab-icon">
        <path d="M6 6h15l-1.5 9h-12z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6 6 5 3H2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9.5" cy="19.5" r="1.5" fill="currentColor" />
        <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" />
      </svg>
      {totalItems > 0 && <span className="cart-fab-badge">{totalItems}</span>}
    </button>
  )
}
