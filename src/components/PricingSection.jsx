import { useState } from 'react'
import { Check, Download, Loader, ShieldCheck, Zap, Mic, WifiOff, Keyboard, RotateCcw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'
import { DOWNLOAD_URL } from '../data/siteContent'

const includes = [
  { icon: Mic,      text: 'Hands-free recording control for Logic Pro' },
  { icon: Zap,      text: 'Wake-word detection ("SoundGuy")' },
  { icon: WifiOff,  text: 'Sub-second, fully offline recognition' },
  { icon: Keyboard, text: 'All built-in recording commands' },
  { icon: RotateCcw, text: '7-day money-back guarantee' },
  { icon: Check,    text: 'No subscription — yours forever' },
]

export default function PricingSection() {
  const { user, license, licenseLoading, startCheckout, authLoading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)

  const hasAccess = license?.has_access === true

  async function handleBuy() {
    if (!user) {
      setShowAuth(true)
      return
    }
    setCheckoutError(null)
    setCheckoutLoading(true)
    try {
      await startCheckout()
    } catch (err) {
      setCheckoutError(err.message)
      setCheckoutLoading(false)
    }
  }

  function renderCTA() {
    if (authLoading || licenseLoading) {
      return (
        <button disabled className="btn-primary w-full justify-center py-3 opacity-60 cursor-not-allowed">
          <Loader size={15} className="animate-spin" />
          Loading…
        </button>
      )
    }

    if (hasAccess) {
      return (
        <a href={DOWNLOAD_URL} className="btn-primary w-full justify-center py-3">
          <Download size={15} />
          Download SoundGuy
        </a>
      )
    }

    return (
      <button
        onClick={handleBuy}
        disabled={checkoutLoading}
        className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {checkoutLoading && <Loader size={15} className="animate-spin" />}
        {!checkoutLoading && !user && 'Sign in to purchase'}
        {!checkoutLoading && user && 'Buy SoundGuy — $19.99'}
      </button>
    )
  }

  return (
    <section id="pricing" className="py-24">
      <div className="container-site">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Pricing</p>
          <h2 className="section-heading">Pay once. Record hands-free forever.</h2>
          <p className="mt-3 text-text-secondary text-base max-w-sm mx-auto leading-relaxed">
            One purchase. No subscription. Try SoundGuy for 7 days and request a refund if it is not right for you.
          </p>
        </div>

        <div className="mx-auto max-w-sm">
          <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface-1 p-8 shadow-card">
            {/* Glow accent */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,111,255,0.5) 0%, transparent 70%)' }}
              aria-hidden="true"
            />

            <div className="relative">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold text-text-primary">$19.99</span>
                <span className="pb-1 text-sm text-text-muted">one-time</span>
              </div>
              <p className="text-sm text-text-secondary mb-6">SoundGuy for macOS</p>
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-green-500/25 bg-green-500/10 px-3.5 py-3 text-sm text-green-300">
                <RotateCcw size={15} className="mt-0.5 shrink-0" />
                <span>Try it for 7 days. If SoundGuy does not fit your workflow, request a refund.</span>
              </div>

              <ul className="space-y-3 mb-8">
                {includes.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <Check size={11} className="text-accent" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              {hasAccess && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-500/25 bg-green-500/10 px-3.5 py-2.5 text-sm text-green-400">
                  <Check size={14} />
                  You have access — enjoy SoundGuy!
                </div>
              )}

              {checkoutError && (
                <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {checkoutError}
                </p>
              )}

              {renderCTA()}

              <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-accent" />
                  Secure checkout via Stripe
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-accent" />
                  macOS 13+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false)
            // after sign-in, re-trigger checkout automatically
            handleBuy()
          }}
        />
      )}
    </section>
  )
}
