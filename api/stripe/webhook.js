import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// raw body helper
async function getRawBody(req) {
  return await new Promise((resolve) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_ENDPOINT_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const metadata = session.metadata || {}
    const paymentId = metadata.paymentId || session.client_reference_id

    try {
      // ensure we only process once
      const { data: existing } = await supabase.from('payments').select('*').eq('id', paymentId).limit(1).maybeSingle()
      if (existing && existing.status === 'success') {
        return res.status(200).send('Already processed')
      }

      await supabase.from('payments').update({ status: 'success' }).eq('id', paymentId)

      const courseId = metadata.courseId
      const studentId = metadata.studentId
      if (courseId && studentId) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('*')
          .eq('student_id', studentId)
          .eq('course_id', courseId)
          .limit(1)

        if (!enrollment || enrollment.length === 0) {
          await supabase.from('enrollments').insert({ student_id: studentId, course_id: courseId, progress: 0 })
        }
      }

      return res.status(200).send('success')
    } catch (err) {
      console.error('Error processing stripe webhook', err)
      return res.status(500).send('server error')
    }
  }

  res.status(200).send('ignored')
}
