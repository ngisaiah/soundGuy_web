import { useEffect } from 'react'

export default function AuthCallback() {
  useEffect(() => {
    // Forward all query params (the PKCE ?code=) to the macOS app via custom URL scheme
    window.location.href = `soundguy://auth/callback${window.location.search}`
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: '#7c6fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 11 A8 8 0 0 1 20 11" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="2" y="11" width="3" height="6" rx="1" fill="white"/>
          <rect x="19" y="11" width="3" height="6" rx="1" fill="white"/>
          <rect x="11" y="13" width="2" height="6" fill="white"/>
          <circle cx="12" cy="11" r="3" fill="white"/>
        </svg>
      </div>
      <p style={{ color: '#f0f0f5', fontSize: 17, fontWeight: 700, margin: 0 }}>
        Signed in to SoundGuy
      </p>
      <p style={{ color: '#9898ac', fontSize: 13, margin: 0 }}>
        You can close this tab.
      </p>
    </div>
  )
}
