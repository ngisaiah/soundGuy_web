import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventEmitter } from 'node:events'

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockConstructEvent = vi.fn()
const mockChargesRetrieve = vi.fn()
const mockStripeInstance = {
  webhooks: { constructEvent: mockConstructEvent },
  charges: { retrieve: mockChargesRetrieve },
}

vi.mock('stripe', () => ({
  default: vi.fn(function MockStripe() { return mockStripeInstance }),
}))

const mockGetUser = vi.fn()

function makeChainedQuery(singleResult = { data: null, error: { code: 'PGRST116' } }) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(singleResult),
    upsert: vi.fn().mockResolvedValue({ error: null }),
  }
  return chain
}

let supaChain = makeChainedQuery()

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(function MockCreateClient() {
    return {
      auth: { getUser: mockGetUser },
      from: vi.fn(() => supaChain),
    }
  }),
}))

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeReq({ body = Buffer.from('{}'), sig = 'stripe-sig' } = {}) {
  const req = new EventEmitter()
  req.method = 'POST'
  req.headers = { 'stripe-signature': sig }
  process.nextTick(() => { req.emit('data', body); req.emit('end') })
  return req
}

function makeRes() {
  const res = { _status: 200, _headers: {}, _body: '' }
  res.writeHead = (code, headers = {}) => { res._status = code; Object.assign(res._headers, headers); return res }
  res.setHeader = (k, v) => { res._headers[k] = v; return res }
  res.end = (body = '') => { res._body = body; return res }
  res.json = () => JSON.parse(res._body || '{}')
  return res
}

// ── Tests ────────────────────────────────────────────────────────────────────

let handler, handleCheckoutCompleted, handleChargeRefunded

beforeEach(async () => {
  vi.clearAllMocks()
  supaChain = makeChainedQuery()
  process.env.STRIPE_SECRET_KEY = 'sk_test_xxx'
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
  process.env.SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'srk_test'
  ;({ default: handler, handleCheckoutCompleted, handleChargeRefunded } =
    await import('../../api/stripe/webhook.js'))
})

describe('POST /api/stripe/webhook — request handling', () => {
  it('returns 405 for non-POST requests', async () => {
    const req = new EventEmitter()
    req.method = 'GET'
    req.headers = {}
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(405)
  })

  it('returns 400 when Stripe signature verification fails', async () => {
    mockConstructEvent.mockImplementation(() => { throw new Error('invalid signature') })
    const req = makeReq()
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(400)
    expect(res.json().error).toMatch(/signature/i)
  })

  it('calls constructEvent with the raw request body buffer', async () => {
    mockConstructEvent.mockReturnValue({ type: 'payment_intent.created', data: { object: {} } })
    const rawBody = Buffer.from('raw-stripe-payload')
    const req = makeReq({ body: rawBody })
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(200)
    expect(mockConstructEvent).toHaveBeenCalledWith(rawBody, 'stripe-sig', 'whsec_test')
  })

  it('returns 200 { received: true } for unhandled event types', async () => {
    mockConstructEvent.mockReturnValue({ type: 'customer.created', data: { object: {} } })
    const req = makeReq()
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(200)
    expect(res.json()).toEqual({ received: true })
  })
})

describe('handleCheckoutCompleted', () => {
  const baseSession = {
    id: 'cs_test_123',
    client_reference_id: 'user-abc',
    customer: 'cus_test',
    payment_intent: 'pi_test',
  }

  it('upserts an active license on first delivery', async () => {
    // No existing row — single() returns no-rows error
    supaChain.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } })

    const { createClient } = await import('@supabase/supabase-js')
    const supa = createClient()

    await handleCheckoutCompleted(baseSession, supa)

    expect(supaChain.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-abc',
        status: 'active',
        stripe_session_id: 'cs_test_123',
        stripe_payment_intent_id: 'pi_test',
        stripe_customer_id: 'cus_test',
      }),
      { onConflict: 'user_id' }
    )
  })

  it('is idempotent — skips upsert when session already processed', async () => {
    // Existing row for this session
    supaChain.single.mockResolvedValue({ data: { id: 'lic-1' }, error: null })

    const { createClient } = await import('@supabase/supabase-js')
    const supa = createClient()

    await handleCheckoutCompleted(baseSession, supa)

    expect(supaChain.upsert).not.toHaveBeenCalled()
  })

  it('skips when client_reference_id is missing', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const supa = createClient()

    await handleCheckoutCompleted({ ...baseSession, client_reference_id: null }, supa)

    expect(supaChain.upsert).not.toHaveBeenCalled()
  })
})

describe('handleChargeRefunded', () => {
  it('marks the license as refunded by payment_intent_id', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const supa = createClient()

    await handleChargeRefunded({ payment_intent: 'pi_refunded' }, supa)

    expect(supaChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'refunded' })
    )
    expect(supaChain.eq).toHaveBeenCalledWith('stripe_payment_intent_id', 'pi_refunded')
  })

  it('skips when no payment_intent is present', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const supa = createClient()

    await handleChargeRefunded({ payment_intent: null }, supa)

    expect(supaChain.update).not.toHaveBeenCalled()
  })
})
