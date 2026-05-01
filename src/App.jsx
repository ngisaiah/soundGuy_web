import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import SetupSteps from './components/SetupSteps'
import CommandsTable from './components/CommandsTable'
import PricingSection from './components/PricingSection'
import DownloadSection from './components/DownloadSection'
import Footer from './components/Footer'
import BackgroundCanvas from './components/BackgroundCanvas'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthCallback from './components/AuthCallback'

// Handles ?checkout=success redirect from Stripe — refreshes license state
function CheckoutSuccessHandler() {
  const { fetchLicense } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'success') {
      // Remove the query param without a full page reload
      window.history.replaceState({}, '', window.location.pathname)
      // Give the webhook a moment, then refresh
      setTimeout(fetchLicense, 1500)
    }
  }, [])

  return null
}

export default function App() {
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />
  }

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
          <CheckoutSuccessHandler />
          <Hero />
          <HowItWorks />
          <Features />
          <SetupSteps />
          <CommandsTable />
          <PricingSection />
          <DownloadSection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
