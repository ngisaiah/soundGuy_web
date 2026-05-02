import { Download, Check } from 'lucide-react'
import { DOWNLOAD_URL } from '../data/siteContent'

export default function CheckoutSuccessModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(6px)' }}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-border-soft bg-surface-1 p-8 shadow-card text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
          <Check size={26} className="text-accent" />
        </div>

        <p className="section-label mb-2">Purchase complete</p>
        <h2 className="text-xl font-bold text-text-primary mb-3">You're in. Welcome to SoundGuy.</h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          Your license is active. Download the app, drag it to Applications, and you're ready to record hands-free.
        </p>

        <a
          href={DOWNLOAD_URL}
          onClick={onClose}
          className="btn-primary w-full justify-center py-3 mb-3"
        >
          <Download size={15} />
          Download SoundGuy
        </a>

        <button
          onClick={onClose}
          className="w-full text-sm text-text-muted hover:text-text-secondary transition-colors py-1"
        >
          I'll download later
        </button>
      </div>
    </div>
  )
}
