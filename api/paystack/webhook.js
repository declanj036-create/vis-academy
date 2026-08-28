import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// helper to get raw body string
async function getRawBody(req) {
  return await new Promise((resolve) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  try {
    const rawBody = await getRawBody(req)
    const signature = req.headers['x-paystack-signature']

    // validate signature
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(rawBody).digest('hex')
    if (signature !== hash) {
      console.warn('Invalid Paystack signature')
      return res.status(401).send('Invalid signature')
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event
    const data = payload.data

    // handle transaction success
    if (event === 'charge.success' || event === 'transaction.success') {
      const reference = data.reference || data.metadata?.payment_reference || data.metadata?.reference
      if (!reference) {
        console.warn('No reference in webhook payload')
        return res.status(400).send('No reference')
      }

      // fetch payment record
      const { data: paymentRecord, error: fetchErr } = await supabase
        .from('payments')
        .select('*')
        .eq('id', reference)
        .limit(1)
        .maybeSingle()

      if (fetchErr) {
        console.error('Error fetching payment', fetchErr)
      }

      // If payment already marked success, ignore (idempotency)
      if (paymentRecord && paymentRecord.status === 'success') {
        return res.status(200).send('Already processed')
      }

      // Update payment to success
      const { error: updateErr } = await supabase
        .from('payments')
        .update({ status: 'success' })
        .eq('id', reference)

      if (updateErr) {
        console.error('Failed to update payment status', updateErr)
      }

      // Optionally create enrollment
      const courseId = data.metadata?.courseId
      const studentId = data.metadata?.studentId
      if (courseId && studentId) {
        // check existing enrollment
        const { data: existing, error: exErr } = await supabase
          .from('enrollments')
          .select('*')
          .eq('student_id', studentId)
          .eq('course_id', courseId)
          .limit(1)

        if (!exErr && !(existing && existing.length > 0)) {
          await supabase.from('enrollments').insert({
            student_id: studentId,
            course_id: courseId,
            progress: 0
          })
        }
      }

      return res.status(200).send('ok')
    }

    // For other events, just ack
    res.status(200).send('ignored')
  } catch (err) {
    console.error('Webhook error', err)
    res.status(500).send('Server error')
  }
}
