import Stripe from 'stripe'
import { getUserFromRequest } from './_lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  const user = await getUserFromRequest(req)
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Unauthorized' }))
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const appUrl = process.env.VITE_APP_URL || 'http://localhost:5173'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: process.env.SOUNDGUY_PRICE_ID, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email,
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/#pricing`,
      metadata: { user_id: user.id },
    })

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ url: session.url }))
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}
