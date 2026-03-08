import { ShieldCheck } from 'lucide-react'
import ComingSoonButton from './ComingSoonButton'

export default function DownloadSection() {
  return (
    <section className="py-24">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-3xl border border-border-soft bg-surface-1 px-8 py-16 text-center shadow-card">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(124,111,255,0.18) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative">
            <p className="section-label mb-4">Download</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 tracking-tight">
              Ready to go hands-free?
            </h2>
            <p className="text-text-secondary text-base max-w-md mx-auto mb-9 leading-relaxed">
              Download SoundGuy, drop it in your Applications folder, grant two permissions,
              and start recording without touching your keyboard.
            </p>

            <ComingSoonButton size="lg" />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-accent" />
                Apple notarized build
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-accent" />
                Requires macOS 13 or later
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
