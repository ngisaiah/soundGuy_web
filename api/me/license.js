import { createAdminClient, getUserFromRequest } from '../_lib/supabaseAdmin.js'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export default async function handler(req, res) {
  // CORS preflight — required so the macOS app can call this endpoint
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v))

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  const user = await getUserFromRequest(req)
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Unauthorized' }))
  }

  const supabase = createAdminClient()

  const { data: row, error } = await supabase
    .from('licenses')
    .select('status, purchased_at')
    .eq('user_id', user.id)
    .single()

  // PGRST116 = no rows returned — user simply hasn't purchased yet
  if (error && error.code !== 'PGRST116') {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Failed to fetch license' }))
  }

  const status = row?.status ?? 'none'

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    has_access: status === 'active',
    status,
    purchased_at: row?.purchased_at ?? null,
  }))
}
