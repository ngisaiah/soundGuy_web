import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import { usePostHog } from '@posthog/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ResetPasswordModal() {
  const posthog = usePostHog()
  const { setPendingPasswordReset } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

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
      posthog?.capture('password_update_succeeded')
      setDone(true)
    } catch (err) {
      setError(err.message)
      posthog?.capture('password_update_failed', { message: err.message })
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setPendingPasswordReset(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(6px)' }}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-border-soft bg-surface-1 p-8 shadow-card">
        {!done && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

        {done ? (
          <div className="text-center py-2">
            <p className="section-label mb-3">Password updated</p>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Your password has been changed successfully.
            </p>
            <button onClick={handleClose} className="btn-primary justify-center w-full py-2.5">
              Continue
            </button>
          </div>
        ) : (
          <>
            <p className="section-label mb-1">Reset password</p>
            <h2 className="text-xl font-bold text-text-primary mb-6">Set a new password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-border-soft bg-surface-2 px-3.5 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border-soft bg-surface-2 px-3.5 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
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
                Update password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
