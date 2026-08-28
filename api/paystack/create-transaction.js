import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const SITE_URL = process.env.SITE_URL

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { courseId, studentId, email, fullName, amountNgN } = req.body || {}
    if (!courseId || !studentId || !email || !amountNgN) return res.status(400).json({ error: 'Missing fields' })

    // Generate our internal reference using crypto
    const reference = crypto.randomUUID()

    // Insert pending payment record
    const { error: insertErr } = await supabase
      .from('payments')
      .insert({
        id: reference,
        student_id: studentId,
        amount: amountNgN,
        currency: 'NGN',
        status: 'pending'
      })

    if (insertErr) {
      console.error('Insert payment error', insertErr)
      return res.status(500).json({ error: 'Could not create payment record' })
    }

    // Initialize Paystack transaction
    // Paystack expects amount in kobo (NGN * 100)
    const paystackBody = {
      email,
      amount: Number(amountNgN) * 100,
      reference,
      callback_url: `${SITE_URL}/dashboard`,
      metadata: {
        courseId,
        studentId,
        fullName,
        payment_reference: reference
      }
    }

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paystackBody)
    })

    const initJson = await initRes.json()
    if (!initRes.ok || !initJson.status) {
      console.error('Paystack init error', initJson)
      return res.status(502).json({ error: 'Paystack initialization failed', details: initJson })
    }

    return res.status(200).json({ authorization_url: initJson.data.authorization_url, reference })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
