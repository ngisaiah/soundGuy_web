import Nav from './components/Nav'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import SetupSteps from './components/SetupSteps'
import CommandsTable from './components/CommandsTable'
import DownloadSection from './components/DownloadSection'
import Footer from './components/Footer'
import BackgroundCanvas from './components/BackgroundCanvas'

export default function App() {
  return (
    <>
      <BackgroundCanvas />
      {/* Fixed top glow — stays pinned as you scroll */}
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
          <Hero />
          <HowItWorks />
          <Features />
          <SetupSteps />
          <CommandsTable />
          <DownloadSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
