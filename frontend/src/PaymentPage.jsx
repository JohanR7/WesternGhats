import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const API = 'http://localhost:3002'

export default function PaymentPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')   // only orderId needed from URL

  const [payInfo, setPayInfo]   = useState(null)  // { amount, rzpOrderId, key, customer }
  const [loading, setLoading]   = useState(true)
  const [status, setStatus]     = useState(null)  // 'paying' | 'success' | 'error' | 'already_paid'
  const [errMsg, setErrMsg]     = useState('')

  useEffect(() => {
    if (!orderId) { setLoading(false); return }

    // Single call to prepare-payment: checks Razorpay, syncs DB, returns correct amount
    fetch(`${API}/api/orders/${orderId}/prepare-payment`)
      .then(r => r.json())
      .then(d => {
        if (d.paid) {
          setStatus('already_paid')
        } else {
          setPayInfo(d)   // { amount, rzpOrderId, key, customer }
        }
        setLoading(false)
      })
      .catch(() => { setErrMsg('Could not load payment details. Please try again.'); setLoading(false) })
  }, [orderId])

  function handlePay() {
    if (!window.Razorpay) {
      setErrMsg('Payment gateway not loaded. Please refresh the page.')
      return
    }
    if (!payInfo?.key || !payInfo?.rzpOrderId) {
      setErrMsg('Payment configuration missing. Please refresh.')
      return
    }
    setStatus('paying')
    setErrMsg('')

    const rzp = new window.Razorpay({
      key:      payInfo.key,
      order_id: payInfo.rzpOrderId,
      amount:   Math.round(payInfo.amount * 100),
      currency: 'INR',
      name: 'Western Ghats Heritage',
      description: `Final Payment — Order #${orderId?.split('-')[0]?.toUpperCase()}`,
      prefill: {
        name:    payInfo.customer?.name    || '',
        email:   payInfo.customer?.email   || '',
        contact: payInfo.customer?.whatsapp || '',
      },
      theme: { color: '#b8933f' },
      handler: async function (response) {
        try {
          const res = await fetch(`${API}/api/payments/verify-final`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          const data = await res.json()
          if (res.ok) setStatus('success')
          else { setStatus('error'); setErrMsg(data.error || 'Payment verification failed.') }
        } catch {
          setStatus('error')
          setErrMsg('Network error during verification. Please contact support.')
        }
      },
      modal: { ondismiss: () => setStatus(null) },
    })
    rzp.open()
  }

  // ── Render states ───────────────────────────────────────────
  if (status === 'success') {
    const shortId = orderId?.split('-')[0]?.toUpperCase()
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0d1a10; }
          .paid-page {
            min-height: 100vh;
            background: radial-gradient(ellipse at 50% 0%, #0d2a18 0%, #0a1a0d 70%);
            display: flex; align-items: center; justify-content: center;
            padding: 24px;
            font-family: 'Inter', sans-serif;
          }
          .paid-card {
            background: #111c14;
            border: 1px solid rgba(34,197,94,0.25);
            border-radius: 20px;
            padding: 52px 44px;
            max-width: 420px; width: 100%;
            text-align: center;
            box-shadow: 0 0 60px rgba(34,197,94,0.06), 0 24px 80px rgba(0,0,0,0.5);
            animation: fadeUp 0.5s ease;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: none; }
          }
          .paid-check-wrap {
            width: 80px; height: 80px;
            border-radius: 50%;
            background: rgba(34,197,94,0.12);
            border: 2px solid rgba(34,197,94,0.4);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 28px;
            font-size: 2.2rem; color: #22c55e;
            animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
          }
          @keyframes popIn {
            from { transform: scale(0.4); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
          }
          .paid-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem; font-weight: 400;
            color: #f5f0e8; margin-bottom: 10px;
          }
          .paid-subtitle { font-size: 0.84rem; color: #5a9070; line-height: 1.7; margin-bottom: 28px; }
          .paid-order-box {
            background: rgba(34,197,94,0.06);
            border: 1px solid rgba(34,197,94,0.15);
            border-radius: 10px;
            padding: 16px 20px; margin-bottom: 24px;
          }
          .paid-order-label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #3a6040; margin-bottom: 6px; }
          .paid-order-id { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: #22c55e; font-weight: 500; }
          .paid-divider { height: 1px; background: rgba(34,197,94,0.1); margin: 0 0 20px; }
          .paid-brand { font-family: 'Cormorant Garamond', serif; font-size: 0.9rem; color: #2a5030; letter-spacing: 0.08em; }
          .paid-track-link {
            display: inline-block; margin-top: 18px;
            font-size: 0.72rem; color: #3a6040;
            text-decoration: none; letter-spacing: 0.06em; transition: color 0.2s;
          }
          .paid-track-link:hover { color: #22c55e; }
        `}</style>
        <div className="paid-page">
          <div className="paid-card">
            <div className="paid-check-wrap">✓</div>
            <h1 className="paid-title">Payment Successful!</h1>
            <p className="paid-subtitle">
              Thank you! Your full payment has been received.<br />
              A confirmation email with your invoice has been sent.
            </p>
            <div className="paid-order-box">
              <div className="paid-order-label">Order Reference</div>
              <div className="paid-order-id">#{shortId}</div>
            </div>
            <div className="paid-divider" />
            <div className="paid-brand">🌿 Western Ghats Heritage</div>
            <a href="/track" className="paid-track-link">Track your order →</a>
          </div>
        </div>
      </>
    )
  }

  // ── Already paid — rich styled screen ─────────────────────
  if (status === 'already_paid') {
    const shortId = orderId?.split('-')[0]?.toUpperCase()
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0d1a10; }
          .paid-page {
            min-height: 100vh;
            background: radial-gradient(ellipse at 50% 0%, #0d2a18 0%, #0a1a0d 70%);
            display: flex; align-items: center; justify-content: center;
            padding: 24px;
            font-family: 'Inter', sans-serif;
          }
          .paid-card {
            background: #111c14;
            border: 1px solid rgba(34,197,94,0.25);
            border-radius: 20px;
            padding: 52px 44px;
            max-width: 420px; width: 100%;
            text-align: center;
            box-shadow: 0 0 60px rgba(34,197,94,0.06), 0 24px 80px rgba(0,0,0,0.5);
            animation: fadeUp 0.5s ease;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: none; }
          }
          .paid-check-wrap {
            width: 80px; height: 80px;
            border-radius: 50%;
            background: rgba(34,197,94,0.12);
            border: 2px solid rgba(34,197,94,0.4);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 28px;
            font-size: 2.2rem;
            animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
          }
          @keyframes popIn {
            from { transform: scale(0.4); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
          }
          .paid-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem; font-weight: 400;
            color: #f5f0e8; margin-bottom: 10px;
          }
          .paid-subtitle { font-size: 0.84rem; color: #5a9070; line-height: 1.7; margin-bottom: 28px; }
          .paid-order-box {
            background: rgba(34,197,94,0.06);
            border: 1px solid rgba(34,197,94,0.15);
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 24px;
          }
          .paid-order-label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #3a6040; margin-bottom: 6px; }
          .paid-order-id {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem; color: #22c55e; font-weight: 500;
          }
          .paid-divider { height: 1px; background: rgba(34,197,94,0.1); margin: 0 0 20px; }
          .paid-brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 0.9rem; color: #2a5030; letter-spacing: 0.08em;
          }
          .paid-track-link {
            display: inline-block; margin-top: 18px;
            font-size: 0.72rem; color: #3a6040;
            text-decoration: none; letter-spacing: 0.06em;
            transition: color 0.2s;
          }
          .paid-track-link:hover { color: #22c55e; }
        `}</style>
        <div className="paid-page">
          <div className="paid-card">
            <div className="paid-check-wrap">✓</div>
            <h1 className="paid-title">Payment Completed</h1>
            <p className="paid-subtitle">
              Your full payment has already been received and confirmed.
              A confirmation email with your invoice has been sent.
            </p>
            <div className="paid-order-box">
              <div className="paid-order-label">Order Reference</div>
              <div className="paid-order-id">#{shortId}</div>
            </div>
            <div className="paid-divider" />
            <div className="paid-brand">🌿 Western Ghats Heritage</div>
            <a href="/track" className="paid-track-link">Track your order →</a>
          </div>
        </div>
      </>
    )
  }

  if (!orderId) {
    return (
      <div className="pay-page">
        <div className="pay-card pay-error">
          <div className="pay-icon">❌</div>
          <h1>Invalid Payment Link</h1>
          <p>This link is missing required information. Please use the link from your email.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1a10; }
        .pay-page {
          min-height: 100vh;
          background: radial-gradient(ellipse at 50% 0%, #1f3525 0%, #0d1a10 70%);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          font-family: 'Inter', sans-serif;
        }
        .pay-card {
          background: #1a2420;
          border: 1px solid #2a3d30;
          border-radius: 16px;
          padding: 48px 40px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 24px 80px rgba(0,0,0,0.4);
        }
        .pay-brand { margin-bottom: 32px; }
        .pay-brand-icon { font-size: 2.2rem; display: block; margin-bottom: 10px; }
        .pay-brand h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 400;
          color: #f5f0e8; letter-spacing: 0.06em;
        }
        .pay-brand p { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #b8933f; margin-top: 4px; }
        .pay-divider { height: 1px; background: #2a3d30; margin: 0 0 28px; }
        .pay-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 400; color: #f5f0e8; margin-bottom: 8px; }
        .pay-subtitle { font-size: 0.78rem; color: #7a9080; margin-bottom: 28px; }
        .pay-amount-box {
          background: rgba(184,147,63,0.1);
          border: 1px solid rgba(184,147,63,0.3);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .pay-amount-label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7a9080; margin-bottom: 8px; }
        .pay-amount-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem; font-weight: 500;
          color: #b8933f; line-height: 1;
        }
        .pay-order-id { font-size: 0.7rem; color: #4a6050; margin-top: 8px; font-family: monospace; }
        .pay-info { font-size: 0.78rem; color: #5a7060; margin-bottom: 24px; line-height: 1.6; }
        .pay-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #b8933f, #d4aa5a);
          color: #1a1208;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(184,147,63,0.35);
        }
        .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .pay-secure { font-size: 0.65rem; color: #3a5040; margin-top: 14px; }
        .pay-error-msg {
          margin-top: 16px; padding: 10px 14px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          border-radius: 6px; font-size: 0.78rem; color: #ef4444;
        }
        .pay-success { border-color: rgba(34,197,94,0.3); }
        .pay-error   { border-color: rgba(239,68,68,0.3); }
        .pay-icon { font-size: 3rem; margin-bottom: 20px; }
        .pay-card h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 400; color: #f5f0e8; margin-bottom: 12px;
        }
        .pay-card p { font-size: 0.85rem; color: #7a9080; line-height: 1.7; margin-bottom: 8px; }
        .pay-sub { font-size: 0.72rem !important; color: #3a5040 !important; margin-top: 16px; }
        .pay-loading { color: #5a7060; font-size: 0.85rem; }
      `}</style>

      <div className="pay-page">
        <div className="pay-card">
          <div className="pay-brand">
            <span className="pay-brand-icon">🌿</span>
            <h2>Western Ghats</h2>
            <p>Heritage Food — Forest Origin</p>
          </div>
          <div className="pay-divider" />

          <p className="pay-title">Complete Your Payment</p>
          <p className="pay-subtitle">Your pre-booked items are ready for dispatch</p>

          <div className="pay-amount-box">
            <div className="pay-amount-label">Remaining Amount Due</div>
            <div className="pay-amount-value">
              ₹{payInfo ? Number(payInfo.amount).toLocaleString('en-IN') : '—'}
            </div>
            <div className="pay-order-id">
              Order #{orderId?.split('-')[0]?.toUpperCase()}
            </div>
          </div>

          {loading ? (
            <p className="pay-loading">Verifying payment details…</p>
          ) : (
            <>
              <p className="pay-info">
                Click below to securely complete your payment via Razorpay.
                A final invoice will be emailed to you immediately after payment.
              </p>
              <button className="pay-btn" onClick={handlePay} disabled={status === 'paying'}>
                {status === 'paying'
                  ? '⏳ Processing…'
                  : `💳 Pay ₹${payInfo ? Number(payInfo.amount).toLocaleString('en-IN') : ''}`}
              </button>
              {errMsg && <div className="pay-error-msg">{errMsg}</div>}
              <p className="pay-secure">🔒 Secured by Razorpay · 256-bit SSL Encryption</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

