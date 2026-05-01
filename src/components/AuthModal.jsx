import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AuthModal({ onClose, onSuccess, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode) // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setCheckEmail(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onSuccess?.()
        onClose()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setCheckEmail(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-border-soft bg-surface-1 p-8 shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {checkEmail ? (
          <div className="text-center py-4">
            <p className="section-label mb-3">Check your email</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              {mode === 'forgot'
                ? <>We sent a password reset link to <span className="text-text-primary">{email}</span>.</>
                : <>We sent a confirmation link to <span className="text-text-primary">{email}</span>. Click the link to finish signing up.</>
              }
            </p>
            {mode === 'forgot' && (
              <button
                onClick={() => { setMode('signin'); setCheckEmail(false); setEmail('') }}
                className="mt-4 text-xs text-accent hover:underline underline-offset-2"
              >
                Back to sign in
              </button>
            )}
          </div>
        ) : mode === 'forgot' ? (
          <>
            <p className="section-label mb-1">Reset password</p>
            <h2 className="text-xl font-bold text-text-primary mb-6">Forgot your password?</h2>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-soft bg-surface-2 px-3.5 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="you@example.com"
                />
              </div>
              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <Loader size={14} className="animate-spin" />}
                Send reset link
              </button>
            </form>
            <p className="mt-5 text-center text-xs text-text-muted">
              <button
                onClick={() => { setMode('signin'); setError(null) }}
                className="text-accent underline-offset-2 hover:underline"
              >
                Back to sign in
              </button>
            </p>
          </>
        ) : (
          <>
            <p className="section-label mb-1">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </p>
            <h2 className="text-xl font-bold text-text-primary mb-6">
              {mode === 'signin' ? 'Welcome back' : 'Get started with SoundGuy'}
            </h2>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border-soft bg-surface-2 px-3.5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-900">
                  G
                </span>
              )}
              Continue with Google
            </button>

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border-soft" />
              <span className="text-[11px] uppercase text-text-muted">
                or
              </span>
              <span className="h-px flex-1 bg-border-soft" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-soft bg-surface-2 px-3.5 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-text-secondary">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null) }}
                      className="text-xs text-text-muted hover:text-accent transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-soft bg-surface-2 px-3.5 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <Loader size={14} className="animate-spin" />}
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-text-muted">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
                className="text-accent underline-offset-2 hover:underline"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
