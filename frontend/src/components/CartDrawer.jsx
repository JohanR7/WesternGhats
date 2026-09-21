import { useState } from 'react'
import { useCart } from '../context/CartContext'

const API = 'http://localhost:3002'
const PREBOOKING_PER_ITEM = 99

function formatPrice(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`
}

// ── Cart View ─────────────────────────────────────────────────────────────────
function CartView() {
  const { items, updateQty, removeItem, totalPrice, setView } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty.</p>
      </div>
    )
  }

  const prebookingTotal = items.length * PREBOOKING_PER_ITEM
  const remaining = totalPrice - prebookingTotal

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
                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
                <span className="cart-item-price">{formatPrice(item.price * item.qty)}</span>
              </div>
            </div>
            <button type="button" className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>×</button>
          </div>
        ))}
      </div>

      {/* Prebooking breakdown */}
      <div className="cart-prebook-info">
        <div className="cart-prebook-row">
          <span>Cart Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="cart-prebook-row highlight">
          <span>Pay Now (Pre-booking)</span>
          <span className="prebook-amt">{formatPrice(prebookingTotal)}</span>
        </div>
        <div className="cart-prebook-row muted">
          <span>Balance on Delivery</span>
          <span>{formatPrice(remaining)}</span>
        </div>
        <p className="cart-prebook-note">
          ₹{PREBOOKING_PER_ITEM} pre-booking per unique product. Remaining paid when items are ready.
        </p>
      </div>

      <div className="cart-summary">
        <button type="button" className="btn-gold cart-checkout-btn" onClick={() => setView('checkout')}>
          Pre-book Now — {formatPrice(prebookingTotal)}
        </button>
      </div>
    </>
  )
}

// ── Checkout View ─────────────────────────────────────────────────────────────
function CheckoutView() {
  const { items, totalPrice, setView, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const prebookingTotal = items.length * PREBOOKING_PER_ITEM
  const remaining = totalPrice - prebookingTotal

  const isValid =
    form.name.trim() && form.whatsapp.trim() && form.email.trim() && form.address.trim()

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handlePlaceOrder() {
    if (!isValid || loading) return
    setLoading(true)
    setError('')

    try {
      // Step 1: Create order on backend → get Razorpay order ID
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            whatsapp: form.whatsapp.startsWith('+') ? form.whatsapp : `+91${form.whatsapp.replace(/\D/g, '')}`,
            email: form.email,
            address: form.address,
          },
          items: items.map((i) => ({
            product_id: i.id,
            product_name: i.name,
            size: i.size,
            qty: i.qty,
            unit_price: i.price,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order.')

      // Step 2: Open Razorpay modal
      const options = {
        key: data.key,
        amount: data.prebookingAmount * 100,
        currency: 'INR',
        name: 'Western Ghats',
        description: 'Pre-booking — Heritage Collection',
        image: 'https://raw.githubusercontent.com/azure-2k4/WesternGhatsBrochure/d2edb106ea36ae4d9b6fe6ae23cf4fe9aaed42e4/Jun%2010%2C%202026%2C%2011_58_03%20AM.png',
        order_id: data.razorpayOrderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.whatsapp,
        },
        theme: { color: '#b8933f' },
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch(`${API}/api/payments/verify-prebooking`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed.')

            setSuccess({ name: form.name, whatsapp: form.whatsapp, orderId: data.orderId })
            clearCart()
          } catch (err) {
            setError('Payment received but verification failed. Please contact support.')
          }
          setLoading(false)
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="cart-empty" style={{ flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: '2.5rem' }}>🎉</div>
        <div style={{ textAlign: 'center' }}>
          <strong style={{ color: 'var(--forest)', fontFamily: 'var(--ff-d)', fontSize: '1.2rem' }}>
            Pre-booking Confirmed!
          </strong>
          <p style={{ marginTop: 12, lineHeight: 1.7 }}>
            Thank you, {success.name.split(' ')[0]}!<br />
            You&rsquo;ll receive a WhatsApp confirmation with your invoice at{' '}
            <strong>{success.whatsapp}</strong>.
          </p>
          <p style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-soft)' }}>
            Order ID: #{success.orderId.split('-')[0].toUpperCase()}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <button type="button" className="cart-back-btn" onClick={() => setView('cart')}>
        ← Back to cart
      </button>

      {/* Order summary */}
      <div className="checkout-summary">
        {items.map((item) => (
          <div className="checkout-summary-row" key={item.id}>
            <span>{item.name} × {item.qty}</span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="checkout-prebook-breakdown">
          <div className="checkout-prebook-row total-row">
            <span>Cart Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="checkout-prebook-row pay-now-row">
            <span>⚡ Pay Now (Pre-booking)</span>
            <span className="pay-now-val">{formatPrice(prebookingTotal)}</span>
          </div>
          <div className="checkout-prebook-row balance-row">
            <span>Balance on Delivery</span>
            <span>{formatPrice(remaining)}</span>
          </div>
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
          <textarea value={form.address} onChange={handleChange('address')} placeholder="House / Street, City, State, PIN" rows={3} />
        </label>
      </div>

      {error && <p className="checkout-error">{error}</p>}

      <button
        type="button"
        className="btn-gold cart-checkout-btn"
        disabled={!isValid || loading}
        onClick={handlePlaceOrder}
        style={{ marginTop: 20 }}
      >
        {loading ? 'Processing…' : `Pay ₹${prebookingTotal} to Pre-book`}
      </button>

      <p className="checkout-secure-note">
        🔒 Secured by Razorpay · ₹{PREBOOKING_PER_ITEM} per unique product
      </p>
    </>
  )
}

// ── Drawer Shell ──────────────────────────────────────────────────────────────
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
            <button type="button" onClick={minimizeCart} aria-label="Minimize cart">−</button>
            <button type="button" onClick={closeCart} aria-label="Close cart">×</button>
          </div>
        </div>
        <div className="cart-drawer-body">{view === 'checkout' ? <CheckoutView /> : <CartView />}</div>
      </aside>
    </>
  )
}
