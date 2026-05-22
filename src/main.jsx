import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from '@posthog/react'
import './index.css'
import App from './App.jsx'
import posthog, { isPostHogConfigured } from './lib/posthog'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider client={isPostHogConfigured ? posthog : undefined}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
