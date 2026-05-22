import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePostHog } from '@posthog/react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const posthog = usePostHog()
  const previousUserId = useRef(null)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [license, setLicense] = useState(null)
  const [licenseLoading, setLicenseLoading] = useState(false)
  const [pendingPasswordReset, setPendingPasswordReset] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPendingPasswordReset(true)
      } else {
        setUser(session?.user ?? null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchLicense = useCallback(async function fetchLicense() {
    setLicenseLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/me/license', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        setLicense(await res.json())
      }
    } catch {
      // leave license as null — UI shows "not purchased"
    } finally {
      setLicenseLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      previousUserId.current = user.id
      posthog?.identify(user.id, {
        email: user.email,
      })
      fetchLicense()
    } else {
      if (previousUserId.current) {
        posthog?.reset()
        previousUserId.current = null
      }
      setLicense(null)
    }
  }, [user, fetchLicense, posthog])

  async function startCheckout() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    posthog?.capture('checkout_started')

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      posthog?.capture('checkout_failed', {
        reason: body.error || 'Failed to create checkout session',
      })
      throw new Error(body.error || 'Failed to create checkout session')
    }
    const { url } = await res.json()
    posthog?.capture('checkout_redirected')
    window.location.href = url
  }

  async function signOut() {
    posthog?.capture('signed_out')
    await supabase.auth.signOut()
    posthog?.reset()
    setUser(null)
    setLicense(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      authLoading,
      license,
      licenseLoading,
      fetchLicense,
      startCheckout,
      signOut,
      pendingPasswordReset,
      setPendingPasswordReset,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
