import { useEffect, useRef, useState } from 'react'
import { usePostHog } from '@posthog/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import SetupSteps from './components/SetupSteps'
import CommandsTable from './components/CommandsTable'
import PricingSection from './components/PricingSection'
import DownloadSection from './components/DownloadSection'
import DemoVideo from './components/DemoVideo'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import BackgroundCanvas from './components/BackgroundCanvas'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthCallback from './components/AuthCallback'
import ResetPassword from './components/ResetPassword'
import AuthModal from './components/AuthModal'
import ResetPasswordModal from './components/ResetPasswordModal'
import CheckoutSuccessModal from './components/CheckoutSuccessModal'

function ResetPasswordGate() {
  const { pendingPasswordReset } = useAuth()
  if (!pendingPasswordReset) return null
  return <ResetPasswordModal />
}

// Opens the auth modal in forgot-password mode when ?auth=forgot is in the URL (deeplink from macOS app)
function ForgotPasswordGate() {
  const posthog = usePostHog()
  const didHandleForgotPassword = useRef(false)
  const [open, setOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('auth') === 'forgot'
  })

  useEffect(() => {
    if (open && !didHandleForgotPassword.current) {
      didHandleForgotPassword.current = true
      posthog?.capture('forgot_password_deeplink_opened')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [open, posthog])

  if (!open) return null
  return <AuthModal initialMode="forgot" onClose={() => setOpen(false)} onSuccess={() => setOpen(false)} />
}

// Handles ?checkout=success redirect from Stripe — refreshes license and shows download prompt
function CheckoutSuccessHandler() {
  const posthog = usePostHog()
  const { fetchLicense } = useAuth()
  const didHandleCheckoutSuccess = useRef(false)
  const [showModal, setShowModal] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('checkout') === 'success'
  })

  useEffect(() => {
    if (showModal && !didHandleCheckoutSuccess.current) {
      didHandleCheckoutSuccess.current = true
      posthog?.capture('checkout_success')
      window.history.replaceState({}, '', window.location.pathname)
      setTimeout(fetchLicense, 1500)
    }
  }, [showModal, fetchLicense, posthog])

  if (!showModal) return null
  return <CheckoutSuccessModal onClose={() => setShowModal(false)} />
}

export default function App() {
  if (window.location.pathname === '/auth/callback') return <AuthCallback />
  if (window.location.pathname === '/auth/reset-password') return <ResetPassword />

  return (
    <AuthProvider>
      <BackgroundCanvas />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '420px',
          background: 'radial-gradient(ellipse 70% 100% at 50% -10%, rgba(124,111,255,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <main>
          <ResetPasswordGate />
          <ForgotPasswordGate />
          <CheckoutSuccessHandler />
          <Hero />
          <DemoVideo />
          <HowItWorks />
          <Features />
          <SetupSteps />
          <CommandsTable />
          <PricingSection />
          <DownloadSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
