import { useState } from 'react'
import { Download, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Setup',        href: '#setup' },
  { label: 'Commands',     href: '#commands' },
  { label: 'Pricing',      href: '#pricing' },
]

export default function Nav() {
  const { user, authLoading, signOut } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <>
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

          <div className="flex items-center gap-2">
            {!authLoading && !user && (
              <button
                onClick={() => setShowAuth(true)}
                className="btn-secondary py-2 text-xs"
              >
                Sign in
              </button>
            )}

            {!authLoading && user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-2 px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-surface-3"
                >
                  <User size={13} className="text-accent" />
                  <span className="hidden sm:block max-w-[120px] truncate">{user.email}</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 top-full mt-2 z-20 w-44 rounded-xl border border-border-soft bg-surface-2 py-1 shadow-card">
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false) }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
                      >
                        <LogOut size={13} />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <a href="#pricing" className="btn-primary py-2 text-xs">
              <Download size={14} />
              Get SoundGuy
            </a>
          </div>
        </div>
      </header>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      )}
    </>
  )
}
