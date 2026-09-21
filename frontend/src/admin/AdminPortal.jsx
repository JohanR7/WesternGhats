import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import './admin.css'

const API = 'http://localhost:3002'

// ── Auth helpers ────────────────────────────────────────────────────────────
function getAuthHeader(creds) {
  return 'Basic ' + btoa(`${creds.username}:${creds.password}`)
}

// ── Tiny reusable components ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="adm-stat-card" style={accent ? { borderTopColor: accent } : {}}>
      <div className="adm-stat-icon">{icon}</div>
      <div className="adm-stat-body">
        <div className="adm-stat-value">{value}</div>
        <div className="adm-stat-label">{label}</div>
        {sub && <div className="adm-stat-sub">{sub}</div>}
      </div>
    </div>
  )
}

const STATUS_COLORS = {
  prebooked: '#b8933f',
  order_confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#f59e0b',
  out_for_delivery: '#f97316',
  delivered: '#22c55e',
  prepaid: '#3b82f6',
  awaiting_final_payment: '#f59e0b',
  remaining_paid: '#22c55e',
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#6b7280'
  return (
    <span className="adm-badge" style={{ background: color + '22', color, borderColor: color + '55' }}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}

function fmt(n) { return `₹${Number(n || 0).toLocaleString('en-IN')}` }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' }

// ── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      onLogin(form)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="adm-login-wrap">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <div className="adm-login-logo">🌿</div>
          <h1>Atmranya</h1>
          <p>Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="adm-login-form">
          <label className="adm-field">
            <span>Username</span>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="admin"
              autoComplete="username"
            />
          </label>
          <label className="adm-field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="adm-error">{error}</p>}
          <button type="submit" className="adm-btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ onLogout }) {
  const location = useLocation()
  const nav = [
    { path: '/western/admin', label: 'Dashboard', icon: '📊' },
    { path: '/western/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/western/admin/customers', label: 'Customers', icon: '👥' },
    { path: '/western/admin/link-requests', label: 'Link Requests', icon: '📧' },
    { path: '/western/admin/notify', label: 'Notify Ready', icon: '📣' },
  ]
  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-brand">
        <span className="adm-sidebar-logo">🌿</span>
        <div>
          <div className="adm-sidebar-title">Atmranya</div>
          <div className="adm-sidebar-sub">Admin</div>
        </div>
      </div>
      <nav className="adm-nav">
        {nav.map(n => (
          <Link
            key={n.path}
            to={n.path}
            className={`adm-nav-item${location.pathname === n.path ? ' active' : ''}`}
          >
            <span className="adm-nav-icon">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
      <button className="adm-logout-btn" onClick={onLogout}>
        <span>⬅</span> Logout
      </button>
    </aside>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ creds }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, { headers: { Authorization: getAuthHeader(creds) } })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [creds])

  if (loading) return <div className="adm-loading">Loading dashboard…</div>
  if (!stats) return <div className="adm-error-page">Failed to load stats.</div>

  const o = stats.overview

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here&rsquo;s your business overview.</p>
      </div>

      <div className="adm-stats-grid">
        <StatCard icon="📦" label="Total Orders" value={o.total_orders} accent="#b8933f" />
        <StatCard icon="💰" label="Total Revenue" value={fmt(o.total_revenue)} accent="#22c55e" />
        <StatCard icon="⚡" label="Pre-bookings Collected" value={fmt(o.total_prebooking_collected)} accent="#3b82f6" sub="paid upfront" />
        <StatCard icon="✅" label="Final Payments" value={fmt(o.total_final_collected)} accent="#8b5cf6" sub="fully paid" />
      </div>

      <div className="adm-row-2">
        {/* Order Status Breakdown */}
        <div className="adm-card">
          <div className="adm-card-header">Order Status</div>
          <div className="adm-status-list">
            {stats.statusBreakdown.map(s => (
              <div key={s.status} className="adm-status-row">
                <StatusBadge status={s.status} />
                <span className="adm-status-count">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Status */}
        <div className="adm-card">
          <div className="adm-card-header">Delivery Status</div>
          <div className="adm-status-list">
            {stats.deliveryBreakdown.map(s => (
              <div key={s.delivery_status} className="adm-status-row">
                <StatusBadge status={s.delivery_status} />
                <span className="adm-status-count">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="adm-card">
          <div className="adm-card-header">Top Customers</div>
          <div className="adm-top-list">
            {(stats.topCustomers || []).map((c, i) => (
              <div key={i} className="adm-top-row">
                <div className="adm-top-rank">#{i + 1}</div>
                <div className="adm-top-info">
                  <div className="adm-top-name">{c.name}</div>
                  <div className="adm-top-sub">{c.order_count} orders · {fmt(c.total_value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="adm-card" style={{ marginTop: 24 }}>
        <div className="adm-card-header">Recent Orders</div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>WhatsApp</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Delivery</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(o => (
                <tr key={o.id}>
                  <td><Link to={`/western/admin/orders/${o.id}`} className="adm-link">#{o.id.split('-')[0].toUpperCase()}</Link></td>
                  <td>{o.customer_name}</td>
                  <td>{o.whatsapp}</td>
                  <td>{fmt(o.total_amount)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td><StatusBadge status={o.delivery_status} /></td>
                  <td>{fmtDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Orders List ───────────────────────────────────────────────────────────────
function OrdersList({ creds }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDelivery, setFilterDelivery] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    let url = `${API}/api/admin/orders?page=${page}&limit=20`
    if (filterStatus) url += `&status=${filterStatus}`
    if (filterDelivery) url += `&delivery_status=${filterDelivery}`
    fetch(url, { headers: { Authorization: getAuthHeader(creds) } })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setTotal(d.total || 0); setLoading(false) })
      .catch(() => setLoading(false))
  }, [creds, page, filterStatus, filterDelivery])

  useEffect(() => { load() }, [load])

  const statuses = ['prebooked', 'prepaid', 'awaiting_final_payment', 'remaining_paid', 'delivered']
  const deliveryStatuses = ['prebooked', 'order_confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h2>Orders <span className="adm-count-badge">{total}</span></h2>
      </div>

      <div className="adm-filters">
        <select className="adm-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
          <option value="">All Payment Status</option>
          {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select className="adm-select" value={filterDelivery} onChange={e => { setFilterDelivery(e.target.value); setPage(1) }}>
          <option value="">All Delivery Status</option>
          {deliveryStatuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <button className="adm-btn-outline" onClick={load}>↻ Refresh</button>
      </div>

      {loading ? <div className="adm-loading">Loading…</div> : (
        <div className="adm-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>WhatsApp</th>
                  <th>Total</th>
                  <th>Pre-paid</th>
                  <th>Balance</th>
                  <th>Payment</th>
                  <th>Delivery</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id.split('-')[0].toUpperCase()}</td>
                    <td>{o.customer_name}</td>
                    <td>{o.whatsapp}</td>
                    <td>{fmt(o.total_amount)}</td>
                    <td className="green-text">{fmt(o.prebooking_amount)}</td>
                    <td className="amber-text">{fmt(o.remaining_amount)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td><StatusBadge status={o.delivery_status} /></td>
                    <td>{fmtDate(o.created_at)}</td>
                    <td>
                      <button className="adm-btn-xs" onClick={() => navigate(`/western/admin/orders/${o.id}`)}>
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="adm-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="adm-btn-outline">← Prev</button>
            <span>Page {page} · {total} orders</span>
            <button disabled={orders.length < 20} onClick={() => setPage(p => p + 1)} className="adm-btn-outline">Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Order Detail ──────────────────────────────────────────────────────────────
function OrderDetail({ creds }) {
  const location = useLocation()
  const orderId = location.pathname.split('/').pop()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(() => {
    fetch(`${API}/api/admin/orders/${orderId}`, { headers: { Authorization: getAuthHeader(creds) } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [creds, orderId])

  useEffect(() => { load() }, [load])

  async function updateDelivery(status) {
    setSaving(true)
    setMsg('')
    const res = await fetch(`${API}/api/admin/orders/${orderId}/delivery-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: getAuthHeader(creds) },
      body: JSON.stringify({ delivery_status: status }),
    })
    const d = await res.json()
    setSaving(false)
    if (res.ok) { setMsg('✅ Status updated. WhatsApp sent if delivered.'); load() }
    else setMsg('❌ ' + d.error)
  }

  async function markDelivered() {
    setSaving(true)
    const res = await fetch(`${API}/api/admin/orders/${orderId}/mark-delivered`, {
      method: 'POST',
      headers: { Authorization: getAuthHeader(creds) },
    })
    const d = await res.json()
    setSaving(false)
    setMsg(res.ok ? '✅ Marked delivered. Email + invoice sent.' : '❌ ' + d.error)
    if (res.ok) load()
  }

  async function resendPaymentLink() {
    setSaving(true)
    setMsg('')
    const res = await fetch(`${API}/api/admin/orders/${orderId}/resend-payment-link`, {
      method: 'POST',
      headers: { Authorization: getAuthHeader(creds) },
    })
    const d = await res.json()
    setSaving(false)
    setMsg(res.ok ? `✅ Payment link resent to ${d.message?.split('to ')?.[1] || 'customer'}.` : '❌ ' + d.error)
  }

  if (loading) return <div className="adm-loading">Loading order…</div>
  if (!data) return <div className="adm-error-page">Order not found.</div>

  const { order, customer, items } = data
  const deliveryStatuses = ['prebooked', 'order_confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <Link to="/western/admin/orders" className="adm-back-link">← Orders</Link>
          <h2>Order #{order.id.split('-')[0].toUpperCase()}</h2>
        </div>
        <div className="adm-header-badges">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.delivery_status} />
        </div>
      </div>

      <div className="adm-detail-grid">
        {/* Customer Info */}
        <div className="adm-card">
          <div className="adm-card-header">Customer</div>
          <div className="adm-detail-rows">
            <div className="adm-detail-row"><span>Name</span><strong>{customer.name}</strong></div>
            <div className="adm-detail-row"><span>WhatsApp</span><strong>{customer.whatsapp}</strong></div>
            <div className="adm-detail-row"><span>Email</span><strong>{customer.email}</strong></div>
            <div className="adm-detail-row"><span>Address</span><strong>{customer.address}</strong></div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="adm-card">
          <div className="adm-card-header">Payment</div>
          <div className="adm-detail-rows">
            <div className="adm-detail-row"><span>Cart Total</span><strong>{fmt(order.total_amount)}</strong></div>
            <div className="adm-detail-row"><span>Pre-booking Paid</span><strong className="green-text">{fmt(order.prebooking_amount)}</strong></div>
            <div className="adm-detail-row"><span>Balance Due</span><strong className="amber-text">{fmt(order.remaining_amount)}</strong></div>
            <div className="adm-detail-row"><span>Ordered</span><strong>{fmtDate(order.created_at)}</strong></div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="adm-card" style={{ marginTop: 20 }}>
        <div className="adm-card-header">Items</div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Product</th><th>Size</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id}>
                  <td>{i.product_name}</td>
                  <td>{i.size}</td>
                  <td>{i.qty}</td>
                  <td>{fmt(i.unit_price)}</td>
                  <td>{fmt(i.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Status Control */}
      <div className="adm-card" style={{ marginTop: 20 }}>
        <div className="adm-card-header">Update Delivery Status</div>
        <div className="adm-delivery-controls">
          <div className="adm-delivery-steps">
            {deliveryStatuses.map(s => (
              <button
                key={s}
                className={`adm-step-btn${order.delivery_status === s ? ' current' : ''}`}
                onClick={() => updateDelivery(s)}
                disabled={saving}
              >
                {s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Resend payment link — shown for prepaid / awaiting_final_payment */}
          {['prepaid', 'awaiting_final_payment'].includes(order.status) && (
            <button
              className="adm-btn-outline"
              style={{ marginTop: 16, width: '100%', padding: '12px', fontSize: '0.82rem' }}
              onClick={resendPaymentLink}
              disabled={saving}
            >
              📧 Resend Payment Link Email
            </button>
          )}

          <button className="adm-btn-primary" style={{ marginTop: 12 }} onClick={markDelivered} disabled={saving}>
            📦 Mark as Delivered + Send Email
          </button>
          {msg && <p className={`adm-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Link Requests ─────────────────────────────────────────────────────────────
function LinkRequests({ creds }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [msg, setMsg]           = useState({})

  function load() {
    setLoading(true)
    fetch(`${API}/api/admin/link-requests`, { headers: { Authorization: getAuthHeader(creds) } })
      .then(r => r.json())
      .then(d => { setRequests(d.requests || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function approve(orderId) {
    setMsg(m => ({ ...m, [orderId]: '⏳ Sending…' }))
    const res = await fetch(`${API}/api/admin/link-requests/${orderId}/approve`, {
      method: 'POST',
      headers: { Authorization: getAuthHeader(creds) },
    })
    const d = await res.json()
    setMsg(m => ({ ...m, [orderId]: res.ok ? '✅ Link sent!' : '❌ ' + d.error }))
    if (res.ok) load()
  }

  async function dismiss(orderId) {
    await fetch(`${API}/api/admin/link-requests/${orderId}/dismiss`, {
      method: 'POST',
      headers: { Authorization: getAuthHeader(creds) },
    })
    load()
  }

  if (loading) return <div className="adm-loading">Loading requests…</div>

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h2>📧 Payment Link Requests</h2>
        <button className="adm-btn-outline" onClick={load}>Refresh</button>
      </div>

      {requests.length === 0 ? (
        <div className="adm-empty">
          <p>✅ No pending link requests.</p>
          <p style={{ fontSize: '0.8rem', color: '#5a7060', marginTop: 8 }}>
            When a customer clicks "Request new payment link" in their email, it appears here.
          </p>
        </div>
      ) : (
        <div className="adm-card">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Order ID</th>
                <th>Amount Due</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.customer_name}</strong></td>
                  <td style={{ fontSize: '0.8rem' }}>{r.email}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{r.id.split('-')[0].toUpperCase()}</td>
                  <td><strong style={{ color: '#b8933f' }}>₹{Number(r.remaining_amount).toFixed(2)}</strong></td>
                  <td style={{ fontSize: '0.75rem', color: '#7a9080' }}>
                    {new Date(r.link_request_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="adm-btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                        onClick={() => approve(r.id)}>
                        📧 Approve & Send
                      </button>
                      <button className="adm-btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        onClick={() => dismiss(r.id)}>
                        Dismiss
                      </button>
                    </div>
                    {msg[r.id] && <p style={{ marginTop: 4, fontSize: '0.75rem', color: msg[r.id].startsWith('✅') ? '#22c55e' : '#ef4444' }}>{msg[r.id]}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Customers List ─────────────────────────────────────────────────────────────

function CustomersList({ creds }) {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/admin/customers`, { headers: { Authorization: getAuthHeader(creds) } })
      .then(r => r.json())
      .then(d => { setCustomers(d.customers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [creds])

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h2>Customers <span className="adm-count-badge">{customers.length}</span></h2>
      </div>
      {loading ? <div className="adm-loading">Loading…</div> : (
        <div className="adm-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Name</th><th>WhatsApp</th><th>Email</th><th>Orders</th><th>Total Value</th><th>Joined</th><th></th></tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.whatsapp}</td>
                    <td>{c.email}</td>
                    <td>{c.total_orders}</td>
                    <td>{fmt(c.total_value)}</td>
                    <td>{fmtDate(c.created_at)}</td>
                    <td>
                      <button className="adm-btn-xs" onClick={() => navigate(`/western/admin/customers/${c.id}`)}>
                        Orders →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Notify Item Ready ─────────────────────────────────────────────────────────
function NotifyReady({ creds }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [prepaidOrders, setPrepaidOrders] = useState([])
  const [selected, setSelected] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/admin/orders?status=prepaid&limit=100`, { headers: { Authorization: getAuthHeader(creds) } })
      .then(r => r.json())
      .then(d => { setPrepaidOrders(d.orders || []); setFetchLoading(false) })
      .catch(() => setFetchLoading(false))
  }, [creds])

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleNotify() {
    setLoading(true)
    setResult(null)
    const body = selected.length > 0 ? { orderIds: selected } : {}
    const res = await fetch(`${API}/api/admin/notify-item-ready`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: getAuthHeader(creds) },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h2>📣 Notify — Items Ready</h2>
        <p>Send a WhatsApp message to pre-paid customers with their remaining payment link.</p>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          Pre-paid Orders ({prepaidOrders.length})
          <span style={{ fontSize: '0.75rem', marginLeft: 12, color: 'var(--adm-muted)' }}>
            {selected.length ? `${selected.length} selected` : 'Select specific orders or notify all'}
          </span>
        </div>

        {fetchLoading ? <div className="adm-loading">Loading prepaid orders…</div> : (
          prepaidOrders.length === 0
            ? <div className="adm-empty">No prepaid orders found.</div>
            : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? prepaidOrders.map(o => o.id) : [])} /></th>
                      <th>Order ID</th><th>Customer</th><th>WhatsApp</th><th>Balance</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prepaidOrders.map(o => (
                      <tr key={o.id} className={selected.includes(o.id) ? 'selected-row' : ''}>
                        <td><input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggleSelect(o.id)} /></td>
                        <td>#{o.id.split('-')[0].toUpperCase()}</td>
                        <td>{o.customer_name}</td>
                        <td>{o.whatsapp}</td>
                        <td className="amber-text">{fmt(o.remaining_amount)}</td>
                        <td>{fmtDate(o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        )}

        <div className="adm-notify-actions">
          <button
            className="adm-btn-primary adm-notify-btn"
            onClick={handleNotify}
            disabled={loading || prepaidOrders.length === 0}
          >
            {loading ? 'Sending…' : `📱 Send WhatsApp to ${selected.length || prepaidOrders.length} Customer${(selected.length || prepaidOrders.length) !== 1 ? 's' : ''}`}
          </button>
        </div>

        {result && (
          <div className="adm-notify-result">
            <div className="adm-notify-summary">
              <strong>✅ Done!</strong> Notified {result.notified} / {result.results?.length} customers.
            </div>
            <div className="adm-table-wrap" style={{ marginTop: 16 }}>
              <table className="adm-table">
                <thead><tr><th>Order</th><th>Customer</th><th>Result</th></tr></thead>
                <tbody>
                  {result.results?.map(r => (
                    <tr key={r.orderId}>
                      <td>#{r.orderId.split('-')[0].toUpperCase()}</td>
                      <td>{r.customer}</td>
                      <td>
                        <span style={{ color: r.status === 'sent' ? '#22c55e' : '#ef4444' }}>
                          {r.status === 'sent' ? '✓ Sent' : `✗ ${r.error}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Admin Portal Root ─────────────────────────────────────────────────────────
export default function AdminPortal() {
  const [creds, setCreds] = useState(() => {
    const saved = sessionStorage.getItem('wg_admin_creds')
    return saved ? JSON.parse(saved) : null
  })

  function handleLogin(c) {
    sessionStorage.setItem('wg_admin_creds', JSON.stringify(c))
    setCreds(c)
  }

  function handleLogout() {
    sessionStorage.removeItem('wg_admin_creds')
    setCreds(null)
  }

  if (!creds) return <LoginScreen onLogin={handleLogin} />

  return (
    <div className="adm-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="adm-main">
        <Routes>
          <Route index element={<Dashboard creds={creds} />} />
          <Route path="orders" element={<OrdersList creds={creds} />} />
          <Route path="orders/:id" element={<OrderDetail creds={creds} />} />
          <Route path="customers" element={<CustomersList creds={creds} />} />
          <Route path="customers/:id" element={<CustomersList creds={creds} />} />
          <Route path="link-requests" element={<LinkRequests creds={creds} />} />
          <Route path="notify" element={<NotifyReady creds={creds} />} />
        </Routes>
      </main>
    </div>
  )
}
