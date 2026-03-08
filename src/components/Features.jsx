import { WifiOff, Mic, Zap, Keyboard } from 'lucide-react'
import { features } from '../data/siteContent'

const iconMap = { WifiOff, Mic, Zap, Keyboard }

export default function Features() {
  return (
    <section className="py-24">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Features</p>
          <h2 className="section-heading">Built for real recording sessions.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map(({ icon, title, description }) => {
            const Icon = iconMap[icon]
            return (
              <div key={title} className="card p-7 flex gap-5 group">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-200">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-1.5">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
