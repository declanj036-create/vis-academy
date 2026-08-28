# Payments integration (Paystack + Stripe)

This branch adds serverless endpoints and client components to handle Paystack (NGN) and Stripe (USD) payments, plus webhook handlers that update the Supabase `payments` table and create enrollments on success.

Files added

- `api/paystack/create-transaction.js` - initializes a Paystack transaction and creates a pending payment record in Supabase
- `api/paystack/webhook.js` - Paystack webhook handler; verifies signature and updates payment/enrollment
- `api/stripe/create-session.js` - creates a Stripe Checkout session and inserts a pending payment in Supabase
- `api/stripe/webhook.js` - Stripe webhook handler; verifies signature and updates payment/enrollment
- `src/components/Payment/PaystackButton.jsx` - client button to start Paystack flow
- `src/components/Payment/StripeButton.jsx` - client button to start Stripe flow

Environment variables (set in Vercel and locally in `.env`)

```text
SUPABASE_URL=https://ccmcomoyzqfsbfpvmumb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<<your-supabase-service-role-key>>  # server-only
PAYSTACK_SECRET_KEY=<<paystack secret>>
PAYSTACK_PUBLIC_KEY=<<paystack public (optional)>>
STRIPE_SECRET_KEY=<<stripe secret>>
STRIPE_PUBLISHABLE_KEY=<<stripe publishable>>
STRIPE_ENDPOINT_SECRET=<<stripe webhook signing secret>>
SITE_URL=https://your-deployed-domain.example
```

Webhook configuration (after deploy)

- Paystack webhook: `https://<your-domain>/api/paystack/webhook` (enable transaction success events)
- Stripe webhook: `https://<your-domain>/api/stripe/webhook` (use the provided signing secret)

Dashboard integration snippet

Add the following where you render each course in the dashboard to show payment buttons (replace variables accordingly):

```jsx
import PaystackButton from '../components/Payment/PaystackButton'
import StripeButton from '../components/Payment/StripeButton'

// inside course card render
<div className="mt-3 flex gap-3">
  <PaystackButton
    courseId={c.id}
    studentId={user.id}
    email={user.email}
    fullName={user.user_metadata?.full_name || user.email}
    amountNgN={c.price_ngn || 50000}
  />
  <StripeButton
    courseId={c.id}
    studentId={user.id}
    email={user.email}
    amountUSD={c.price_usd || 99}
  />
</div>
```

Testing locally

- Use ngrok to expose your local dev server for webhook testing, or use Stripe CLI (`stripe listen --forward-to localhost:5173/api/stripe/webhook`).
- Use Paystack test keys and configure webhook URL to the ngrok URL.

Security notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only — do not expose in client or environment variables accessible to browsers.
- Webhook handlers verify signatures for Paystack (HMAC sha512) and Stripe (signature header).
- Handlers check existing payment status to avoid double-processing (idempotency).

If you want, I can now:
- Merge the branch into `main` for you, or open a PR so you can review.
- Create the Vercel project and connect it to this repo (you must add env vars in Vercel).

