import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventEmitter } from 'node:events'

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockGetUser = vi.fn()

function makeSupabaseMock(rowResult = { data: null, error: { code: 'PGRST116' } }) {
  return {
    auth: { getUser: mockGetUser },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(rowResult),
    })),
  }
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => makeSupabaseMock()),
}))

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeReq(token) {
  const req = new EventEmitter()
  req.method = 'GET'
  req.headers = token ? { authorization: `Bearer ${token}` } : {}
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

describe('GET /api/me/license', () => {
  let handler

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env.SUPABASE_URL = 'https://x.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'srk_test'
    ;({ default: handler } = await import('../../api/me/license.js'))
  })

  it('returns 405 for non-GET requests', async () => {
    const req = makeReq('tok')
    req.method = 'POST'
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(405)
  })

  it('handles CORS preflight (OPTIONS)', async () => {
    const req = makeReq()
    req.method = 'OPTIONS'
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(204)
  })

  it('returns 401 when no token provided', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const req = makeReq()
    const res = makeRes()
    await handler(req, res)
    expect(res._status).toBe(401)
  })

  it('returns { has_access: false, status: "none" } when user has no license row', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })

    const { createClient } = await import('@supabase/supabase-js')
    createClient.mockReturnValue(makeSupabaseMock({ data: null, error: { code: 'PGRST116' } }))

    const req = makeReq('valid-token')
    const res = makeRes()
    await handler(req, res)

    expect(res._status).toBe(200)
    expect(res.json()).toMatchObject({ has_access: false, status: 'none', purchased_at: null })
  })

  it('returns { has_access: true, status: "active" } for an active license', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })

    const { createClient } = await import('@supabase/supabase-js')
    createClient.mockReturnValue(
      makeSupabaseMock({ data: { status: 'active', purchased_at: '2026-01-01T00:00:00Z' }, error: null })
    )

    const req = makeReq('valid-token')
    const res = makeRes()
    await handler(req, res)

    expect(res._status).toBe(200)
    expect(res.json()).toMatchObject({
      has_access: true,
      status: 'active',
      purchased_at: '2026-01-01T00:00:00Z',
    })
  })

  it('returns { has_access: false } for a refunded license', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })

    const { createClient } = await import('@supabase/supabase-js')
    createClient.mockReturnValue(
      makeSupabaseMock({ data: { status: 'refunded', purchased_at: '2026-01-01T00:00:00Z' }, error: null })
    )

    const req = makeReq('valid-token')
    const res = makeRes()
    await handler(req, res)

    expect(res.json()).toMatchObject({ has_access: false, status: 'refunded' })
  })
})
