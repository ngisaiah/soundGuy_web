import { Download, ArrowRight, Wifi, Lock, Apple } from 'lucide-react'
import { DOWNLOAD_URL } from '../data/siteContent'

const trustBadges = [
  { icon: Wifi,  label: 'Runs fully offline' },
  { icon: Lock,  label: 'No cloud processing' },
  { icon: Apple, label: 'Built for macOS' },
]

function CommandFlowCard() {
  return (
    <div className="card w-full max-w-sm p-5 space-y-3 select-none" aria-hidden="true">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse-slow" />
        <span className="text-xs text-text-muted mono">SoundGuy — listening</span>
      </div>

      {[
        { who: 'you', text: '"SoundGuy"',          color: 'text-text-secondary' },
        { who: 'app', text: '🔔 beep',             color: 'text-accent' },
        { who: 'you', text: '"record"',             color: 'text-text-secondary' },
        { who: 'app', text: '⌨︎  ⌘R → Logic Pro X', color: 'text-green-400' },
      ].map(({ who, text, color }, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="mono text-[10px] text-text-muted w-8 pt-0.5 shrink-0">
            {who === 'you' ? 'you' : 'app'}
          </span>
          <span className={`mono text-sm font-medium ${color}`}>{text}</span>
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="container-site">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-14">

          {/* Left: copy */}
          <div className="max-w-xl">
            <div className="pill mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Voice control for Logic Pro X
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.12] tracking-tight text-text-primary mb-5">
              Control Logic Pro X
              <br />
              <span className="text-accent">hands-free.</span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-md">
              Say "SoundGuy" and speak a command. The app triggers the matching Logic Pro X
              keyboard shortcut instantly — fully offline, no cloud, no latency.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a href={DOWNLOAD_URL} className="btn-primary">
                <Download size={16} />
                Download for macOS
              </a>
              <a href="#setup" className="btn-secondary">
                View setup
                <ArrowRight size={15} />
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {trustBadges.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-sm text-text-muted">
                  <Icon size={14} className="text-accent" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: command flow mock */}
          <div className="flex justify-center lg:justify-end">
            <CommandFlowCard />
          </div>
        </div>
      </div>
    </section>
  )
}
