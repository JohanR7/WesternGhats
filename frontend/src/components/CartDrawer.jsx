import { useState } from 'react'
import { useCart } from '../context/CartContext'

function formatPrice(n) {
  return `₹${n.toLocaleString('en-IN')}`
}

function CartView() {
  const { items, updateQty, removeItem, totalPrice, setView } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <>
      <div className="cart-items">
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} className="cart-item-img" />
            <div className="cart-item-body">
              <h5>{item.name}</h5>
              <p className="cart-item-size">{item.size}</p>
              <div className="cart-item-row">
                <div className="cart-qty">
                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <span className="cart-item-price">{formatPrice(item.price * item.qty)}</span>
              </div>
            </div>
            <button type="button" className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total-row">
          <span>Total</span>
          <span className="cart-total-val">{formatPrice(totalPrice)}</span>
        </div>
        <button type="button" className="btn-gold cart-checkout-btn" onClick={() => setView('checkout')}>
          Checkout
        </button>
      </div>
    </>
  )
}

function CheckoutView() {
  const { items, totalPrice, setView } = useCart()
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '', address: '' })
  const [placed, setPlaced] = useState(false)

  const isValid =
    form.name.trim() && form.whatsapp.trim() && form.email.trim() && form.address.trim()

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handlePlaceOrder() {
    if (!isValid) return
    setPlaced(true)
  }

  if (placed) {
    return (
      <div className="cart-empty">
        <p>
          Thank you, {form.name.split(' ')[0]}. Your order request has been noted — we&rsquo;ll
          reach out on WhatsApp at {form.whatsapp} to confirm.
        </p>
      </div>
    )
  }

  return (
    <>
      <button type="button" className="cart-back-btn" onClick={() => setView('cart')}>
        ← Back to cart
      </button>
      <div className="checkout-summary">
        {items.map((item) => (
          <div className="checkout-summary-row" key={item.id}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="cart-total-row">
          <span>Total</span>
          <span className="cart-total-val">{formatPrice(totalPrice)}</span>
        </div>
      </div>
      <div className="checkout-form">
        <label className="checkout-field">
          <span>Name</span>
          <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Your full name" />
        </label>
        <label className="checkout-field">
          <span>WhatsApp Number</span>
          <input type="tel" value={form.whatsapp} onChange={handleChange('whatsapp')} placeholder="+91 XXXXX XXXXX" />
        </label>
        <label className="checkout-field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" />
        </label>
        <label className="checkout-field">
          <span>Delivery Address</span>
          <textarea
            value={form.address}
            onChange={handleChange('address')}
            placeholder="House / Street, City, State, PIN code"
            rows={3}
          />
        </label>
      </div>
      <button type="button" className="btn-gold cart-checkout-btn" disabled={!isValid} onClick={handlePlaceOrder}>
        Place Order
      </button>
    </>
  )
}

export default function CartDrawer() {
  const { isOpen, isMinimized, view, totalItems, closeCart, minimizeCart } = useCart()
  const open = isOpen && !isMinimized

  return (
    <>
      <div className={`cart-backdrop${open ? ' open' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="cart-drawer-header">
          <h4>{view === 'checkout' ? 'Checkout' : `Your Cart${totalItems ? ` (${totalItems})` : ''}`}</h4>
          <div className="cart-drawer-controls">
            <button type="button" onClick={minimizeCart} aria-label="Minimize cart">
              −
            </button>
            <button type="button" onClick={closeCart} aria-label="Close cart">
              ×
            </button>
          </div>
        </div>
        <div className="cart-drawer-body">{view === 'checkout' ? <CheckoutView /> : <CartView />}</div>
      </aside>
    </>
  )
}
