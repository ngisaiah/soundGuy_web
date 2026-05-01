import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/** Extracts the authenticated user from the Authorization: Bearer <token> header. */
export async function getUserFromRequest(req) {
  const auth = req.headers.authorization ?? req.headers.Authorization
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  const supabase = createAdminClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}
