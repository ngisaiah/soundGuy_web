import ComingSoonButton from './ComingSoonButton'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Setup',        href: '#setup' },
  { label: 'Commands',     href: '#commands' },
]

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border-subtle bg-surface-0/80 backdrop-blur-md">
      <div className="container-site flex h-14 items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-white transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 11 A8 8 0 0 1 20 11" stroke="#7c6fff" strokeWidth="2" fill="none"/>
            <rect x="2" y="11" width="3" height="6" rx="1" fill="#7c6fff"/>
            <rect x="19" y="11" width="3" height="6" rx="1" fill="#7c6fff"/>
            <rect x="11" y="13" width="2" height="6" fill="#7c6fff"/>
            <circle cx="12" cy="11" r="3" fill="#7c6fff"/>
          </svg>
          SoundGuy
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
            >
              {label}
            </a>
          ))}
        </nav>

        <ComingSoonButton size="sm" />
      </div>
    </header>
  )
}
