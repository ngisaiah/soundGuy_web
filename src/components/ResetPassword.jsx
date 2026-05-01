import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'success' | 'error'
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStatus('ready')
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setStatus('success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Inter", system-ui, sans-serif',
    padding: '24px',
  }

  const cardStyle = {
    width: '100%',
    maxWidth: 360,
    background: '#111118',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: '32px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  }

  const logoStyle = {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: '#7c6fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexShrink: 0,
  }

  if (status === 'loading') {
    return (
      <div style={containerStyle}>
        <Loader size={24} color="#7c6fff" className="animate-spin" />
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={logoStyle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 11 A8 8 0 0 1 20 11" stroke="white" strokeWidth="2" fill="none"/>
              <rect x="2" y="11" width="3" height="6" rx="1" fill="white"/>
              <rect x="19" y="11" width="3" height="6" rx="1" fill="white"/>
              <rect x="11" y="13" width="2" height="6" fill="white"/>
              <circle cx="12" cy="11" r="3" fill="white"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#f0f0f5', fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Password updated</p>
            <p style={{ color: '#9898ac', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Your password has been changed. You can now sign in with your new password.
            </p>
          </div>
          <a
            href="/"
            style={{
              display: 'block',
              textAlign: 'center',
              background: '#7c6fff',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              padding: '10px',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Back to SoundGuy
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M4 11 A8 8 0 0 1 20 11" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="2" y="11" width="3" height="6" rx="1" fill="white"/>
            <rect x="19" y="11" width="3" height="6" rx="1" fill="white"/>
            <rect x="11" y="13" width="2" height="6" fill="white"/>
            <circle cx="12" cy="11" r="3" fill="white"/>
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#9898ac', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>
            SoundGuy
          </p>
          <h1 style={{ color: '#f0f0f5', fontSize: 20, fontWeight: 700, margin: 0 }}>Set new password</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', color: '#9898ac', fontSize: 11, fontWeight: 500, marginBottom: 6 }}>
              New password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              style={{
                width: '100%',
                background: '#18181f',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 8,
                color: '#f0f0f5',
                fontSize: 13,
                padding: '8px 12px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#9898ac', fontSize: 11, fontWeight: 500, marginBottom: 6 }}>
              Confirm new password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: '#18181f',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 8,
                color: '#f0f0f5',
                fontSize: 13,
                padding: '8px 12px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{
              background: 'rgba(248,113,113,0.10)',
              border: '1px solid rgba(248,113,113,0.30)',
              borderRadius: 8,
              color: '#f87171',
              fontSize: 11,
              padding: '8px 12px',
              margin: 0,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: loading ? 'rgba(124,111,255,0.35)' : '#7c6fff',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              padding: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            {loading && <Loader size={14} className="animate-spin" />}
            Update password
          </button>
        </form>
      </div>
    </div>
  )
}
