import { steps } from '../data/siteContent'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="section-label mb-3">How it works</p>
          <h2 className="section-heading">Four steps, zero friction.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ number, label, description }, i) => (
            <div
              key={number}
              className="card p-6 flex flex-col gap-4 group"
            >
              <div className="flex items-center gap-3">
                <span className="mono text-xs font-medium text-accent bg-accent-subtle rounded-lg px-2 py-1">
                  {number}
                </span>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-gradient-to-r from-border-soft to-transparent" />
                )}
              </div>
              <h3 className="text-base font-semibold text-text-primary">{label}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
