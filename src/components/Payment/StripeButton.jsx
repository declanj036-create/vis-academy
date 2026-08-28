import React, { useState } from 'react'

export default function StripeButton({ courseId, studentId, email, amountUSD }) {
  const [loading, setLoading] = useState(false)
  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, studentId, email, amountUSD })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create checkout session')
      window.location.href = json.url
    } catch (err) {
      alert('Stripe Checkout failed: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="border border-slate-200 px-4 py-2 rounded-lg"
    >
      {loading ? 'Redirecting...' : `Pay $${amountUSD} (Stripe)`}
    </button>
  )
}
