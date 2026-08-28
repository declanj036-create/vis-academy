import React, { useState } from 'react'

export default function PaystackButton({ courseId, studentId, email, fullName, amountNgN }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/paystack/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, studentId, email, fullName, amountNgN })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to initialize payment')
      // redirect to authorization_url
      window.location.href = json.authorization_url
    } catch (err) {
      alert('Payment initialization failed: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-yellow-400 text-navy-900 px-4 py-2 rounded-lg font-semibold"
    >
      {loading ? 'Opening Paystack...' : `Pay ₦${amountNgN} (Paystack)`}
    </button>
  )
}
