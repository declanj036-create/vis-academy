import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const SITE_URL = process.env.SITE_URL

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { courseId, studentId, amountUSD, currency = 'USD', email } = req.body || {}
    if (!courseId || !studentId || !amountUSD || !email) return res.status(400).json({ error: 'Missing fields' })

    const paymentId = crypto.randomUUID()

    // insert pending payment
    const { error: insertErr } = await supabase.from('payments').insert({
      id: paymentId,
      student_id: studentId,
      amount: amountUSD,
      currency: currency,
      status: 'pending'
    })
    if (insertErr) {
      console.error('Insert payment error', insertErr)
      return res.status(500).json({ error: 'Could not create payment record' })
    }

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: `Course payment (${courseId})` },
          unit_amount: Math.round(Number(amountUSD) * 100)
        },
        quantity: 1
      }],
      success_url: `${SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/dashboard`,
      metadata: { paymentId, courseId, studentId }
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
