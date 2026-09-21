import { useState } from 'react'

const API = 'http://localhost:3002'

/* ── helpers ─────────────────────────────────────────────── */
const STATUS_META = {
  prebooked:             { label: 'Pre-booked',           color: '#7c6f4a', bg: 'rgba(124,111,74,0.15)',  icon: '📋' },
  prepaid:               { label: 'Pre-booking Paid',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '✅' },
  awaiting_final_payment:{ label: 'Awaiting Final Payment',color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: '💳' },
  remaining_paid:        { label: 'Fully Paid',           color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: '🎉' },
  delivered:             { label: 'Delivered',            color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: '📦' },
  cancelled:             { label: 'Cancelled',            color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: '❌' },
}

const DELIVERY_STEPS = [
  'prebooked', 'order_confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered',
]
const DELIVERY_LABEL = {
  prebooked:        'Pre-booked',
  order_confirmed:  'Order Confirmed',
  processing:       'Processing',
  shipped:          'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
}
const DELIVERY_ICON = {
  prebooked:        '📋',
  order_confirmed:  '✅',
  processing:       '⚙️',
  shipped:          '🚚',
  out_for_delivery: '📍',
  delivered:        '📦',
}

function PaymentTimeline({ order }) {
  const prebookPaid   = ['prepaid','awaiting_final_payment','remaining_paid','delivered'].includes(order.status)
  const finalPaid     = ['remaining_paid','delivered'].includes(order.status)
  const awaitingFinal = order.status === 'awaiting_final_payment'

  const prebookAmt  = Number(order.prebooking_amount)
  const remainingAmt = Number(order.remaining_amount)
  // Actual total = what's in DB now (may differ from original total_amount if admin edited balance)
  const actualTotal = prebookAmt + remainingAmt
  // Amount actually collected so far
  const collectedSoFar = finalPaid ? actualTotal : prebookPaid ? prebookAmt : 0

  return (
    <div className="trk-payment-timeline">
      <div className={`trk-pay-step ${prebookPaid ? 'done' : 'pending'}`}>
        <span className="trk-pay-dot">{prebookPaid ? '✓' : '○'}</span>
        <div>
          <div className="trk-pay-label">Pre-booking</div>
          <div className="trk-pay-amt">₹{prebookAmt.toFixed(2)}</div>
        </div>
      </div>
      <div className="trk-pay-line" />
      <div className={`trk-pay-step ${awaitingFinal ? 'awaiting' : finalPaid ? 'done' : 'pending'}`}>
        <span className="trk-pay-dot">{finalPaid ? '✓' : awaitingFinal ? '!' : '○'}</span>
        <div>
          <div className="trk-pay-label">
            {awaitingFinal ? '⚡ Payment Due' : 'Final Payment'}
          </div>
          <div className="trk-pay-amt">₹{remainingAmt.toFixed(2)}</div>
        </div>
      </div>
      <div className="trk-pay-line" />
      <div className={`trk-pay-step ${finalPaid ? 'done' : 'pending'}`}>
        <span className="trk-pay-dot">{finalPaid ? '✓' : '○'}</span>
        <div>
          <div className="trk-pay-label">
            {finalPaid ? 'Total Paid' : 'Total Due'}
          </div>
          <div className="trk-pay-amt">
            ₹{finalPaid ? collectedSoFar.toFixed(2) : actualTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}


function DeliveryProgress({ deliveryStatus }) {
  const currentIdx = DELIVERY_STEPS.indexOf(deliveryStatus)
  return (
    <div className="trk-delivery-bar">
      {DELIVERY_STEPS.map((step, i) => {
        const done    = i <= currentIdx
        const current = i === currentIdx
        return (
          <div key={step} className="trk-del-step">
            <div className={`trk-del-dot ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
              {done ? (current ? DELIVERY_ICON[step] : '✓') : '·'}
            </div>
            <div className={`trk-del-label ${current ? 'current' : done ? 'done' : ''}`}>
              {DELIVERY_LABEL[step]}
            </div>
            {i < DELIVERY_STEPS.length - 1 && (
              <div className={`trk-del-connector ${i < currentIdx ? 'done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false)
  const statusMeta = STATUS_META[order.status] || { label: order.status, color: '#7a9080', bg: 'rgba(122,144,128,0.1)', icon: '📋' }
  const shortId = order.id.split('-')[0].toUpperCase()
  const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="trk-order-card">
      {/* Header */}
      <div className="trk-order-header" onClick={() => setOpen(o => !o)}>
        <div className="trk-order-id">
          <span className="trk-order-num">Order #{shortId}</span>
          <span className="trk-order-date">{date}</span>
        </div>
        <div className="trk-order-meta">
          <span className="trk-status-badge" style={{ color: statusMeta.color, background: statusMeta.bg }}>
            {statusMeta.icon} {statusMeta.label}
          </span>
          <span className="trk-order-total">₹{Number(order.total_amount).toFixed(2)}</span>
          <span className="trk-toggle">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="trk-order-body">
          {/* Items */}
          <div className="trk-section-label">Items Ordered</div>
          <table className="trk-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.product_name}</td>
                  <td>{item.size || '—'}</td>
                  <td>{item.qty}</td>
                  <td>₹{Number(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Payment */}
          <div className="trk-section-label" style={{ marginTop: 20 }}>Payment Status</div>
          <PaymentTimeline order={order} />

          {/* Payment status info — no payment links on tracking page */}
          {order.status === 'awaiting_final_payment' && (
            <div className="trk-pay-cta">
              <p>⚡ Your items are ready and awaiting your final payment.</p>
              <p style={{ fontSize: '0.75rem', color: '#7a6050', marginTop: 6 }}>
                Check your email for the payment link sent by our team.
              </p>
            </div>
          )}
          {['remaining_paid', 'delivered'].includes(order.status) && (
            <div className="trk-paid-badge">
              ✅ Full payment received
            </div>
          )}

          {/* Delivery */}
          <div className="trk-section-label" style={{ marginTop: 20 }}>Delivery Progress</div>
          <DeliveryProgress deliveryStatus={order.delivery_status} />
        </div>
      )}
    </div>
  )
}

export default function TrackPage() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)   // { customer, orders }
  const [error, setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`${API}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) setResult(data)
      else setError(data.error || 'Something went wrong.')
    } catch {
      setError('Could not reach the server. Please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1a10; }

        .trk-page {
          min-height: 100vh;
          background: radial-gradient(ellipse at 50% 0%, #1a2f1e 0%, #0d1a10 65%);
          font-family: 'Inter', sans-serif;
          padding: 40px 20px 80px;
        }

        /* Header */
        .trk-hero { text-align: center; margin-bottom: 40px; }
        .trk-brand-icon { font-size: 2.4rem; display: block; margin-bottom: 12px; }
        .trk-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 400;
          color: #f5f0e8; letter-spacing: 0.06em;
        }
        .trk-brand-sub { font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: #b8933f; margin-top: 6px; }
        .trk-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-weight: 400; color: #c8b898;
          margin-top: 20px;
        }
        .trk-hero-sub { font-size: 0.78rem; color: #5a7060; margin-top: 6px; }

        /* Search form */
        .trk-form-wrap {
          max-width: 480px; margin: 0 auto 40px;
        }
        .trk-form {
          display: flex; gap: 10px;
        }
        .trk-input {
          flex: 1;
          background: #1a2420;
          border: 1px solid #2a3d30;
          border-radius: 8px;
          padding: 14px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          color: #f5f0e8;
          outline: none;
          transition: border-color 0.2s;
        }
        .trk-input:focus { border-color: #b8933f; }
        .trk-input::placeholder { color: #3a5040; }
        .trk-btn {
          padding: 14px 22px;
          background: linear-gradient(135deg, #b8933f, #d4aa5a);
          color: #1a1208;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .trk-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(184,147,63,0.3);
        }
        .trk-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .trk-error {
          margin-top: 12px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 6px;
          font-size: 0.8rem; color: #ef4444;
          text-align: center;
        }

        /* Customer greeting */
        .trk-greeting {
          max-width: 680px; margin: 0 auto 24px;
          display: flex; align-items: center; gap: 14px;
          background: rgba(184,147,63,0.08);
          border: 1px solid rgba(184,147,63,0.2);
          border-radius: 10px;
          padding: 16px 20px;
        }
        .trk-greeting-icon { font-size: 1.8rem; }
        .trk-greeting-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; color: #f5f0e8;
        }
        .trk-greeting-count { font-size: 0.75rem; color: #7a9080; margin-top: 2px; }

        /* Order cards */
        .trk-orders { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }

        .trk-order-card {
          background: #1a2420;
          border: 1px solid #2a3d30;
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .trk-order-card:hover { border-color: #3a5040; }

        .trk-order-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px;
          cursor: pointer;
          user-select: none;
        }
        .trk-order-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; color: #f5f0e8;
        }
        .trk-order-date { font-size: 0.72rem; color: #5a7060; margin-left: 10px; }
        .trk-order-meta { display: flex; align-items: center; gap: 12px; }

        .trk-status-badge {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
          padding: 4px 10px; border-radius: 20px;
        }
        .trk-order-total {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; color: #b8933f; font-weight: 500;
        }
        .trk-toggle { font-size: 0.65rem; color: #3a5040; }

        /* Expanded body */
        .trk-order-body {
          padding: 0 20px 20px;
          border-top: 1px solid #1e2e24;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:none } }

        .trk-section-label {
          font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: #4a6050; margin: 16px 0 8px;
        }

        /* Items table */
        .trk-items-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
        .trk-items-table th {
          text-align: left; padding: 6px 8px;
          color: #4a6050; font-weight: 500; font-size: 0.68rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          border-bottom: 1px solid #1e2e24;
        }
        .trk-items-table td {
          padding: 8px 8px; color: #c8b898;
          border-bottom: 1px solid #161e1a;
        }
        .trk-items-table tr:last-child td { border-bottom: none; }

        /* Payment timeline */
        .trk-payment-timeline {
          display: flex; align-items: center; gap: 0;
          padding: 12px 0;
        }
        .trk-pay-step {
          display: flex; align-items: center; gap: 8px;
          flex: 1;
        }
        .trk-pay-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
          border: 1px solid #2a3d30;
          background: #111d14; color: #3a5040;
        }
        .trk-pay-step.done .trk-pay-dot { background: rgba(34,197,94,0.15); color: #22c55e; border-color: #22c55e; }
        .trk-pay-step.awaiting .trk-pay-dot { background: rgba(239,68,68,0.15); color: #ef4444; border-color: #ef4444; }
        .trk-pay-label { font-size: 0.72rem; color: #5a7060; }
        .trk-pay-step.done .trk-pay-label { color: #7a9080; }
        .trk-pay-step.awaiting .trk-pay-label { color: #ef4444; font-weight: 600; }
        .trk-pay-amt { font-size: 0.82rem; color: #b8933f; font-weight: 600; margin-top: 2px; }
        .trk-pay-line { flex: 1; height: 1px; background: #2a3d30; margin: 0 8px; max-width: 40px; }

        /* Payment info / status boxes */
        .trk-pay-cta {
          margin-top: 14px;
          padding: 14px 16px;
          background: rgba(245,158,11,0.06);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 8px;
          text-align: center;
        }
        .trk-pay-cta p { font-size: 0.82rem; color: #c8a060; margin-bottom: 0; }

        .trk-paid-badge {
          margin-top: 14px;
          padding: 10px 16px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 8px;
          text-align: center;
          font-size: 0.82rem;
          color: #22c55e;
          font-weight: 600;
          letter-spacing: 0.03em;
        }


        /* Delivery progress */
        .trk-delivery-bar {
          display: flex; align-items: flex-start;
          padding: 8px 0 4px;
          overflow-x: auto;
          position: relative;
        }
        .trk-del-step {
          display: flex; flex-direction: column; align-items: center;
          position: relative; flex: 1; min-width: 70px;
        }
        .trk-del-dot {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid #2a3d30;
          background: #111d14;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; color: #2a3d30;
          z-index: 1; position: relative;
          transition: all 0.3s;
        }
        .trk-del-dot.done { border-color: #3a5040; background: rgba(58,80,64,0.3); color: #7a9080; }
        .trk-del-dot.current {
          border-color: #b8933f;
          background: rgba(184,147,63,0.2);
          color: #f5f0e8;
          box-shadow: 0 0 0 4px rgba(184,147,63,0.12);
        }
        .trk-del-label {
          font-size: 0.62rem; text-align: center; margin-top: 6px;
          color: #2a3d30; line-height: 1.3;
        }
        .trk-del-label.done { color: #4a6050; }
        .trk-del-label.current { color: #b8933f; font-weight: 600; }
        .trk-del-connector {
          position: absolute; top: 16px; left: calc(50% + 16px);
          right: calc(-50% + 16px);
          height: 1px; background: #2a3d30;
          z-index: 0;
        }
        .trk-del-connector.done { background: #3a5040; }

        .trk-empty {
          text-align: center; padding: 40px;
          font-size: 0.85rem; color: #3a5040;
        }
      `}</style>

      <div className="trk-page">
        {/* Hero */}
        <div className="trk-hero">
          <span className="trk-brand-icon">🌿</span>
          <div className="trk-brand-name">Western Ghats</div>
          <div className="trk-brand-sub">Heritage Food — Forest Origin</div>
          <div className="trk-hero-title">Track Your Order</div>
          <div className="trk-hero-sub">Enter your email to view order status and delivery progress</div>
        </div>

        {/* Search form */}
        <div className="trk-form-wrap">
          <form className="trk-form" onSubmit={handleSubmit}>
            <input
              className="trk-input"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button className="trk-btn" type="submit" disabled={loading}>
              {loading ? '⏳' : '🔍 Track'}
            </button>
          </form>
          {error && <div className="trk-error">{error}</div>}
        </div>

        {/* Results */}
        {result && (
          <>
            <div className="trk-greeting">
              <span className="trk-greeting-icon">👋</span>
              <div>
                <div className="trk-greeting-name">Hello, {result.customer.name.split(' ')[0]}!</div>
                <div className="trk-greeting-count">
                  {result.orders.length} order{result.orders.length !== 1 ? 's' : ''} found for {result.customer.email}
                </div>
              </div>
            </div>

            <div className="trk-orders">
              {result.orders.length === 0 ? (
                <div className="trk-empty">No orders yet.</div>
              ) : (
                result.orders.map(order => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
