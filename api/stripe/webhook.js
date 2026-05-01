import Stripe from 'stripe'
import { createAdminClient } from '../_lib/supabaseAdmin.js'

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

async function handleCheckoutCompleted(session, supabase) {
  const userId = session.client_reference_id
  if (!userId) return

  // Idempotency: skip if we already processed this session
  const { data: existing } = await supabase
    .from('licenses')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single()

  if (existing) return

  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id ?? null

  const paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id ?? null

  const { error } = await supabase.from('licenses').upsert(
    {
      user_id: userId,
      status: 'active',
      stripe_customer_id: customerId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      purchased_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (error) throw error
}

async function handleChargeRefunded(charge, supabase) {
  const paymentIntentId = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id ?? null

  if (!paymentIntentId) return

  await supabase
    .from('licenses')
    .update({ status: 'refunded', updated_at: new Date().toISOString() })
    .eq('stripe_payment_intent_id', paymentIntentId)
}

async function handleDisputeCreated(dispute, stripe, supabase) {
  const chargeId = typeof dispute.charge === 'string'
    ? dispute.charge
    : dispute.charge?.id ?? null

  if (!chargeId) return

  const charge = await stripe.charges.retrieve(chargeId)

  const paymentIntentId = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id ?? null

  if (!paymentIntentId) return

  await supabase
    .from('licenses')
    .update({ status: 'revoked', updated_at: new Date().toISOString() })
    .eq('stripe_payment_intent_id', paymentIntentId)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405)
    return res.end()
  }

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  let event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }))
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, supabase)
        break
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object, supabase)
        break
      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object, stripe, supabase)
        break
      // All other events acknowledged but not acted on
    }
  } catch (err) {
    // Return 500 so Stripe retries the webhook
    res.writeHead(500, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: err.message }))
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ received: true }))
}

// Named exports so tests can import handlers individually
export { handleCheckoutCompleted, handleChargeRefunded, handleDisputeCreated }
