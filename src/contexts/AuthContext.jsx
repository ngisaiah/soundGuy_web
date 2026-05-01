import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [license, setLicense] = useState(null)
  const [licenseLoading, setLicenseLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchLicense()
    } else {
      setLicense(null)
    }
  }, [user])

  async function fetchLicense() {
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
  }

  async function startCheckout() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Failed to create checkout session')
    }
    const { url } = await res.json()
    window.location.href = url
  }

  async function signOut() {
    await supabase.auth.signOut()
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
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
