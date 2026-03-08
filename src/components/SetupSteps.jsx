import { ChevronRight } from 'lucide-react'
import { setupSteps } from '../data/siteContent'

export default function SetupSteps() {
  return (
    <section id="setup" className="py-24">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Getting started</p>
          <h2 className="section-heading">Up and running in minutes.</h2>
          <p className="mt-3 text-text-secondary text-sm max-w-md mx-auto">
            SoundGuy requires two macOS permissions to work. Here's exactly how to set everything up.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {setupSteps.map(({ step, title, description, path }) => (
            <div
              key={step}
              className="card p-5 flex gap-5 items-start"
            >
              <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-accent-subtle text-accent text-xs font-semibold mono">
                {step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
                {path && (
                  <div className="mt-2.5 flex items-center gap-1 text-xs mono text-accent bg-accent-subtle rounded-lg px-3 py-1.5 w-fit border border-accent/15">
                    <ChevronRight size={11} className="shrink-0" />
                    {path}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
