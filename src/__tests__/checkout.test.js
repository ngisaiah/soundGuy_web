import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventEmitter } from 'node:events'

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockCreateSession = vi.fn()
const mockStripeInstance = { checkout: { sessions: { create: mockCreateSession } } }

// vi.fn() implementation must use a regular function (not arrow) to be new-able
vi.mock('stripe', () => ({
  default: vi.fn(function MockStripe() { return mockStripeInstance }),
}))

const mockGetUser = vi.fn()
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: { getUser: mockGetUser } })),
}))

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeReq({ method = 'POST', token = 'tok' } = {}) {
  const req = new EventEmitter()
  req.method = method
  req.headers = token ? { authorization: `Bearer ${token}` } : {}
  process.nextTick(() => { req.emit('data', '{}'); req.emit('end') })
  return req
}

function makeRes() {
  const res = { _status: 200, _headers: {}, _body: '' }
  res.writeHead = (code, headers = {}) => { res._status = code; Object.assign(res._headers, headers); return res }
  res.setHeader = (k, v) => { res._headers[k] = v; return res }
  res.end = (body = '') => { res._body = body; return res }
  res.json = () => JSON.parse(res._body)
  return res
}

// ── Tests ────────────────────────────────────────────────────────────────────

let handler

beforeEach(async () => {
  vi.clearAllMocks()
  process.env.STRIPE_SECRET_KEY = 'sk_test_xxx'
  process.env.SOUNDGUY_PRICE_ID = 'price_test'
  process.env.VITE_APP_URL = 'https://soundguy.app'
  process.env.SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'srk_test'
  ;({ default: handler } = await import('../../api/checkout.js'))
})

describe('POST /api/checkout', () => {
  it('returns 405 for non-POST requests', async () => {
    const req = makeReq({ method: 'GET' })
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(405)
  })

  it('returns 401 when no auth token is provided', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const req = makeReq({ token: null })
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(401)
  })

  it('returns 401 when Supabase returns no user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const req = makeReq()
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(401)
  })

  it('creates checkout session with correct params and returns URL', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'user@test.com' } },
      error: null,
    })
    mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/pay/cs_test' })

    const req = makeReq()
    const res = makeRes()
    await handler(req, res)

    expect(res._status).toBe(200)
    expect(res.json().url).toBe('https://checkout.stripe.com/pay/cs_test')
    expect(mockCreateSession).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'payment',
        line_items: [{ price: 'price_test', quantity: 1 }],
        client_reference_id: 'user-123',
        customer_email: 'user@test.com',
        success_url: 'https://soundguy.app/?checkout=success',
        cancel_url: 'https://soundguy.app/#pricing',
      })
    )
  })

  it('returns 500 when Stripe throws', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'user@test.com' } },
      error: null,
    })
    mockCreateSession.mockRejectedValue(new Error('Stripe error'))

    const req = makeReq()
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(500)
    expect(res.json().error).toBe('Stripe error')
  })
})
