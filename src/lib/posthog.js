import posthog from 'posthog-js'

export const posthogToken = import.meta.env.VITE_POSTHOG_TOKEN
export const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'
export const isPostHogConfigured = Boolean(posthogToken)

if (isPostHogConfigured) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: '2026-01-30',
    capture_pageview: true,
  })
}

export default posthog
